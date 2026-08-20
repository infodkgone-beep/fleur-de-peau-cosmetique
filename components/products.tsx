"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { OrderForm } from "@/components/order-form"
import { formatPrice, type Product } from "@/lib/products"
import type { StorefrontProduct } from "@/lib/storefront"

/** Pourcentage de réduction arrondi, ou null si le produit n'est pas en promo. */
function discountPercent(price: number, oldPrice: number | null): number | null {
  if (!oldPrice || oldPrice <= price) return null
  return Math.round((1 - price / oldPrice) * 100)
}

function toOrderFormProduct(p: StorefrontProduct): Product {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand ?? "Fleur de peau",
    price: p.price,
    oldPrice: p.oldPrice ?? undefined,
    image: p.image,
    imported: p.imported,
    category: p.category ?? "",
  }
}

export function Products({ products, whatsappNumber }: { products: StorefrontProduct[]; whatsappNumber?: string }) {
  const [selected, setSelected] = useState<Product | null>(null)

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [selected])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

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
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
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
                    <p className="text-sm font-medium text-muted-foreground line-through">
                      {formatPrice(product.oldPrice)}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={!product.inStock}
                  onClick={() => setSelected(toOrderFormProduct(product))}
                  className="mt-4 w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  {product.inStock ? "Commander" : "Indisponible"}
                </button>
              </div>
            </article>
          ))}
          {products.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">
              Aucun produit disponible pour l&apos;instant. Revenez bientôt !
            </p>
          )}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Formulaire de commande"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-background p-6 shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">Passer commande</h3>
                <p className="text-sm text-muted-foreground">Remplissez le formulaire ci-dessous.</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Fermer"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <OrderForm product={selected} onSubmitted={() => setSelected(null)} whatsappNumber={whatsappNumber} />
          </div>
        </div>
      )}
    </section>
  )
}
