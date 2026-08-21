import type { OrderStatus } from "@/lib/types/database"

/**
 * Message WhatsApp pré-rempli envoyé au client quand le staff fait évoluer le statut d'une
 * commande dans l'admin. Retourne null pour les statuts qui n'appellent pas de message
 * (ex: "en_attente", qui est l'état initial).
 */
export function buildStatusUpdateMessage(orderNumber: string, status: OrderStatus): string | null {
  switch (status) {
    case "confirmee":
      return `Bonjour ! Votre commande ${orderNumber} chez Fleur de peau Cosmétique est confirmée ✅. Nous la préparons avec soin, merci pour votre confiance !`
    case "expediee":
      return `Bonjour ! Votre commande ${orderNumber} est en cours de livraison 🚚. Elle arrive très bientôt !`
    case "livree":
      return `Bonjour ! Votre commande ${orderNumber} a bien été livrée 🌸. Merci pour votre achat chez Fleur de peau Cosmétique, prenez soin de votre peau !`
    case "annulee":
      return `Bonjour, nous sommes désolés : votre commande ${orderNumber} a été annulée. N'hésitez pas à nous contacter pour en savoir plus ou repasser commande.`
    default:
      return null
  }
}
