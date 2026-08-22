"use client"

import { useState, useTransition } from "react"
import { ImageUploader, type UploadedImage } from "@/components/admin/image-uploader"
import { saveBanner } from "@/lib/actions/content"

export function BannerForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [badge, setBadge] = useState("")
  const [code, setCode] = useState("")
  const [link, setLink] = useState("")
  const [images, setImages] = useState<UploadedImage[]>([])

  function handleSubmit() {
    setError(null)
    if (!title.trim()) {
      setError("Le titre est obligatoire.")
      return
    }
    if (images.length === 0) {
      setError("Ajoute une image pour cette bannière.")
      return
    }
    startTransition(async () => {
      try {
        await saveBanner({
          id: null,
          title,
          description: description || null,
          badge: badge || null,
          code: code || null,
          link: link || null,
          image_url: images[0].url,
          cloudinary_public_id: images[0].publicId,
          active: true,
        })
        setTitle("")
        setDescription("")
        setBadge("")
        setCode("")
        setLink("")
        setImages([])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <h3 className="font-serif text-base font-semibold">Ajouter une promotion / bannière</h3>
      <ImageUploader images={images} onChange={setImages} minImages={1} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre (ex: Offre de la semaine)" className="content-input" />
        <input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Badge (ex: -25%)" className="content-input" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="content-input sm:col-span-2" />
        <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Code promo (optionnel)" className="content-input font-mono" />
        <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Lien (optionnel)" className="content-input" />
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      <button
        type="button"
        disabled={isPending}
        onClick={handleSubmit}
        className="self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {isPending ? "Enregistrement..." : "Ajouter la promotion"}
      </button>
    </div>
  )
}
