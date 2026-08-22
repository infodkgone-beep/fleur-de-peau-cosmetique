"use client"

import { useRef, useState, useTransition } from "react"
import { ImagePlus, Loader2 } from "lucide-react"
import { getUploadSignature } from "@/lib/actions/cloudinary"
import { saveBrandLogo } from "@/lib/actions/content"
import { removeLightBackground } from "@/lib/image-processing"

type Brand = { id: string; name: string; logo_url: string | null }
type PendingLogo = { url: string; publicId: string }

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
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [pending, setPending] = useState<PendingLogo | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      // Fond blanc/clair rendu transparent directement dans le navigateur, avant l'envoi —
      // pour que le logo se fonde dans le site, sans bordure ni carré blanc autour.
      const cleanedBlob = await removeLightBackground(file)
      const { timestamp, signature, apiKey, cloudName, folder } = await getUploadSignature()

      const formData = new FormData()
      formData.append("file", cleanedBlob, "logo.png")
      formData.append("api_key", apiKey!)
      formData.append("timestamp", String(timestamp))
      formData.append("signature", signature)
      formData.append("folder", folder)

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      })
      if (!res.ok) throw new Error("Échec de l'upload")
      const data = await res.json()
      setPending({ url: data.secure_url, publicId: data.public_id })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec du traitement de l'image.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function handleSave() {
    setError(null)
    setSaved(false)
    if (!pending) return
    startTransition(async () => {
      try {
        await saveBrandLogo({ brandId: brand.id, url: pending.url, publicId: pending.publicId })
        setPending(null)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur.")
      }
    })
  }

  const previewUrl = pending?.url ?? brand.logo_url

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-border p-1"
          style={{
            backgroundImage:
              "linear-gradient(45deg, var(--secondary) 25%, transparent 25%), linear-gradient(-45deg, var(--secondary) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--secondary) 75%), linear-gradient(-45deg, transparent 75%, var(--secondary) 75%)",
            backgroundSize: "10px 10px",
            backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
          }}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className="h-full w-full object-contain" />
          ) : (
            <span className="text-[0.6rem] text-muted-foreground">Aucun logo</span>
          )}
        </div>
        <p className="font-semibold text-foreground">{brand.name}</p>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        {uploading ? "Traitement du fond transparent..." : "Choisir une image de logo"}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      <p className="text-[0.65rem] text-muted-foreground">Le fond blanc/clair est automatiquement rendu transparent.</p>

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      {pending && (
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
