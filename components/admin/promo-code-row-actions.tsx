"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { togglePromoCode, deletePromoCode } from "@/lib/actions/promotions"

export function PromoCodeRowActions({ id, active }: { id: string; active: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => togglePromoCode(id, !active))}
        className={`rounded-full px-2.5 py-1 text-xs font-semibold disabled:opacity-50 ${
          active ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
        }`}
      >
        {active ? "Actif" : "Inactif"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm("Supprimer ce code promo ?")) startTransition(() => deletePromoCode(id))
        }}
        className="text-muted-foreground hover:text-destructive disabled:opacity-50"
        aria-label="Supprimer"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
