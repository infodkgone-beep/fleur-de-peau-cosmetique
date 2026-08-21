"use client"

import { useEffect, useState } from "react"
import { Download, Share, X } from "lucide-react"

/**
 * Bouton flottant "Installer l'application" — visible sur Android / Chrome / Edge / PC
 * (Windows, Mac) dès que le navigateur signale que le site est installable, et bannière
 * d'instructions dédiée sur iOS/iPadOS (Safari ne propose pas d'installation automatique,
 * il faut passer par le menu Partager > "Sur l'écran d'accueil").
 * Ne s'affiche jamais si le site est déjà installé (mode standalone), et se souvient d'un
 * "Fermer" pour ne pas revenir harceler le visiteur à chaque page.
 */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISS_KEY = "fdp-pwa-install-dismissed"

export function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIosHint, setShowIosHint] = useState(false)
  const [dismissed, setDismissed] = useState(true) // true tant qu'on n'a pas vérifié le localStorage

  useEffect(() => {
    const alreadyInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    const alreadyDismissed = window.localStorage.getItem(DISMISS_KEY) === "1"
    setDismissed(alreadyDismissed || alreadyInstalled)

    if (alreadyInstalled) return

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    function onAppInstalled() {
      setDeferredPrompt(null)
      setDismissed(true)
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt)
    window.addEventListener("appinstalled", onAppInstalled)

    // iOS n'envoie jamais "beforeinstallprompt" : on détecte Safari iOS pour proposer
    // les instructions manuelles à la place.
    const ua = window.navigator.userAgent
    const isIos = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && "ontouchend" in document)
    if (isIos && !alreadyDismissed && !alreadyInstalled) {
      setShowIosHint(true)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt)
      window.removeEventListener("appinstalled", onAppInstalled)
    }
  }, [])

  function handleDismiss() {
    window.localStorage.setItem(DISMISS_KEY, "1")
    setDismissed(true)
    setShowIosHint(false)
  }

  async function handleInstallClick() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  if (dismissed) return null

  // Android / Chrome / Edge / PC : bouton d'installation natif
  if (deferredPrompt) {
    return (
      <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-primary py-2.5 pl-4 pr-2 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30">
        <button type="button" onClick={handleInstallClick} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Installer l&apos;application
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Fermer"
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-primary-foreground/80 transition-colors hover:bg-primary-foreground/20"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  // iOS / iPadOS Safari : pas de prompt natif possible, on explique la manip
  if (showIosHint) {
    return (
      <div className="fixed bottom-5 left-5 right-5 z-40 mx-auto flex max-w-sm items-start gap-3 rounded-2xl border border-gold/40 bg-card p-4 text-sm text-foreground shadow-xl sm:right-auto">
        <Share className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
        <p className="leading-relaxed">
          Pour installer l&apos;application : appuyez sur <span className="font-semibold">Partager</span> en bas de
          Safari, puis <span className="font-semibold">« Sur l&apos;écran d&apos;accueil »</span>.
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Fermer"
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  return null
}
