"use client"

import { useTransition } from "react"
import { updateOrderStatus } from "@/lib/actions/orders"
import type { OrderStatus } from "@/lib/types/database"

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "en_attente", label: "En attente" },
  { value: "confirmee", label: "Confirmée" },
  { value: "expediee", label: "Expédiée" },
  { value: "livree", label: "Livrée" },
  { value: "annulee", label: "Annulée" },
]

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
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
