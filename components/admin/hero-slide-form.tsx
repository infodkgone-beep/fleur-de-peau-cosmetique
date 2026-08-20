"use client"

import { useState, useTransition } from "react"
import { ImageUploader, type UploadedImage } from "@/components/admin/image-uploader"
import { saveHeroSlide } from "@/lib/actions/content"

export function HeroSlideForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [eyebrow, setEyebrow] = useState("")
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [ctaLabel, setCtaLabel] = useState("")
  const [ctaHref, setCtaHref] = useState("#boutique")
  const [images, setImages] = useState<UploadedImage[]>([])

  function handleSubmit() {
    setError(null)
    if (!title.trim()) {
      setError("Le titre est obligatoire.")
      return
    }
    if (images.length === 0) {
      setError("Ajoute une image pour ce slide.")
      return
    }
    startTransition(async () => {
      try {
        await saveHeroSlide({
          id: null,
          eyebrow: eyebrow || null,
          title,
          subtitle: subtitle || null,
          cta_label: ctaLabel || null,
          cta_href: ctaHref || null,
          image_url: images[0].url,
          cloudinary_public_id: images[0].publicId,
          active: true,
        })
        setEyebrow("")
        setTitle("")
        setSubtitle("")
        setCtaLabel("")
        setCtaHref("#boutique")
        setImages([])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <h3 className="font-serif text-base font-semibold">Ajouter un slide</h3>
      <ImageUploader images={images} onChange={setImages} minImages={1} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} placeholder="Sur-titre (ex: Offre de la semaine)" className="content-input" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre principal" className="content-input" />
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Sous-titre" className="content-input sm:col-span-2" />
        <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Texte du bouton" className="content-input" />
        <input value={ctaHref} onChange={(e) => setCtaHref(e.target.value)} placeholder="Lien du bouton (ex: #boutique)" className="content-input" />
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      <button
        type="button"
        disabled={isPending}
        onClick={handleSubmit}
        className="self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {isPending ? "Enregistrement..." : "Ajouter le slide"}
      </button>

      <style jsx global>{`
        .content-input {
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
