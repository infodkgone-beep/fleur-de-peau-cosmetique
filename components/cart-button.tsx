"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function CartButton() {
  const { totalItems } = useCart()

  return (
    <Link
      href="/panier"
      aria-label="Voir le panier"
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
    >
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-bold text-primary-foreground">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  )
}
