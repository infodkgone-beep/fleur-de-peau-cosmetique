"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { recordVisit } from "@/lib/actions/analytics"

/**
 * Enregistre discrètement chaque page publique visitée (pour les statistiques de
 * fréquentation de l'admin). Ne fait rien sur /admin et /login — on ne veut pas
 * compter le staff comme des visiteurs du site.
 */
export function VisitTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/login")) return
    recordVisit(pathname).catch(() => {
      // Une visite non enregistrée n'est jamais critique — on ignore silencieusement.
    })
  }, [pathname])

  return null
}
