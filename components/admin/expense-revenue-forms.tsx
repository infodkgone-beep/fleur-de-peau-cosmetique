"use client"

import { useState, useTransition } from "react"
import { addExpense, addRevenue } from "@/lib/actions/accounting"

const EXPENSE_CATEGORIES = ["Loyer", "Salaires", "Publicité", "Transport / Livraison", "Emballage", "Électricité", "Internet", "Fournitures", "Autre"]
const REVENUE_SOURCES = ["Prestation", "Vente exceptionnelle", "Remboursement", "Autre"]

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function ExpenseForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0])
  const [label, setLabel] = useState("")
  const [amount, setAmount] = useState(0)
  const [date, setDate] = useState(todayISO())

  function handleSubmit() {
    setError(null)
    if (!label.trim() || amount <= 0) {
      setError("Renseigne un libellé et un montant valide.")
      return
    }
    startTransition(async () => {
      try {
        await addExpense({ category, label, amount, expense_date: date, notes: null })
        setLabel("")
        setAmount(0)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <h2 className="font-serif text-lg font-semibold">Ajouter une dépense</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
        <input placeholder="Libellé" value={label} onChange={(e) => setLabel(e.target.value)} className="input sm:col-span-2" />
        <input
          type="number"
          min={0}
          placeholder="Montant (FCFA)"
          value={amount || ""}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="input sm:col-span-2"
        />
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      <button
        type="button"
        disabled={isPending}
        onClick={handleSubmit}
        className="self-start rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground disabled:opacity-60"
      >
        {isPending ? "Enregistrement..." : "Ajouter la dépense"}
      </button>
    </div>
  )
}

export function RevenueForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState(REVENUE_SOURCES[0])
  const [label, setLabel] = useState("")
  const [amount, setAmount] = useState(0)
  const [date, setDate] = useState(todayISO())

  function handleSubmit() {
    setError(null)
    if (!label.trim() || amount <= 0) {
      setError("Renseigne un libellé et un montant valide.")
      return
    }
    startTransition(async () => {
      try {
        await addRevenue({ source, label, amount, revenue_date: date, notes: null })
        setLabel("")
        setAmount(0)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <h2 className="font-serif text-lg font-semibold">Ajouter un revenu hors catalogue</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <select value={source} onChange={(e) => setSource(e.target.value)} className="input">
          {REVENUE_SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
        <input placeholder="Libellé" value={label} onChange={(e) => setLabel(e.target.value)} className="input sm:col-span-2" />
        <input
          type="number"
          min={0}
          placeholder="Montant (FCFA)"
          value={amount || ""}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="input sm:col-span-2"
        />
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      <button
        type="button"
        disabled={isPending}
        onClick={handleSubmit}
        className="self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {isPending ? "Enregistrement..." : "Ajouter le revenu"}
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
