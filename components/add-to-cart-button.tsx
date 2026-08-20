"use client"

import { useState } from "react"
import { ShoppingBag, Check } from "lucide-react"
import { useCart } from "@/lib/cart-context"

type CartProduct = {
  id: string
  slug: string
  name: string
  brand: string | null
  price: number
  image: string
}

export function AddToCartButton({
  product,
  disabled,
  variant = "primary",
  className = "",
}: {
  product: CartProduct
  disabled?: boolean
  variant?: "primary" | "secondary"
  className?: string
}) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleClick() {
    addItem(product)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1500)
  }

  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-transform disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02]"
      : "border border-primary/40 bg-card text-primary hover:bg-secondary"

  return (
    <button type="button" disabled={disabled} onClick={handleClick} className={`${base} ${styles} ${className}`}>
      {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
      {added ? "Ajouté !" : "Ajouter au panier"}
    </button>
  )
}
