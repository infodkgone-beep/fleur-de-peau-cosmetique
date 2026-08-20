"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

const adjustmentSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.coerce.number().int().refine((v) => v !== 0, "La quantité ne peut pas être 0."),
  reason: z.string().min(2, "Indique un motif."),
})

export async function adjustStock(input: z.infer<typeof adjustmentSchema>) {
  const profile = await requireRole(["super_admin", "admin_commercial"])
  const supabase = await createClient()
  const parsed = adjustmentSchema.parse(input)

  const { error } = await supabase.rpc("apply_stock_movement", {
    p_product_id: parsed.product_id,
    p_variant_id: null,
    p_quantity: parsed.quantity,
    p_movement_type: "ajustement",
    p_channel: null,
    p_reference_order_id: null,
    p_reference_purchase_id: null,
    p_reason: parsed.reason,
    p_created_by: profile.id,
  })
  if (error) throw new Error(error.message)

  revalidatePath("/admin/stock")
  revalidatePath("/admin/produits")
}

const purchaseItemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.coerce.number().int().min(1),
  unit_cost: z.coerce.number().min(0),
})

const purchaseSchema = z.object({
  supplier_id: z.string().uuid().nullable(),
  reference: z.string().nullable(),
  items: z.array(purchaseItemSchema).min(1),
  notes: z.string().nullable(),
})

/** Enregistre un achat fournisseur : augmente le stock et historise le coût. */
export async function createPurchase(input: z.infer<typeof purchaseSchema>) {
  const profile = await requireRole(["super_admin", "admin_commercial"])
  const supabase = await createClient()
  const parsed = purchaseSchema.parse(input)

  const totalCost = parsed.items.reduce((s, i) => s + i.quantity * i.unit_cost, 0)

  const { data: purchase, error } = await supabase
    .from("purchases")
    .insert({
      supplier_id: parsed.supplier_id,
      reference: parsed.reference,
      total_cost: totalCost,
      notes: parsed.notes,
      created_by: profile.id,
    })
    .select("id")
    .single()
  if (error) throw new Error(error.message)

  await supabase.from("purchase_items").insert(
    parsed.items.map((i) => ({ purchase_id: purchase!.id, product_id: i.product_id, quantity: i.quantity, unit_cost: i.unit_cost }))
  )

  for (const item of parsed.items) {
    await supabase.rpc("apply_stock_movement", {
      p_product_id: item.product_id,
      p_variant_id: null,
      p_quantity: item.quantity,
      p_movement_type: "achat",
      p_channel: null,
      p_reference_order_id: null,
      p_reference_purchase_id: purchase!.id,
      p_reason: parsed.reference ? `Achat ${parsed.reference}` : "Achat fournisseur",
      p_created_by: profile.id,
    })
  }

  revalidatePath("/admin/stock")
  revalidatePath("/admin/produits")
  revalidatePath("/admin/comptabilite")
}
