"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

const promoSchema = z.object({
  code: z.string().min(2).transform((v) => v.toUpperCase().trim()),
  description: z.string().nullable(),
  discount_type: z.enum(["pourcentage", "montant_fixe"]),
  discount_value: z.coerce.number().positive("La valeur doit être positive."),
  usage_limit: z.coerce.number().int().positive().nullable(),
})

/** Crée un code promo. Réservé à Super Admin / Admin Commercial. */
export async function createPromoCode(input: z.infer<typeof promoSchema>) {
  const profile = await requireRole(["super_admin", "admin_commercial"])
  const supabase = await createClient()
  const parsed = promoSchema.parse(input)

  const { error } = await supabase.from("promo_codes").insert({
    code: parsed.code,
    description: parsed.description,
    discount_type: parsed.discount_type,
    discount_value: parsed.discount_value,
    usage_limit: parsed.usage_limit,
    created_by: profile.id,
  })
  if (error) throw new Error(error.message)

  revalidatePath("/admin/promotions")
}

export async function togglePromoCode(id: string, active: boolean) {
  await requireRole(["super_admin", "admin_commercial"])
  const supabase = await createClient()
  const { error } = await supabase.from("promo_codes").update({ active }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/promotions")
}

export async function deletePromoCode(id: string) {
  await requireRole(["super_admin", "admin_commercial"])
  const supabase = await createClient()
  const { error } = await supabase.from("promo_codes").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/promotions")
}
