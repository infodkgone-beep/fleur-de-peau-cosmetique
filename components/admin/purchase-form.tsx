"use client"

import { useMemo, useState, useTransition } from "react"
import { Plus, Trash2 } from "lucide-react"
import { createPurchase } from "@/lib/actions/stock"
import { formatPrice } from "@/lib/products"

type Product = { id: string; name: string; cost_price: number }
type Supplier = { id: string; name: string }
type Line = { product_id: string; quantity: number; unit_cost: number }

export function PurchaseForm({ products, suppliers }: { products: Product[]; suppliers: Supplier[] }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [supplierId, setSupplierId] = useState("")
  const [reference, setReference] = useState("")
  const [notes, setNotes] = useState("")
  const [lines, setLines] = useState<Line[]>([{ product_id: "", quantity: 1, unit_cost: 0 }])

  const total = useMemo(() => lines.reduce((s, l) => s + l.quantity * l.unit_cost, 0), [lines])

  function updateLine(index: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)))
  }

  function handleProductSelect(index: number, productId: string) {
    const product = products.find((p) => p.id === productId)
    updateLine(index, { product_id: productId, unit_cost: product?.cost_price ?? 0 })
  }

  function handleSubmit() {
    setError(null)
    setSuccess(null)
    const validLines = lines.filter((l) => l.product_id && l.quantity > 0)
    if (validLines.length === 0) {
      setError("Ajoute au moins un produit.")
      return
    }

    startTransition(async () => {
      try {
        await createPurchase({
          supplier_id: supplierId || null,
          reference: reference || null,
          notes: notes || null,
          items: validLines,
        })
        setSuccess("Achat enregistré, le stock a été augmenté.")
        setSupplierId("")
        setReference("")
        setNotes("")
        setLines([{ product_id: "", quantity: 1, unit_cost: 0 }])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <h2 className="font-serif text-lg font-semibold">Achat fournisseur</h2>
      <p className="text-xs text-muted-foreground">
        Enregistre une réception de marchandise : le stock est automatiquement augmenté pour chaque produit.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Fournisseur</label>
          <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="input">
            <option value="">Non renseigné</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Référence (facture, bon...)</label>
          <input value={reference} onChange={(e) => setReference(e.target.value)} className="input" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {lines.map((line, index) => (
          <div key={index} className="flex flex-wrap items-end gap-3">
            <div className="flex min-w-[200px] flex-1 flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Produit</label>
              <select value={line.product_id} onChange={(e) => handleProductSelect(index, e.target.value)} className="input">
                <option value="">Sélectionner...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-24 flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Qté</label>
              <input
                type="number"
                min={1}
                value={line.quantity}
                onChange={(e) => updateLine(index, { quantity: Number(e.target.value) })}
                className="input"
              />
            </div>
            <div className="flex w-32 flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Coût unitaire</label>
              <input
                type="number"
                min={0}
                value={line.unit_cost}
                onChange={(e) => updateLine(index, { unit_cost: Number(e.target.value) })}
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
        ))}
        <button
          type="button"
          onClick={() => setLines((prev) => [...prev, { product_id: "", quantity: 1, unit_cost: 0 }])}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary"
        >
          <Plus className="h-4 w-4" /> Ajouter un produit
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Notes</label>
        <input value={notes} onChange={(e) => setNotes(e.target.value)} className="input" />
      </div>

      <div className="flex items-center justify-between rounded-xl bg-secondary/40 px-4 py-3">
        <span className="text-sm text-muted-foreground">Coût total de l&apos;achat</span>
        <span className="font-serif text-lg font-bold">{formatPrice(total)}</span>
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      {success && <p className="text-sm font-medium text-primary">{success}</p>}

      <button
        type="button"
        disabled={isPending}
        onClick={handleSubmit}
        className="self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {isPending ? "Enregistrement..." : "Enregistrer l'achat"}
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
