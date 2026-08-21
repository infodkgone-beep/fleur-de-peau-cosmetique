"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { notifyAdminNewOrderWhatsApp } from "@/lib/whatsapp-cloud"
import { formatPrice } from "@/lib/products"

/**
 * Commande passée directement par un client depuis le site public. Sur PC / TV, c'est l'unique
 * canal (pas de WhatsApp) ; sur mobile / tablette, elle est enregistrée en plus du message
 * WhatsApp envoyé au client, pour que le staff retrouve toutes les commandes au même endroit
 * dans l'admin, quel que soit l'appareil utilisé. Il n'existe aucune session client sur la
 * boutique publique, donc on utilise le client "admin" (service_role) pour écrire dans
 * orders/customers/order_items/stock_movements, qui sont normalement réservées au staff par RLS.
 * La commande est créée avec le statut "en_attente" : elle doit être validée
 * (confirmée / refusée / livrée...) dans l'admin, comme n'importe quelle autre commande.
 */

const publicOrderItemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.coerce.number().int().min(1).max(50),
  unit_price: z.coerce.number().min(0),
})

const createPublicOrderSchema = z.object({
  customer_name: z.string().min(2, "Le prénom est obligatoire."),
  customer_phone: z.string().min(6, "Le numéro de téléphone est obligatoire."),
  delivery_address: z.string().min(2, "Le lieu de livraison est obligatoire."),
  items: z.array(publicOrderItemSchema).min(1),
})

export type CreatePublicOrderInput = z.infer<typeof createPublicOrderSchema>

export type CreatePublicOrderResult =
  | { ok: true; orderId: string; orderNumber: string }
  | { ok: false; error: string }

export async function createPublicOrder(input: CreatePublicOrderInput): Promise<CreatePublicOrderResult> {
  const parsed = createPublicOrderSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." }
  }
  const data = parsed.data
  const supabase = createAdminClient()

  try {
    // 1. Client : recherche par téléphone, sinon création
    let customerId: string
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", data.customer_phone)
      .maybeSingle()

    if (existingCustomer) {
      customerId = existingCustomer.id
    } else {
      const { data: newCustomer, error: custError } = await supabase
        .from("customers")
        .insert({ full_name: data.customer_name, phone: data.customer_phone, address: data.delivery_address })
        .select("id")
        .single()
      if (custError || !newCustomer) throw new Error(custError?.message ?? "Impossible de créer le client.")
      customerId = newCustomer.id
    }

    // 2. Snapshot produits (nom + coût actuel) pour la commande
    const productIds = [...new Set(data.items.map((i) => i.product_id))]
    const { data: productsData } = await supabase
      .from("products")
      .select("id, name, cost_price")
      .in("id", productIds)
    const productMap = new Map((productsData ?? []).map((p) => [p.id, p]))

    const subtotal = data.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

    // 3. Commande — statut "en_attente" : à valider par l'équipe dans l'admin
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customerId,
        channel: "site",
        status: "en_attente",
        payment_status: "en_attente",
        subtotal,
        total: subtotal,
        delivery_address: data.delivery_address,
        notes: "Commande passée directement depuis le site.",
      })
      .select("id, order_number")
      .single()

    if (orderError || !order) throw new Error(orderError?.message ?? "Impossible de créer la commande.")
    const orderId = order.id

    // 4. Lignes de commande
    const orderItems = data.items.map((item) => {
      const product = productMap.get(item.product_id)
      return {
        order_id: orderId,
        product_id: item.product_id,
        variant_id: null,
        product_name_snapshot: product?.name ?? "Produit",
        unit_price: item.unit_price,
        unit_cost: product?.cost_price ?? 0,
        quantity: item.quantity,
        line_total: item.unit_price * item.quantity,
      }
    })
    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)
    if (itemsError) throw new Error(itemsError.message)

    // 5. Réservation du stock (empêche la survente ; restitué automatiquement si l'équipe annule)
    for (const item of data.items) {
      const { error: stockError } = await supabase.rpc("apply_stock_movement", {
        p_product_id: item.product_id,
        p_variant_id: null,
        p_quantity: -item.quantity,
        p_movement_type: "vente",
        p_channel: "site",
        p_reference_order_id: orderId,
        p_reference_purchase_id: null,
        p_reason: "Commande site (client, en attente de validation)",
        p_created_by: null,
      })
      if (stockError) {
        throw new Error(
          `Un des articles n'est plus disponible en quantité suffisante. Veuillez ajuster votre commande.`
        )
      }
    }

    await supabase.from("activity_log").insert({
      user_id: null,
      action: "create",
      entity_type: "order",
      entity_id: orderId,
      details: { channel: "site", source: "public_checkout", total: subtotal },
    })

    revalidatePath("/admin/commandes")
    revalidatePath("/admin/stock")
    revalidatePath("/admin")

    // Notifie le gérant sur WhatsApp (n'a d'effet que si le compte WhatsApp Business API est
    // configuré — voir lib/whatsapp-cloud.ts). Ne doit jamais faire échouer la commande.
    notifyAdminNewOrderWhatsApp({
      orderNumber: order.order_number,
      customerName: data.customer_name,
      total: formatPrice(subtotal),
    }).catch(() => {})

    return { ok: true, orderId, orderNumber: order.order_number }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Une erreur est survenue." }
  }
}
