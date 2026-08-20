"use client"

import { useState, useTransition } from "react"
import { updateMarketingPixel } from "@/lib/actions/marketing"

export function PixelToggle({
  platform,
  label,
  initialPixelId,
  initialEnabled,
}: {
  platform: string
  label: string
  initialPixelId: string | null
  initialEnabled: boolean
}) {
  const [pixelId, setPixelId] = useState(initialPixelId ?? "")
  const [enabled, setEnabled] = useState(initialEnabled)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function save(nextEnabled: boolean, nextPixelId: string) {
    setSaved(false)
    startTransition(async () => {
      try {
        await updateMarketingPixel({ platform, pixelId: nextPixelId || null, enabled: nextEnabled })
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } catch {
        // erreur silencieuse — le champ reste modifiable, l'utilisateur peut réessayer
      }
    })
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => {
            const next = !enabled
            setEnabled(next)
            save(next, pixelId)
          }}
          className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-secondary"}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              enabled ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
        <span className="font-medium text-foreground">{label}</span>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={pixelId}
          onChange={(e) => setPixelId(e.target.value)}
          onBlur={() => save(enabled, pixelId)}
          placeholder="ID du pixel / de la balise"
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm sm:w-64"
        />
        {isPending && <span className="text-xs text-muted-foreground">...</span>}
        {saved && !isPending && <span className="text-xs font-medium text-primary">Enregistré</span>}
      </div>
    </div>
  )
}
