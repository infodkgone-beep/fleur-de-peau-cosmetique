"use server"

import { randomUUID } from "crypto"
import { cookies } from "next/headers"
import { requireRole } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"

const VISITOR_COOKIE = "fp_visitor"

/**
 * Enregistre une visite anonyme sur une page publique.
 * Appelé depuis le composant client `VisitTracker`. Pose un cookie 1ère partie
 * (identifiant aléatoire, sans donnée personnelle) pour compter les visiteurs uniques.
 */
export async function recordVisit(path: string) {
  const cookieStore = await cookies()
  let visitorId = cookieStore.get(VISITOR_COOKIE)?.value

  if (!visitorId) {
    visitorId = randomUUID()
    cookieStore.set(VISITOR_COOKIE, visitorId, {
      maxAge: 60 * 60 * 24 * 365, // 1 an
      path: "/",
      sameSite: "lax",
    })
  }

  const supabase = createAdminClient()
  await supabase.from("site_visits").insert({ visitor_id: visitorId, path })
}

export type VisitorStats = {
  todayVisitors: number
  todayViews: number
  weekVisitors: number
  weekViews: number
  monthVisitors: number
  monthViews: number
  yearVisitors: number
  yearViews: number
}

/** Statistiques de fréquentation agrégées (jour / semaine / mois / année) — staff uniquement. */
export async function getVisitorStats(): Promise<VisitorStats> {
  await requireRole(["super_admin", "admin_commercial"])
  const supabase = createAdminClient()
  const { data, error } = await supabase.rpc("get_visitor_stats").single()
  if (error) throw new Error(error.message)

  return {
    todayVisitors: data.today_visitors,
    todayViews: data.today_views,
    weekVisitors: data.week_visitors,
    weekViews: data.week_views,
    monthVisitors: data.month_visitors,
    monthViews: data.month_views,
    yearVisitors: data.year_visitors,
    yearViews: data.year_views,
  }
}

export type DailyVisitors = { day: string; uniqueVisitors: number }

/** Visiteurs uniques par jour sur les N derniers jours (pour le graphique) — staff uniquement. */
export async function getDailyVisitorCounts(days = 30): Promise<DailyVisitors[]> {
  await requireRole(["super_admin", "admin_commercial"])
  const supabase = createAdminClient()
  const { data, error } = await supabase.rpc("get_daily_visitor_counts", { p_days: days })
  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => ({ day: row.day, uniqueVisitors: row.unique_visitors }))
}
