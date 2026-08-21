"use client"

import { useTransition } from "react"
import { updatePaymentStatus } from "@/lib/actions/orders"
import type { PaymentStatus } from "@/lib/types/database"

const PAYMENT_STATUS_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: "en_attente", label: "En attente" },
  { value: "partiel", label: "Partiel" },
  { value: "paye", label: "Payé" },
  { value: "rembourse", label: "Remboursé" },
]

export function PaymentStatusSelect({ orderId, paymentStatus }: { orderId: string; paymentStatus: PaymentStatus }) {
  const [isPending, startTransition] = useTransition()

  return (
    <select
      defaultValue={paymentStatus}
      disabled={isPending}
      onChange={(e) => {
        const value = e.target.value as PaymentStatus
        let amount: number | null = null

        // Un paiement partiel doit préciser combien a été réellement reçu, pour que la
        // comptabilité (chiffre d'affaires encaissé) reste exacte.
        if (value === "partiel") {
          const input = prompt("Quel montant a été réellement reçu (en FCFA) ?")
          const parsed = input ? Number(input.replace(/[^\d]/g, "")) : NaN
          if (!parsed || parsed <= 0) {
            e.target.value = paymentStatus
            return
          }
          amount = parsed
        }

        startTransition(async () => {
          try {
            await updatePaymentStatus(orderId, value, amount)
          } catch (err) {
            alert(err instanceof Error ? err.message : "Une erreur est survenue.")
            e.target.value = paymentStatus
          }
        })
      }}
      className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium capitalize"
    >
      {PAYMENT_STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
