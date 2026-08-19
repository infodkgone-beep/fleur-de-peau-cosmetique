"use client"

import { useState, type FormEvent } from "react"
import { WhatsAppIcon } from "@/components/site-header"
import { WHATSAPP_NUMBER, formatPrice, type Product } from "@/lib/products"

type Errors = {
  prenom?: string
  lieu?: string
  telephone?: string
}

export function OrderForm({ product, onSubmitted }: { product: Product; onSubmitted?: () => void }) {
  const [prenom, setPrenom] = useState("")
  const [lieu, setLieu] = useState("")
  const [telephone, setTelephone] = useState("")
  const [errors, setErrors] = useState<Errors>({})

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors: Errors = {}
    if (!prenom.trim()) nextErrors.prenom = "Le prénom est obligatoire."
    if (!lieu.trim()) nextErrors.lieu = "Le lieu de livraison est obligatoire."
    if (!telephone.trim()) nextErrors.telephone = "Le numéro de téléphone est obligatoire."

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const priceLine = product.oldPrice
      ? `💰 Prix : ${formatPrice(product.price)} (au lieu de ${formatPrice(product.oldPrice)})\n`
      : `💰 Prix : ${formatPrice(product.price)}\n`

    const message =
      `Bonjour Fleur de peau Cosmétique ! Je souhaite commander :\n\n` +
      `🌸 Produit : ${product.name} (${product.brand})\n` +
      priceLine +
      `\n👤 Prénom : ${prenom}\n` +
      `📍 Lieu de livraison : ${lieu}\n` +
      `📞 Téléphone : ${telephone}`

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank", "noopener,noreferrer")
    onSubmitted?.()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex items-center gap-4 rounded-2xl border border-gold/40 bg-secondary/60 p-3">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0">
          <p className="truncate font-serif text-base font-semibold text-foreground">{product.name}</p>
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <p className="mt-0.5 flex items-baseline gap-2 text-sm font-bold text-primary">
            {formatPrice(product.price)}
            {product.oldPrice && (
              <span className="text-xs font-medium text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </p>
        </div>
      </div>

      <Field
        id="prenom"
        label="Prénom"
        placeholder="Votre prénom"
        value={prenom}
        onChange={setPrenom}
        error={errors.prenom}
      />
      <Field
        id="lieu"
        label="Lieu de livraison"
        placeholder="Ex : Cocody, Abidjan"
        value={lieu}
        onChange={setLieu}
        error={errors.lieu}
      />
      <Field
        id="telephone"
        label="Numéro de téléphone"
        type="tel"
        placeholder="Ex : 07 00 00 00 00"
        value={telephone}
        onChange={setTelephone}
        error={errors.telephone}
      />

      <button
        type="submit"
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
      >
        <WhatsAppIcon className="h-4 w-4" />
        Envoyer la commande sur WhatsApp
      </button>
      <p className="text-center text-xs text-muted-foreground">
        Vous serez redirigé vers WhatsApp avec votre commande pré-remplie.
      </p>
    </form>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  placeholder?: string
  type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label} <span className="text-primary">*</span>
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`rounded-xl border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
          error ? "border-destructive" : "border-border"
        }`}
      />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}
