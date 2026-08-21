"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import type { SaleChannel, PaymentMethod } from "@/lib/types/database"

const orderItemSchema = z.object({
  product_id: z.string().uuid(),
  variant_id: z.string().uuid().nullable(),
  quantity: z.coerce.number().int().min(1),
  unit_price: z.coerce.number().min(0),
})

const createOrderSchema = z.object({
  channel: z.enum(["site", "whatsapp", "tiktok", "facebook", "instagram", "telephone", "boutique"]),
  customer_name: z.string().min(2),
  customer_phone: z.string().min(6),
  delivery_address: z.string().nullable(),
  items: z.array(orderItemSchema).min(1),
  discount_amount: z.coerce.number().min(0).default(0),
  delivery_fee: z.coerce.number().min(0).default(0),
  notes: z.string().nullable(),
  payment_amount: z.coerce.number().min(0).default(0),
  payment_method: z.enum(["especes", "mobile_money", "virement", "carte", "autre"]).default("especes"),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

/**
 * Enregistre une vente pour n'importe quel canal (site, WhatsApp, TikTok, téléphone, boutique...).
 * Met immédiatement à jour le stock centralisé et historise le mouvement.
 */
export async function createOrder(input: CreateOrderInput) {
  const profile = await requireRole(["super_admin", "admin_commercial"])
  const supabase = await createClient()
  const parsed = createOrderSchema.parse(input)

  // 1. Client : recherche par téléphone, sinon création
  let customerId: string
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("phone", parsed.customer_phone)
    .maybeSingle()

  if (existingCustomer) {
    customerId = existingCustomer.id
  } else {
    const { data: newCustomer, error: custError } = await supabase
      .from("customers")
      .insert({ full_name: parsed.customer_name, phone: parsed.customer_phone, address: parsed.delivery_address })
      .select("id")
      .single()
    if (custError) throw new Error(custError.message)
    customerId = newCustomer!.id
  }

  // 2. Récupère les infos produits (nom, coût actuel) pour l'instantané de la commande
  const productIds = [...new Set(parsed.items.map((i) => i.product_id))]
  const { data: productsData } = await supabase.from("products").select("id, name, cost_price").in("id", productIds)
  const productMap = new Map((productsData ?? []).map((p) => [p.id, p]))

  const subtotal = parsed.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
  const total = Math.max(0, subtotal - parsed.discount_amount + parsed.delivery_fee)

  // 3. Création de la commande
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      channel: parsed.channel as SaleChannel,
      status: "confirmee",
      payment_status: parsed.payment_amount >= total ? "paye" : parsed.payment_amount > 0 ? "partiel" : "en_attente",
      subtotal,
      discount_amount: parsed.discount_amount,
      delivery_fee: parsed.delivery_fee,
      total,
      delivery_address: parsed.delivery_address,
      notes: parsed.notes,
      created_by: profile.id,
    })
    .select("id")
    .single()

  if (orderError) throw new Error(orderError.message)
  const orderId = order!.id

  // 4. Lignes de commande
  const orderItems = parsed.items.map((item) => {
    const product = productMap.get(item.product_id)
    return {
      order_id: orderId,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name_snapshot: product?.name ?? "Produit",
      unit_price: item.unit_price,
      unit_cost: product?.cost_price ?? 0,
      quantity: item.quantity,
      line_total: item.unit_price * item.quantity,
    }
  })
  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)
  if (itemsError) throw new Error(itemsError.message)

  // 5. Mouvements de stock (un par ligne) — la fonction empêche tout stock négatif
  for (const item of parsed.items) {
    const { error: stockError } = await supabase.rpc("apply_stock_movement", {
      p_product_id: item.product_id,
      p_variant_id: item.variant_id,
      p_quantity: -item.quantity,
      p_movement_type: "vente",
      p_channel: parsed.channel as SaleChannel,
      p_reference_order_id: orderId,
      p_reference_purchase_id: null,
      p_reason: `Vente ${parsed.channel}`,
      p_created_by: profile.id,
    })
    if (stockError) throw new Error(`Stock insuffisant : ${stockError.message}`)
  }

  // 6. Paiement (si montant renseigné)
  if (parsed.payment_amount > 0) {
    await supabase.from("payments").insert({
      order_id: orderId,
      amount: parsed.payment_amount,
      method: parsed.payment_method as PaymentMethod,
      recorded_by: profile.id,
    })
  }

  await supabase.from("activity_log").insert({
    user_id: profile.id,
    action: "create",
    entity_type: "order",
    entity_id: orderId,
    details: { channel: parsed.channel, total },
  })

  revalidatePath("/admin/commandes")
  revalidatePath("/admin/stock")
  revalidatePath("/admin")
  return orderId
}

