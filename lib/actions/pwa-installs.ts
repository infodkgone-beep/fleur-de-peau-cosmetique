"use server"

import { requireRole } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Suivi des installations de l'application (PWA). Appelé depuis le composant client
 * `PwaRegister` à chaque fois que le site est ouvert en mode "application installée"
 * (voir ce composant pour le détail de la détection, différente entre Android et iOS).
 *
 * Important : il n'existe aucun moyen technique de détecter une désinstallation (aucun
 * site web ne le peut). Cette fonction enregistre seulement des OUVERTURES confirmées ;
 * c'est la page /admin/appareils qui explique comment interpréter l'inactivité.
 */
export async function logPwaOpen(deviceId: string, platform: "android" | "ios" | "desktop" | "autre", userAgent: string) {
  if (!deviceId || deviceId.length > 100) return
  const supabase = createAdminClient()

  const { data: existing } = await supabase.from("pwa_installs").select("id").eq("device_id", deviceId).maybeSingle()

  if (existing) {
    await supabase.from("pwa_installs").update({ last_seen_at: new Date().toISOString() }).eq("device_id", deviceId)
  } else {
    await supabase.from("pwa_installs").insert({
      device_id: deviceId,
      platform,
      user_agent: userAgent.slice(0, 500),
    })
  }
}

export type PwaInstallRow = {
  id: string
  deviceId: string
  platform: string
  userAgent: string | null
  installedAt: string
  lastSeenAt: string
}

export type PwaInstallStats = {
  totalInstalls: number
  active3d: number
  inactive30d: number
  androidCount: number
  iosCount: number
  desktopCount: number
  autreCount: number
}

/** Liste des appareils ayant ouvert l'application, plus récemment ouverts en premier — staff uniquement. */
export async function getPwaInstalls(): Promise<PwaInstallRow[]> {
  await requireRole(["super_admin", "admin_commercial"])
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("pwa_installs")
    .select("id, device_id, platform, user_agent, installed_at, last_seen_at")
    .order("last_seen_at", { ascending: false })
  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => ({
    id: row.id,
    deviceId: row.device_id,
    platform: row.platform,
    userAgent: row.user_agent,
    installedAt: row.installed_at,
    lastSeenAt: row.last_seen_at,
  }))
}

/** Statistiques agrégées (total, actifs, plateformes) — staff uniquement. */
export async function getPwaInstallStats(): Promise<PwaInstallStats> {
  await requireRole(["super_admin", "admin_commercial"])
  const supabase = createAdminClient()
  const { data, error } = await supabase.rpc("get_pwa_install_stats").single()
  if (error) throw new Error(error.message)

  return {
    totalInstalls: data.total_installs,
    active3d: data.active_3d,
    inactive30d: data.inactive_30d,
    androidCount: data.android_count,
    iosCount: data.ios_count,
    desktopCount: data.desktop_count,
    autreCount: data.autre_count,
  }
}
