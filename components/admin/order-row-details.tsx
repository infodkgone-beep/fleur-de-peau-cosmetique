"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { formatPrice } from "@/lib/products"

type OrderItem = {
  product_name_snapshot: string
  quantity: number
  unit_price: number
  line_total: number
}

export function OrderRowToggle({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={expanded ? "Masquer le détail" : "Voir le détail"}
      className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
    >
      {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    </button>
  )
}

export function OrderRowDetails({
  items,
  deliveryAddress,
  notes,
}: {
  items: OrderItem[]
  deliveryAddress: string | null
  notes: string | null
}) {
  return (
    <div className="flex flex-col gap-3 bg-secondary/30 p-4 text-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Articles</p>
        <ul className="mt-1.5 flex flex-col gap-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-center justify-between gap-4">
              <span className="text-foreground">
                {item.product_name_snapshot} <span className="text-muted-foreground">x{item.quantity}</span>
              </span>
              <span className="font-medium text-foreground">{formatPrice(item.line_total)}</span>
            </li>
          ))}
          {items.length === 0 && <li className="text-muted-foreground">Aucun article enregistré.</li>}
        </ul>
      </div>
      {deliveryAddress && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lieu de livraison</p>
          <p className="mt-1 text-foreground">{deliveryAddress}</p>
        </div>
      )}
      {notes && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</p>
          <p className="mt-1 text-foreground">{notes}</p>
        </div>
      )}
    </div>
  )
}