export async function updateOrderStatus(
  orderId: string,
  status: "en_attente" | "confirmee" | "expediee" | "livree" | "annulee",
  cancelReason?: string | null
) {
  const profile = await requireRole(["super_admin", "admin_commercial"])
  const supabase = await createClient()

  // Statut actuel, pour ne réagir qu'aux vraies transitions (annulation / réactivation)
  const { data: currentOrder } = await supabase
    .from("orders")
    .select("status, channel, notes")
    .eq("id", orderId)
    .single()
  const previousStatus = currentOrder?.status
  const channel = currentOrder?.channel ?? null
  const isNewCancellation = status === "annulee" && previousStatus !== "annulee"

  // Une annulation doit toujours être justifiée par un motif écrit : ça évite qu'une commande
  // déjà confirmée / expédiée / livrée (donc potentiellement déjà payée) soit annulée en
  // silence, sans laisser de trace de la raison — utile pour repérer un abus a posteriori.
  const trimmedReason = cancelReason?.trim() ?? ""
  if (isNewCancellation && !trimmedReason) {
    throw new Error("Un motif est obligatoire pour annuler une commande.")
  }

  // Annulation : on remet le stock (mouvement inverse historisé), uniquement si la commande
  // n'était pas déjà annulée (sinon on créditerait le stock plusieurs fois pour la même commande)
  if (isNewCancellation) {
    const { data: items } = await supabase.from("order_items").select("product_id, variant_id, quantity").eq("order_id", orderId)
    for (const item of items ?? []) {
      await supabase.rpc("apply_stock_movement", {
        p_product_id: item.product_id,
        p_variant_id: item.variant_id,
        p_quantity: item.quantity,
        p_movement_type: "retour",
        p_channel: null,
        p_reference_order_id: orderId,
        p_reference_purchase_id: null,
        p_reason: `Annulation de commande : ${trimmedReason}`,
        p_created_by: profile.id,
      })
    }
  }

  // Réactivation : si une commande annulée repasse à un statut actif, il faut redéduire le
  // stock (il avait été restitué lors de l'annulation), sinon le stock affiché reste faux.
  if (previousStatus === "annulee" && status !== "annulee") {
    const { data: items } = await supabase.from("order_items").select("product_id, variant_id, quantity").eq("order_id", orderId)
    for (const item of items ?? []) {
      const { error: stockError } = await supabase.rpc("apply_stock_movement", {
        p_product_id: item.product_id,
        p_variant_id: item.variant_id,
        p_quantity: -item.quantity,
        p_movement_type: "vente",
        p_channel: channel,
        p_reference_order_id: orderId,
        p_reference_purchase_id: null,
        p_reason: "Réactivation d'une commande annulée",
        p_created_by: profile.id,
      })
      if (stockError) throw new Error(`Stock insuffisant pour réactiver cette commande : ${stockError.message}`)
    }
  }

  // Le motif d'annulation est ajouté aux notes de la commande, pour être visible immédiatement
  // dans le détail de la commande, sans avoir à aller chercher dans l'historique.
  const updates: { status: typeof status; notes?: string } = { status }
  if (isNewCancellation) {
    const existingNotes = currentOrder?.notes?.trim()
    const cancelNote = `Motif d'annulation : ${trimmedReason} (par ${profile.full_name}, le ${new Date().toLocaleString("fr-FR")}).`
    updates.notes = existingNotes ? `${existingNotes}\n\n${cancelNote}` : cancelNote
  }

  const { error } = await supabase.from("orders").update(updates).eq("id", orderId)
  if (error) throw new Error(error.message)

  // Traçabilité : chaque changement de statut est historisé (qui, quand, ancien → nouveau
  // statut, et le motif s'il s'agit d'une annulation).
  await supabase.from("activity_log").insert({
    user_id: profile.id,
    action: "update",
    entity_type: "order",
    entity_id: orderId,
    details: { previous_status: previousStatus, new_status: status, reason: isNewCancellation ? trimmedReason : null },
  })

  revalidatePath("/admin/commandes")
  revalidatePath("/admin/stock")
}

