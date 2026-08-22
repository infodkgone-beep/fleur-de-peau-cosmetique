"use client"

// Mêmes seuils que le traitement utilisé pour le logo et le favicon du site : plus l'écart entre
// le pixel et le blanc pur est faible, plus il devient transparent, avec une transition en douceur
// (pas de bordure nette) entre LOW (totalement transparent) et HIGH (totalement opaque).
const LOW = 8
const HIGH = 55

/**
 * Rend transparent l'arrière-plan blanc/clair d'une image (logo, capture d'écran...), directement
 * dans le navigateur avant l'envoi vers Cloudinary — pour que chaque logo de marque uploadé se
 * fonde dans le site, sans bordure ni carré blanc autour, comme le logo et le favicon du site.
 */
export function removeLightBackground(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Traitement d'image non supporté par ce navigateur."))
        return
      }
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const originalAlpha = data[i + 3]
        const deviationFromWhite = 255 - Math.min(r, g, b)
        const ratio = Math.min(1, Math.max(0, (deviationFromWhite - LOW) / (HIGH - LOW)))
        data[i + 3] = Math.round(originalAlpha * ratio)
      }
      ctx.putImageData(imageData, 0, 0)

      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Échec de la conversion de l'image."))
      }, "image/png")
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Impossible de lire l'image sélectionnée."))
    }

    img.src = url
  })
}
