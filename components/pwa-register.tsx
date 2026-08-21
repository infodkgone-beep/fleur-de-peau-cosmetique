"use client"

import { useEffect } from "react"
import { logPwaOpen } from "@/lib/actions/pwa-installs"

const DEVICE_ID_KEY = "fdp-pwa-device-id"

function getOrCreateDeviceId(): string {
  let id = window.localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    window.localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}

function detectPlatform(): "android" | "ios" | "desktop" | "autre" {
  const ua = window.navigator.userAgent
  if (/Android/i.test(ua)) return "android"
  if (/iPad|iPhone|iPod/i.test(ua) || (ua.includes("Macintosh") && "ontouchend" in document)) return "ios"
  if (/Windows|Macintosh|Linux/i.test(ua)) return "desktop"
  return "autre"
}

/**
 * Enregistre le service worker (public/sw.js) côté client, uniquement en production, pour
 * activer l'installation du site comme application (mobile, PC, tablette).
 *
 * Trace aussi discrètement les OUVERTURES de l'application une fois installée (voir
 * lib/actions/pwa-installs.ts), pour la page d'admin "Appareils installés". On détecte ça
 * en vérifiant si la page tourne en "mode application" (display-mode: standalone) — c'est
 * le seul signal fiable disponible sur TOUS les navigateurs, y compris iOS/Safari qui ne
 * déclenche jamais l'événement "appinstalled".
 */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (typeof window === "undefined") return

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {})
    }

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true

    if (isStandalone) {
      const deviceId = getOrCreateDeviceId()
      logPwaOpen(deviceId, detectPlatform(), window.navigator.userAgent).catch(() => {})
    }
  }, [])

  return null
}
