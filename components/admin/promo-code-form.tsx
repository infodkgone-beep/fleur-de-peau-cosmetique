"use client"

import { useState, useTransition } from "react"
import { createPromoCode } from "@/lib/actions/promotions"

export function PromoCodeForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [discountType, setDiscountType] = useState<"pourcentage" | "montant_fixe">("pourcentage")
  const [discountValue, setDiscountValue] = useState(0)
  const [usageLimit, setUsageLimit] = useState<number | "">("")

  function handleSubmit() {
    setError(null)
    if (!code.trim() || discountValue <= 0) {
      setError("Renseigne un code et une valeur de réduction valide.")
      return
    }
    startTransition(async () => {
      try {
        await createPromoCode({
          code,
          description: description || null,
          discount_type: discountType,
          discount_value: discountValue,
          usage_limit: usageLimit === "" ? null : Number(usageLimit),
        })
        setCode("")
        setDescription("")
        setDiscountValue(0)
        setUsageLimit("")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <h2 className="font-serif text-lg font-semibold">Créer un code promo</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Code (ex: PEAU25)"
          className="promo-input font-mono uppercase"
        />
        <select value={discountType} onChange={(e) => setDiscountType(e.target.value as typeof discountType)} className="promo-input">
          <option value="pourcentage">Pourcentage (%)</option>
          <option value="montant_fixe">Montant fixe (FCFA)</option>
        </select>
        <input
          type="number"
          min={0}
          value={discountValue || ""}
          onChange={(e) => setDiscountValue(Number(e.target.value))}
          placeholder={discountType === "pourcentage" ? "Ex: 25" : "Ex: 2000"}
          className="promo-input"
        />
        <input
          type="number"
          min={1}
          value={usageLimit}
          onChange={(e) => setUsageLimit(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="Limite d'utilisation (optionnel)"
          className="promo-input"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optionnel)"
          className="promo-input sm:col-span-2"
        />
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      <button
        type="button"
        disabled={isPending}
        onClick={handleSubmit}
        className="self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {isPending ? "Création..." : "Créer le code"}
      </button>

      <style jsx global>{`
        .promo-input {
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
