"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { toggleHeroSlideActive, deleteHeroSlide, toggleBannerActive, deleteBanner } from "@/lib/actions/content"

export function HeroSlideRowActions({
  id,
  active,
  cloudinaryPublicId,
}: {
  id: string
  active: boolean
  cloudinaryPublicId: string | null
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => toggleHeroSlideActive(id, !active))}
        className={`rounded-full px-2.5 py-1 text-xs font-semibold disabled:opacity-50 ${
          active ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
        }`}
      >
        {active ? "Actif" : "Inactif"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm("Supprimer ce slide ?")) startTransition(() => deleteHeroSlide(id, cloudinaryPublicId))
        }}
        className="text-muted-foreground hover:text-destructive disabled:opacity-50"
        aria-label="Supprimer"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

export function BannerRowActions({
  id,
  active,
  cloudinaryPublicId,
}: {
  id: string
  active: boolean
  cloudinaryPublicId: string | null
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => toggleBannerActive(id, !active))}
        className={`rounded-full px-2.5 py-1 text-xs font-semibold disabled:opacity-50 ${
          active ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
        }`}
      >
        {active ? "Actif" : "Inactif"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm("Supprimer cette bannière ?")) startTransition(() => deleteBanner(id, cloudinaryPublicId))
        }}
        className="text-muted-foreground hover:text-destructive disabled:opacity-50"
        aria-label="Supprimer"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
