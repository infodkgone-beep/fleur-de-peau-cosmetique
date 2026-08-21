"use client"

import { useEffect } from "react"

/**
 * Enregistre le service worker (public/sw.js) côté client, uniquement en production, pour
 * activer l'installation du site comme application (mobile, PC, tablette). Ne fait rien en
 * développement pour ne jamais interférer avec le rechargement à chaud.
 */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return

    navigator.serviceWorker.register("/sw.js").catch(() => {})
  }, [])

  return null
}
