"use client"

import { useEffect, useState, type FormEvent } from "react"
import { CheckCircle2 } from "lucide-react"
import { WhatsAppIcon } from "@/components/site-header"
import { WHATSAPP_NUMBER as DEFAULT_WHATSAPP_NUMBER, formatPrice, type Product } from "@/lib/products"
import { isMobileOrTabletDevice } from "@/lib/device"
import { createPublicOrder } from "@/lib/actions/public-orders"

type Errors = {
  prenom?: string
  lieu?: string
  telephone?: string
}

export function OrderForm({
  product,
  onSubmitted,
  whatsappNumber = DEFAULT_WHATSAPP_NUMBER,
}: {
  product: Product
  onSubmitted?: () => void
  whatsappNumber?: string
}) {
  const [prenom, setPrenom] = useState("")
  const [lieu, setLieu] = useState("")
  const [telephone, setTelephone] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [sentDirectly, setSentDirectly] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    setIsMobile(isMobileOrTabletDevice())
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors: Errors = {}
    if (!prenom.trim()) nextErrors.prenom = "Le prénom est obligatoire."
    if (!lieu.trim()) nextErrors.lieu = "Le lieu de livraison est obligatoire."
    if (!telephone.trim()) nextErrors.telephone = "Le numéro de téléphone est obligatoire."

    setErrors(nextErrors)
    setSubmitError(null)
    if (Object.keys(nextErrors).length > 0) return

    // Mobile / tablette : WhatsApp est installé, on garde le parcours WhatsApp habituel.
    if (isMobileOrTabletDevice()) {
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

      // On ouvre WhatsApp tout de suite (de façon synchrone, dans la foulée du clic) pour que
      // le navigateur mobile n'assimile pas ça à une pop-up bloquée.
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
      window.open(url, "_blank", "noopener,noreferrer")

      // On enregistre aussi la commande dans l'admin (en plus du message WhatsApp), pour que
      // le staff retrouve toutes les commandes au même endroit, PC comme mobile. Ceci se fait en
      // arrière-plan et n'empêche jamais l'envoi du message WhatsApp au client.
      createPublicOrder({
        customer_name: prenom,
        customer_phone: telephone,
        delivery_address: lieu,
        items: [{ product_id: product.id, quantity: 1, unit_price: product.price }],
      }).catch(() => {})

      onSubmitted?.()
      return
    }

    // PC / TV : on enregistre directement la commande dans le système (visible dans l'admin).
    setSubmitting(true)
    const result = await createPublicOrder({
      customer_name: prenom,
      customer_phone: telephone,
      delivery_address: lieu,
      items: [{ product_id: product.id, quantity: 1, unit_price: product.price }],
    })
    setSubmitting(false)

    if (!result.ok) {
      setSubmitError(result.error)
      return
    }
    setSentDirectly(true)
  }

  if (sentDirectly) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h4 className="font-serif text-lg font-bold text-foreground">Commande envoyée !</h4>
        <p className="text-pretty text-sm text-muted-foreground">
          Votre commande a bien été transmise à notre équipe. Nous vous contacterons très vite au numéro indiqué
          pour la confirmer.
        </p>
        <button
          type="button"
          onClick={() => onSubmitted?.()}
          className="mt-1 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          Fermer
        </button>
      </div>
    )
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

      {submitError && (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-center text-xs font-medium text-destructive">
          {submitError}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {isMobile && <WhatsAppIcon className="h-4 w-4" />}
        {submitting ? "Envoi en cours..." : isMobile ? "Envoyer la commande sur WhatsApp" : "Envoyer la commande"}
      </button>
      <p className="text-center text-xs text-muted-foreground">
        {isMobile
          ? "Vous serez redirigé vers WhatsApp avec votre commande pré-remplie."
          : "Votre commande sera transmise directement à notre équipe, qui vous contactera pour la confirmer."}
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
