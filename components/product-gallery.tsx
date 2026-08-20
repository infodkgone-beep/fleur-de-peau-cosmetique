"use client"

import { useState } from "react"

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState("50% 50%")

  const src = images[active] ?? "/placeholder.svg"

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-3xl border border-border bg-secondary/40"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = ((e.clientX - rect.left) / rect.width) * 100
          const y = ((e.clientY - rect.top) / rect.height) * 100
          setOrigin(`${x}% ${y}%`)
        }}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
      >
        <img
          src={src || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300"
          style={{ transform: zoom ? "scale(1.6)" : "scale(1)", transformOrigin: origin }}
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Voir l'image ${i + 1}`}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                i === active ? "border-primary" : "border-border hover:border-primary/50"
              }`}
            >
              <img src={img || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
