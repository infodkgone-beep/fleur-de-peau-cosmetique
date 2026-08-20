"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export type CartItem = {
  id: string
  slug: string
  name: string
  brand: string | null
  price: number
  image: string
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = "fp_cart"

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Charge le panier depuis localStorage au montage (côté client uniquement).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // localStorage indisponible ou contenu corrompu — on repart d'un panier vide.
    } finally {
      setHydrated(true)
    }
  }, [])

  // Persiste à chaque changement, une fois l'hydratation initiale faite (pour ne pas écraser
  // le panier sauvegardé avec un tableau vide pendant le tout premier rendu).
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Stockage plein ou indisponible — le panier reste fonctionnel en mémoire pour la session.
    }
  }, [items, hydrated])

  function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    setItems((current) => {
      const existing = current.find((i) => i.id === item.id)
      if (existing) {
        return current.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i))
      }
      return [...current, { ...item, quantity }]
    })
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((i) => i.id !== id))
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((current) => current.map((i) => (i.id === id ? { ...i, quantity } : i)))
  }

  function clear() {
    setItems([])
  }

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])
  const totalPrice = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart doit être utilisé à l'intérieur de <CartProvider>.")
  return ctx
}
