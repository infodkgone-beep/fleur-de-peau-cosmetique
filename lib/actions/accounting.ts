"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

const expenseSchema = z.object({
  category: z.string().min(2, "Indique une catégorie."),
  label: z.string().min(2, "Indique un libellé."),
  amount: z.coerce.number().positive("Le montant doit être positif."),
  expense_date: z.string().min(1),
  notes: z.string().nullable().optional(),
})

const revenueSchema = z.object({
  source: z.string().min(2, "Indique une source."),
  label: z.string().min(2, "Indique un libellé."),
  amount: z.coerce.number().positive("Le montant doit être positif."),
  revenue_date: z.string().min(1),
  notes: z.string().nullable().optional(),
})

/** Enregistre une dépense (loyer, salaires, publicité, transport, etc.). */
export async function addExpense(input: z.infer<typeof expenseSchema>) {
  const profile = await requireRole(["super_admin"])
  const supabase = await createClient()
  const parsed = expenseSchema.parse(input)

  const { error } = await supabase.from("expenses").insert({
    category: parsed.category,
    label: parsed.label,
    amount: parsed.amount,
    expense_date: parsed.expense_date,
    notes: parsed.notes || null,
    created_by: profile.id,
  })
  if (error) throw new Error(error.message)

  await supabase.from("activity_log").insert({
    user_id: profile.id,
    action: "create",
    entity_type: "expense",
    entity_id: null,
    details: { label: parsed.label, amount: parsed.amount },
  })

  revalidatePath("/admin/comptabilite")
}

/** Enregistre un revenu hors catalogue (prestation, vente exceptionnelle, etc.). */
export async function addRevenue(input: z.infer<typeof revenueSchema>) {
  const profile = await requireRole(["super_admin"])
  const supabase = await createClient()
  const parsed = revenueSchema.parse(input)

  const { error } = await supabase.from("revenues").insert({
    source: parsed.source,
    label: parsed.label,
    amount: parsed.amount,
    revenue_date: parsed.revenue_date,
    notes: parsed.notes || null,
    created_by: profile.id,
  })
  if (error) throw new Error(error.message)

  await supabase.from("activity_log").insert({
    user_id: profile.id,
    action: "create",
    entity_type: "revenue",
    entity_id: null,
    details: { label: parsed.label, amount: parsed.amount },
  })

  revalidatePath("/admin/comptabilite")
}

export async function deleteExpense(id: string) {
  const profile = await requireRole(["super_admin"])
  const supabase = await createClient()
  const { error } = await supabase.from("expenses").delete().eq("id", id)
  if (error) throw new Error(error.message)
  await supabase.from("activity_log").insert({
    user_id: profile.id,
    action: "delete",
    entity_type: "expense",
    entity_id: id,
    details: null,
  })
  revalidatePath("/admin/comptabilite")
}

export async function deleteRevenue(id: string) {
  const profile = await requireRole(["super_admin"])
  const supabase = await createClient()
  const { error } = await supabase.from("revenues").delete().eq("id", id)
  if (error) throw new Error(error.message)
  await supabase.from("activity_log").insert({
    user_id: profile.id,
    action: "delete",
    entity_type: "revenue",
    entity_id: id,
    details: null,
  })
  revalidatePath("/admin/comptabilite")
}
