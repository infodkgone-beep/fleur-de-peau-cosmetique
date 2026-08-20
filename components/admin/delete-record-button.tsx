"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"

export function DeleteRecordButton({ id, action }: { id: string; action: (id: string) => Promise<void> }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm("Supprimer cet enregistrement ?")) {
          startTransition(() => action(id))
        }
      }}
      className="text-muted-foreground hover:text-destructive disabled:opacity-50"
      aria-label="Supprimer"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
