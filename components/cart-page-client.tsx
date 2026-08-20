"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"
import { Minus, Plus, Trash2, ShoppingBag, Truck } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatPrice, WHATSAPP_NUMBER as DEFAULT_WHATSAPP_NUMBER } from "@/lib/products"
import { WhatsAppIcon } from "@/components/site-header"

type Errors = {
  prenom?: string
  lieu?: string
  telephone?: string
}

export function CartPageClient({
  whatsappNumber = DEFAULT_WHATSAPP_NUMBER,
  freeDeliveryThreshold,
}: {
  whatsappNumber?: string
  freeDeliveryThreshold: number
}) {
  const { items, updateQuantity, removeItem, clear, totalPrice } = useCart()
  const [prenom, setPrenom] = useState("")
  const [lieu, setLieu] = useState("")
  const [telephone, setTelephone] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const remainingForFreeDelivery = freeDeliveryThreshold - totalPrice

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors: Errors = {}
    if (!prenom.trim()) nextErrors.prenom = "Le prénom est obligatoire."
    if (!lieu.trim()) nextErrors.lieu = "Le lieu de livraison est obligatoire."
    if (!telephone.trim()) nextErrors.telephone = "Le numéro de téléphone est obligatoire."

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    if (items.length === 0) return

    const lines = items.map(
      (item) =>
        `• ${item.name} (${item.brand ?? "Fleur de peau"}) x${item.quantity} — ${formatPrice(item.price * item.quantity)}`
    )

    const message =
      `Bonjour Fleur de peau Cosmétique ! Je souhaite commander :\n\n` +
      `${lines.join("\n")}\n\n` +
      `💰 Total : ${formatPrice(totalPrice)}\n\n` +
      `👤 Prénom : ${prenom}\n` +
      `📍 Lieu de livraison : ${lieu}\n` +
      `📞 Téléphone : ${telephone}`

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank", "noopener,noreferrer")
    setSent(true)
    clear()
  }

  if (sent) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <WhatsAppIcon className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Commande envoyée !</h1>
        <p className="text-pretty text-muted-foreground">
          Votre commande a été préparée sur WhatsApp. Confirmez son envoi dans l&apos;application pour que nous
          puissions la traiter.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Continuer mes achats
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Votre panier est vide</h1>
        <p className="text-pretty text-muted-foreground">
          Parcourez notre boutique et ajoutez vos soins préférés à votre panier.
        </p>
        <Link
          href="/#boutique"
          className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Découvrir la boutique
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3 sm:p-4"
          >
            <Link href={`/produit/${item.slug}`} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-secondary/50 sm:h-24 sm:w-24">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/produit/${item.slug}`}>
                <p className="truncate font-serif text-sm font-semibold text-foreground hover:text-primary sm:text-base">
                  {item.name}
                </p>
              </Link>
              <p className="text-xs text-muted-foreground">{item.brand ?? "Fleur de peau"}</p>
              <p className="mt-1 text-sm font-bold text-primary">{formatPrice(item.price)}</p>

              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="flex items-center rounded-full border border-border">
                  <button
                    type="button"
                    aria-label="Diminuer la quantité"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center text-foreground/70 transition-colors hover:text-primary"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="Augmenter la quantité"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center text-foreground/70 transition-colors hover:text-primary"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  aria-label="Retirer du panier"
                  onClick={() => removeItem(item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="hidden flex-shrink-0 text-sm font-bold text-foreground sm:block">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-serif text-lg font-bold text-foreground">Récapitulatif</h2>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sous-total</span>
            <span className="font-semibold text-foreground">{formatPrice(totalPrice)}</span>
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
            <Truck className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            {remainingForFreeDelivery > 0 ? (
              <span>
                Plus que <strong className="text-foreground">{formatPrice(remainingForFreeDelivery)}</strong> d&apos;achat
                pour profiter de la livraison offerte à Abidjan.
              </span>
            ) : (
              <span className="font-medium text-foreground">Livraison offerte à Abidjan pour cette commande 🎉</span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-serif text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5" noValidate>
          <h2 className="font-serif text-lg font-bold text-foreground">Vos informations</h2>
          <Field id="prenom" label="Prénom" placeholder="Votre prénom" value={prenom} onChange={setPrenom} error={errors.prenom} />
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
            Vous serez redirigé vers WhatsApp avec votre commande complète pré-remplie.
          </p>
        </form>
      </div>
    </div>
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
        className={`rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
          error ? "border-destructive" : "border-border"
        }`}
      />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}
