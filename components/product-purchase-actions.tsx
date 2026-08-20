"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { OrderForm } from "@/components/order-form"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { WhatsAppIcon } from "@/components/site-header"
import { WHATSAPP_NUMBER as DEFAULT_WHATSAPP_NUMBER, formatPrice, type Product } from "@/lib/products"

export function ProductPurchaseActions({
  product,
  slug,
  image,
  inStock,
  whatsappNumber = DEFAULT_WHATSAPP_NUMBER,
}: {
  product: Product
  slug: string
  image: string
  inStock: boolean
  whatsappNumber?: string
}) {
  const [open, setOpen] = useState(false)

  function quickWhatsApp() {
    const priceLine = product.oldPrice
      ? `💰 Prix : ${formatPrice(product.price)} (au lieu de ${formatPrice(product.oldPrice)})`
      : `💰 Prix : ${formatPrice(product.price)}`
    const message = `Bonjour Fleur de peau Cosmétique ! Je suis intéressé(e) par :\n\n🌸 ${product.name} (${product.brand})\n${priceLine}`
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer")
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <AddToCartButton
          product={{
            id: product.id,
            slug,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image,
          }}
          disabled={!inStock}
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={!inStock}
            onClick={() => setOpen(true)}
            className="flex-1 rounded-full border border-primary/40 bg-card px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {inStock ? "Commander maintenant" : "Rupture de stock"}
          </button>
          <button
            type="button"
            disabled={!inStock}
            onClick={quickWhatsApp}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-primary/40 bg-card px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Écrire sur WhatsApp
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Formulaire de commande"
          onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <OrderForm product={product} onSubmitted={() => setOpen(false)} whatsappNumber={whatsappNumber} />
          </div>
        </div>
      )}
    </>
  )
}
