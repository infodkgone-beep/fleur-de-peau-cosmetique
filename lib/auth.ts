import "server-only"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { ProfileRow, UserRole } from "@/lib/types/database"

export { ROLE_LABELS } from "@/lib/roles"

/** Récupère le profil staff de l'utilisateur connecté, ou null. */
export async function getCurrentProfile(): Promise<ProfileRow | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (profile as ProfileRow) ?? null
}

/**
 * Exige que l'utilisateur soit connecté et ait un rôle staff actif.
 * Si `allowedRoles` est fourni, exige en plus que le rôle en fasse partie.
 * Redirige vers /login sinon.
 */
export async function requireRole(allowedRoles?: UserRole[]): Promise<ProfileRow> {
  const profile = await getCurrentProfile()

  if (!profile || !profile.role || !profile.active) {
    redirect("/login")
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    redirect("/admin?erreur=acces-refuse")
  }

  return profile
}
