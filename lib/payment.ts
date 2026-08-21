/**
 * Modes de paiement proposés au client lors de la commande (site public). Il n'y a pas
 * d'intégration de paiement automatisée : le client indique juste son intention, le staff
 * vérifie et confirme la réception dans l'admin (le statut de paiement reste "en attente"
 * jusqu'à confirmation manuelle).
 */
export type PaymentMethodChoice = "livraison" | "wave" | "orange_money"

export const MOBILE_MONEY_NUMBER_DISPLAY = "+225 07 02 60 24 58"

export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethodChoice; label: string; shortLabel: string }[] = [
  { value: "livraison", label: "Paiement à la livraison", shortLabel: "À la livraison" },
  { value: "wave", label: `Wave (au ${MOBILE_MONEY_NUMBER_DISPLAY})`, shortLabel: "Wave" },
  { value: "orange_money", label: `Orange Money (au ${MOBILE_MONEY_NUMBER_DISPLAY})`, shortLabel: "Orange Money" },
]

export function paymentMethodLabel(method: PaymentMethodChoice): string {
  return PAYMENT_METHOD_OPTIONS.find((o) => o.value === method)?.label ?? "Paiement à la livraison"
}
