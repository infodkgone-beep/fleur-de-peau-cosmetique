"use client"

import { useState } from "react"
import Link from "next/link"
import { Minus, Plus } from "lucide-react"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { formatPrice } from "@/lib/products"
import type { StorefrontProduct } from "@/lib/storefront"

/** Pourcentage de réduction arrondi, ou null si le produit n'est pas en promo. */
function discountPercent(price: number, oldPrice: number | null): number | null {
  if (!oldPrice || oldPrice <= price) return null
  return Math.round((1 - price / oldPrice) * 100)
}

export function Products({ products }: { products: StorefrontProduct[]; whatsappNumber?: string }) {
  return (
    <section id="boutique" className="bg-secondary/40 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-foreground">Notre sélection</p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Nos produits phares
          </h2>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            Des soins soigneusement sélectionnés pour révéler l&apos;éclat naturel de votre peau.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">
              Aucun produit disponible pour l&apos;instant. Revenez bientôt !
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: StorefrontProduct }) {
  // Quantité choisie directement sur la carte produit, avant l'ajout au panier — pour ne pas
  // obliger le client à ouvrir la fiche produit ou à corriger la quantité une fois dans le panier.
  const [quantity, setQuantity] = useState(1)

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/produit/${product.slug}`} className="relative block aspect-square overflow-hidden bg-secondary/50">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.imported && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-gold-foreground shadow">
            Importé
          </span>
        )}
        {discountPercent(product.price, product.oldPrice) !== null && (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-primary-foreground shadow">
            -{discountPercent(product.price, product.oldPrice)}%
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-x-3 bottom-3 rounded-full bg-foreground/80 px-2.5 py-1 text-center text-[0.65rem] font-bold uppercase tracking-wide text-background shadow">
            Rupture de stock
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
          {product.brand ?? "Fleur de peau"}
        </p>
        <Link href={`/produit/${product.slug}`}>
          <h3 className="mt-1 font-serif text-base font-semibold leading-snug text-foreground hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
          {product.oldPrice && (
            <p className="text-sm font-medium text-muted-foreground line-through">{formatPrice(product.oldPrice)}</p>
          )}
        </div>

        {product.inStock && (
          <>
            <div className="mt-3 flex items-center justify-between rounded-full border border-border bg-background px-1 py-1">
              <button
                type="button"
                aria-label="Diminuer la quantité"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary hover:text-primary"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="text-xs font-semibold text-foreground">{quantity}</span>
              <button
                type="button"
                aria-label="Augmenter la quantité"
                disabled={quantity >= Math.min(50, product.stockQuantity)}
                onClick={() => setQuantity((q) => Math.min(50, product.stockQuantity, q + 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground/70"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            {product.stockQuantity <= 5 && (
              <p className="mt-1 text-center text-[0.65rem] font-medium text-destructive">
                Plus que {product.stockQuantity} en stock
              </p>
            )}
          </>
        )}

        <AddToCartButton
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.image,
          }}
          quantity={quantity}
          disabled={!product.inStock}
          className="mt-2"
          onAdded={() => setQuantity(1)}
        />
      </div>
    </article>
  )
}
