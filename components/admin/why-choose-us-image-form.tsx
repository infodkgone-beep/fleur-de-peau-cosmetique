"use client"

import { useState, useTransition } from "react"
import { ImageUploader, type UploadedImage } from "@/components/admin/image-uploader"
import { saveWhyChooseUsImage } from "@/lib/actions/content"

export function WhyChooseUsImageForm({ currentImageUrl }: { currentImageUrl: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>([])

  function handleSubmit() {
    setError(null)
    setSaved(false)
    if (images.length === 0) {
      setError("Ajoute une nouvelle image pour la remplacer.")
      return
    }
    startTransition(async () => {
      try {
        await saveWhyChooseUsImage({ url: images[0].url, publicId: images[0].publicId })
        setImages([])
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <h3 className="font-serif text-base font-semibold">Image de la section &quot;Pourquoi nous choisir&quot;</h3>
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={currentImageUrl} alt="" className="h-24 w-24 flex-shrink-0 rounded-xl object-cover" />
        <p className="text-xs text-muted-foreground">Image actuellement affichée sur le site. Ajoute une nouvelle image ci-dessous pour la remplacer.</p>
      </div>
      <ImageUploader images={images} onChange={setImages} minImages={1} />
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      <button
        type="button"
        disabled={isPending}
        onClick={handleSubmit}
        className="self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {isPending ? "Enregistrement..." : saved ? "Enregistré ✓" : "Remplacer l'image"}
      </button>
    </div>
  )
}
