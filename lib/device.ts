"use client"

/**
 * Détecte si l'appareil courant est un mobile ou une tablette.
 *
 * Utilisé pour décider du parcours de commande côté boutique publique : sur mobile/tablette,
 * WhatsApp est déjà installé et le lien wa.me ouvre l'application directement (bonne expérience).
 * Sur PC ou TV (tout le reste : Windows, macOS, Linux, Smart TV...), wa.me redirige vers une page
 * web WhatsApp peu pratique, donc la commande est enregistrée directement dans le système
 * (visible dans l'admin) plutôt que via WhatsApp.
 */
export function isMobileOrTabletDevice(): boolean {
  if (typeof navigator === "undefined") return false
  const ua = navigator.userAgent || ""

  const isKnownMobileOrTabletUA =
    /Android|iPhone|iPad|iPod|IEMobile|Windows Phone|Mobile|Tablet|BlackBerry|Opera Mini/i.test(ua)

  // iPadOS 13+ se présente comme un Mac de bureau dans le user agent : on le repère via le tactile.
  const isModernIPad =
    /Macintosh/i.test(ua) && typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 1

  return isKnownMobileOrTabletUA || isModernIPad
}