/**
 * Met à jour le statut de paiement d'une commande (en_attente / partiel / payé / remboursé).
 * Pour que la comptabilité reflète l'argent réellement encaissé (et pas juste les commandes
 * passées), chaque changement enregistre aussi le mouvement correspondant dans `payments` :
 * - "payé" complète automatiquement jusqu'au montant total de la commande.
 * - "partiel" exige un montant réellement reçu (fourni par le staff).
 * - "remboursé" annule (en négatif) tout ce qui avait été enregistré comme reçu.
 * - "en_attente" ne touche à aucun paiement (aucun argent reçu).
 */
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: "en_attente" | "partiel" | "paye" | "rembourse",
  amountReceived?: number | null
) {
  const profile = await requireRole(["super_admin", "admin_commercial"])
  const supabase = await createClient()

  const { data: order } = await supabase.from("orders").select("total").eq("id", orderId).single()
  if (!order) throw new Error("Commande introuvable.")

  const { data: existingPayments } = await supabase.from("payments").select("amount").eq("order_id", orderId)
  const alreadyRecorded = (existingPayments ?? []).reduce((sum, p) => sum + p.amount, 0)

  if (paymentStatus === "paye") {
    const remaining = order.total - alreadyRecorded
    if (remaining > 0) {
      await supabase.from("payments").insert({
        order_id: orderId,
        amount: remaining,
        method: "autre" as PaymentMethod,
        recorded_by: profile.id,
        notes: "Solde encaissé (commande marquée payée dans l'admin)",
      })
    }
  } else if (paymentStatus === "partiel") {
    const amount = amountReceived ?? 0
    if (amount <= 0) {
      throw new Error("Indique un montant réellement reçu, supérieur à 0, pour un paiement partiel.")
    }
    await supabase.from("payments").insert({
      order_id: orderId,
      amount,
      method: "autre" as PaymentMethod,
      recorded_by: profile.id,
      notes: "Paiement partiel enregistré dans l'admin",
    })
  } else if (paymentStatus === "rembourse" && alreadyRecorded > 0) {
    await supabase.from("payments").insert({
      order_id: orderId,
      amount: -alreadyRecorded,
      method: "autre" as PaymentMethod,
      recorded_by: profile.id,
      notes: "Remboursement — annule les paiements précédemment enregistrés",
    })
  }

  const { error } = await supabase.from("orders").update({ payment_status: paymentStatus }).eq("id", orderId)
  if (error) throw new Error(error.message)

  await supabase.from("activity_log").insert({
    user_id: profile.id,
    action: "update",
    entity_type: "order",
    entity_id: orderId,
    details: { field: "payment_status", new_payment_status: paymentStatus, amount: paymentStatus === "partiel" ? amountReceived : null },
  })

  revalidatePath("/admin/commandes")
  revalidatePath("/admin/comptabilite")
  revalidatePath("/admin")
}
