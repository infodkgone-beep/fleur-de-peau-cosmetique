"use client"

import { useTransition } from "react"
import { updateOrderStatus } from "@/lib/actions/orders"
import type { OrderStatus } from "@/lib/types/database"
import { toWhatsAppNumber } from "@/lib/phone"
import { buildStatusUpdateMessage } from "@/lib/order-status-messages"

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "en_attente", label: "En attente" },
  { value: "confirmee", label: "Confirmée" },
  { value: "expediee", label: "Expédiée" },
  { value: "livree", label: "Livrée" },
  { value: "annulee", label: "Annulée" },
]

export function OrderStatusSelect({
  orderId,
  status,
  orderNumber,
  customerPhone,
}: {
  orderId: string
  status: OrderStatus
  orderNumber: string
  customerPhone: string | null
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const value = e.target.value as OrderStatus
        if (value === "annulee" && !confirm("Annuler cette commande ? Le stock sera automatiquement remis.")) {
          e.target.value = status
          return
        }

        // Ouvre un message WhatsApp pré-rempli pour prévenir le client — le staff n'a plus qu'à
        // cliquer "Envoyer" dans WhatsApp. Il reste bien un contrôle humain avant l'envoi réel.
        if (customerPhone) {
          const message = buildStatusUpdateMessage(orderNumber, value)
          if (message) {
            const waNumber = toWhatsAppNumber(customerPhone)
            window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer")
          }
        }

        startTransition(() => updateOrderStatus(orderId, value))
      }}
      className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
