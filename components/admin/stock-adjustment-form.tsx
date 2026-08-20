"use client"

import { useState, useTransition } from "react"
import { adjustStock } from "@/lib/actions/stock"

type Product = { id: string; name: string; stock_quantity: number }

export function StockAdjustmentForm({ products }: { products: Product[] }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [productId, setProductId] = useState("")
  const [quantity, setQuantity] = useState(0)
  const [reason, setReason] = useState("")

  const product = products.find((p) => p.id === productId)

  function handleSubmit() {
    setError(null)
    setSuccess(null)
    if (!productId) {
      setError("Sélectionne un produit.")
      return
    }
    if (!quantity) {
      setError("La quantité ne peut pas être 0.")
      return
    }
    if (!reason.trim()) {
      setError("Indique un motif (ex : inventaire, casse, correction...).")
      return
    }

    startTransition(async () => {
      try {
        await adjustStock({ product_id: productId, quantity, reason })
        setSuccess("Ajustement enregistré.")
        setProductId("")
        setQuantity(0)
        setReason("")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <h2 className="font-serif text-lg font-semibold">Ajustement manuel</h2>
      <p className="text-xs text-muted-foreground">
        Pour corriger le stock suite à un inventaire, une casse, une erreur de saisie, etc. Utilise une quantité
        négative pour retirer du stock, positive pour en ajouter.
      </p>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Produit</label>
        <select value={productId} onChange={(e) => setProductId(e.target.value)} className="input">
          <option value="">Sélectionner...</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (stock actuel : {p.stock_quantity})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Quantité (+ pour ajouter, − pour retirer)
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="input"
        />
        {product && quantity !== 0 && (
          <p className="text-xs text-muted-foreground">
            Nouveau stock estimé : {Math.max(0, product.stock_quantity + quantity)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Motif</label>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ex : inventaire physique, produit endommagé..."
          className="input"
        />
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      {success && <p className="text-sm font-medium text-primary">{success}</p>}

      <button
        type="button"
        disabled={isPending}
        onClick={handleSubmit}
        className="self-start rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground disabled:opacity-60"
      >
        {isPending ? "Enregistrement..." : "Enregistrer l'ajustement"}
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
