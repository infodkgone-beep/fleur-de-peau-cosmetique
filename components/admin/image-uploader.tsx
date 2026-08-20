"use client"

import { useRef, useState } from "react"
import { ImagePlus, Loader2, X } from "lucide-react"
import { getUploadSignature, removeCloudinaryImage } from "@/lib/actions/cloudinary"

export type UploadedImage = { url: string; publicId: string }

export function ImageUploader({
  images,
  onChange,
  minImages = 2,
}: {
  images: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  minImages?: number
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setError(null)

    try {
      const { timestamp, signature, apiKey, cloudName, folder } = await getUploadSignature()

      const uploaded: UploadedImage[] = []
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)
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
        uploaded.push({ url: data.secure_url, publicId: data.public_id })
      }

      onChange([...images, ...uploaded])
    } catch {
      setError("L'upload a échoué. Vérifie ta connexion et réessaie.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  async function handleRemove(index: number) {
    const image = images[index]
    onChange(images.filter((_, i) => i !== index))
    try {
      await removeCloudinaryImage(image.publicId)
    } catch {
      // La suppression Cloudinary a échoué mais l'image est retirée du produit — pas bloquant.
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <div key={image.publicId} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/70 text-background opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
          <span className="text-[0.65rem] font-medium">{uploading ? "Envoi..." : "Ajouter"}</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-2 text-xs font-medium text-destructive">{error}</p>}
      {images.length < minImages && (
        <p className="mt-2 text-xs text-muted-foreground">
          Minimum {minImages} images requises ({images.length}/{minImages}).
        </p>
      )}
    </div>
  )
}
