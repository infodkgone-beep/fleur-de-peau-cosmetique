"use client"

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import { deleteProduct } from "@/lib/actions/products"

export function DeleteProductButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="ml-3 text-muted-foreground hover:text-destructive"
        aria-label="Supprimer"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    )
  }

  return (
    <span className="ml-3 inline-flex items-center gap-2 text-xs">
      Confirmer ?
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => deleteProduct(id))}
        className="font-semibold text-destructive"
      >
        Oui
      </button>
      <button type="button" onClick={() => setConfirming(false)} className="text-muted-foreground">
        Non
      </button>
    </span>
  )
}
