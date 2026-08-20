"use client"

import { useState, useTransition } from "react"
import { updateSiteSetting } from "@/lib/actions/marketing"

export function SiteSettingsForm({
  whatsappNumber,
  freeDeliveryThreshold,
  announcements,
}: {
  whatsappNumber: string
  freeDeliveryThreshold: number
  announcements: string[]
}) {
  const [phone, setPhone] = useState(whatsappNumber)
  const [threshold, setThreshold] = useState(freeDeliveryThreshold)
  const [ann, setAnn] = useState(announcements.join("\n"))
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit() {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      try {
        await Promise.all([
          updateSiteSetting({ key: "whatsapp_number", value: phone }),
          updateSiteSetting({ key: "free_delivery_threshold", value: threshold }),
          updateSiteSetting({
            key: "announcements",
            value: ann
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean),
          }),
        ])
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <h2 className="font-serif text-lg font-semibold">Paramètres généraux du site</h2>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Numéro WhatsApp (format international, sans +)</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="settings-input" placeholder="2250700000000" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Seuil de livraison offerte (FCFA)</label>
        <input
          type="number"
          min={0}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="settings-input"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Bannières d&apos;annonce défilantes (une par ligne)</label>
        <textarea value={ann} onChange={(e) => setAnn(e.target.value)} rows={4} className="settings-input" />
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <button
        type="button"
        disabled={isPending}
        onClick={handleSubmit}
        className="self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {isPending ? "Enregistrement..." : saved ? "Enregistré ✓" : "Enregistrer les paramètres"}
      </button>

      <style jsx global>{`
        .settings-input {
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
