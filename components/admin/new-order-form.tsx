"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Plus } from "lucide-react"
import { createOrder } from "@/lib/actions/orders"
import { formatPrice } from "@/lib/products"
import type { SaleChannel, PaymentMethod } from "@/lib/types/database"

type Product = { id: string; name: string; price: number; stock_quantity: number }
type Line = { product_id: string; quantity: number; unit_price: number }

const CHANNELS: { value: SaleChannel; label: string }[] = [
  { value: "site", label: "Site web" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "telephone", label: "Téléphone" },
  { value: "boutique", label: "Boutique (vente physique)" },
]

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "especes", label: "Espèces" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "virement", label: "Virement" },
  { value: "carte", label: "Carte" },
  { value: "autre", label: "Autre" },
]

export function NewOrderForm({ products }: { products: Product[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [channel, setChannel] = useState<SaleChannel>("whatsapp")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [address, setAddress] = useState("")
  const [lines, setLines] = useState<Line[]>([{ product_id: "", quantity: 1, unit_price: 0 }])
  const [discount, setDiscount] = useState(0)
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("especes")

  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.quantity * l.unit_price, 0), [lines])
  const total = Math.max(0, subtotal - discount + deliveryFee)

  function updateLine(index: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)))
  }

  function handleProductSelect(index: number, productId: string) {
    const product = products.find((p) => p.id === productId)
    updateLine(index, { product_id: productId, unit_price: product?.price ?? 0 })
  }

  function handleSubmit() {
    setError(null)
    const validLines = lines.filter((l) => l.product_id && l.quantity > 0)
    if (validLines.length === 0) {
      setError("Ajoute au moins un produit.")
      return
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setError("Le nom et le téléphone du client sont obligatoires.")
      return
    }

    startTransition(async () => {
      try {
        await createOrder({
          channel,
          customer_name: customerName,
          customer_phone: customerPhone,
          delivery_address: address || null,
          items: validLines.map((l) => ({ product_id: l.product_id, variant_id: null, quantity: l.quantity, unit_price: l.unit_price })),
          discount_amount: discount,
          delivery_fee: deliveryFee,
          notes: null,
          payment_amount: paymentAmount,
          payment_method: paymentMethod,
        })
        router.push("/admin/commandes")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Canal de vente</label>
          <select value={channel} onChange={(e) => setChannel(e.target.value as SaleChannel)} className="input">
            {CHANNELS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Nom du client *</label>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="input" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Téléphone *</label>
          <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="input" />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Adresse de livraison</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="input" />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-serif text-lg font-semibold">Produits</h2>
        <div className="mt-3 flex flex-col gap-3">
          {lines.map((line, index) => {
            const product = products.find((p) => p.id === line.product_id)
            return (
              <div key={index} className="flex flex-wrap items-end gap-3">
                <div className="flex min-w-[200px] flex-1 flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Produit</label>
                  <select value={line.product_id} onChange={(e) => handleProductSelect(index, e.target.value)} className="input">
                    <option value="">Sélectionner...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (stock: {p.stock_quantity})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex w-24 flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Qté</label>
                  <input
                    type="number"
                    min={1}
                    max={product?.stock_quantity}
                    value={line.quantity}
                    onChange={(e) => updateLine(index, { quantity: Number(e.target.value) })}
                    className="input"
                  />
                </div>
                <div className="flex w-32 flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Prix unitaire</label>
                  <input
                    type="number"
                    min={0}
                    value={line.unit_price}
                    onChange={(e) => updateLine(index, { unit_price: Number(e.target.value) })}
                    className="input"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setLines((prev) => prev.filter((_, i) => i !== index))}
                  className="mb-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() => setLines((prev) => [...prev, { product_id: "", quantity: 1, unit_price: 0 }])}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          <Plus className="h-4 w-4" /> Ajouter un produit
        </button>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <h2 className="col-span-full font-serif text-lg font-semibold">Paiement</h2>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Remise (FCFA)</label>
          <input type="number" min={0} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="input" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Frais de livraison (FCFA)</label>
          <input type="number" min={0} value={deliveryFee} onChange={(e) => setDeliveryFee(Number(e.target.value))} className="input" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Montant payé (FCFA)</label>
          <input type="number" min={0} value={paymentAmount} onChange={(e) => setPaymentAmount(Number(e.target.value))} className="input" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Méthode de paiement</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="input">
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <div className="text-sm text-muted-foreground">
          Sous-total : {formatPrice(subtotal)} · Remise : -{formatPrice(discount)} · Livraison : +{formatPrice(deliveryFee)}
        </div>
        <p className="font-serif text-2xl font-bold text-primary">{formatPrice(total)}</p>
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <button
        type="button"
        disabled={isPending}
        onClick={handleSubmit}
        className="self-start rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {isPending ? "Enregistrement..." : "Enregistrer la vente"}
      </button>

      <style jsx global>{`
        .input {
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: var(--background);
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          width: 100%;
        }
      `}</style>
    </div>
  )
}
