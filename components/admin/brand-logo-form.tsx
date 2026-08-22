"use client"

import { useState, useTransition } from "react"
import { ImageUploader, type UploadedImage } from "@/components/admin/image-uploader"
import { saveBrandLogo } from "@/lib/actions/content"

type Brand = { id: string; name: string; logo_url: string | null }

export function BrandLogoForm({ brands }: { brands: Brand[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {brands.map((brand) => (
        <BrandLogoRow key={brand.id} brand={brand} />
      ))}
    </div>
  )
}

function BrandLogoRow({ brand }: { brand: Brand }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>([])

  function handleSave() {
    setError(null)
    setSaved(false)
    if (images.length === 0) return
    startTransition(async () => {
      try {
        await saveBrandLogo({ brandId: brand.id, url: images[0].url, publicId: images[0].publicId })
        setImages([])
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
          {brand.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logo_url} alt="" className="h-full w-full object-contain p-1" />
          ) : (
            <span className="text-[0.6rem] text-muted-foreground">Aucun logo</span>
          )}
        </div>
        <p className="font-semibold text-foreground">{brand.name}</p>
      </div>
      <ImageUploader images={images} onChange={setImages} minImages={1} />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      {images.length > 0 && (
        <button
          type="button"
          disabled={isPending}
          onClick={handleSave}
          className="self-start rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60"
        >
          {isPending ? "Enregistrement..." : saved ? "Enregistré ✓" : "Enregistrer ce logo"}
        </button>
      )}
    </div>
  )
}
