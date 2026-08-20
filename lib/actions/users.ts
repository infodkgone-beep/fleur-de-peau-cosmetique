"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import type { UserRole } from "@/lib/types/database"

const createStaffSchema = z.object({
  fullName: z.string().min(2, "Le nom complet est obligatoire."),
  email: z.string().email("Adresse e-mail invalide."),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  role: z.enum(["super_admin", "admin_commercial", "content_manager"]),
})

/** Crée un compte staff (Auth + profil) et lui attribue directement un rôle. Réservé au Super Admin. */
export async function createStaffUser(input: z.infer<typeof createStaffSchema>) {
  const actingProfile = await requireRole(["super_admin"])
  const parsed = createStaffSchema.parse(input)
  const admin = createAdminClient()

  const { data, error } = await admin.auth.admin.createUser({
    email: parsed.email,
    password: parsed.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.fullName },
  })
  if (error) throw new Error(error.message)
  if (!data.user) throw new Error("La création du compte a échoué.")

  // Le trigger handle_new_user() vient de créer le profil avec role = null — on lui attribue son rôle.
  const { error: updateError } = await admin
    .from("profiles")
    .update({ role: parsed.role, full_name: parsed.fullName })
    .eq("id", data.user.id)
  if (updateError) throw new Error(updateError.message)

  await admin.from("activity_log").insert({
    user_id: actingProfile.id,
    action: "create",
    entity_type: "staff_user",
    entity_id: data.user.id,
    details: { email: parsed.email, role: parsed.role },
  })

  revalidatePath("/admin/utilisateurs")
}

const roleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["super_admin", "admin_commercial", "content_manager"]),
})

/** Change le rôle d'un membre du staff. Réservé au Super Admin. */
export async function updateUserRole(input: z.infer<typeof roleSchema>) {
  const actingProfile = await requireRole(["super_admin"])
  const supabase = await createClient()
  const parsed = roleSchema.parse(input)

  if (parsed.userId === actingProfile.id && parsed.role !== "super_admin") {
    throw new Error("Tu ne peux pas retirer ton propre rôle de Super Admin.")
  }

  const { error } = await supabase.from("profiles").update({ role: parsed.role as UserRole }).eq("id", parsed.userId)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/utilisateurs")
}

/** Active/désactive un compte staff (sans le supprimer). Réservé au Super Admin. */
export async function toggleUserActive(userId: string, active: boolean) {
  const actingProfile = await requireRole(["super_admin"])
  const supabase = await createClient()

  if (userId === actingProfile.id && !active) {
    throw new Error("Tu ne peux pas désactiver ton propre compte.")
  }

  const { error } = await supabase.from("profiles").update({ active }).eq("id", userId)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/utilisateurs")
}
