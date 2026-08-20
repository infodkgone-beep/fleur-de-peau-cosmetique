"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { announcements as defaultAnnouncements } from "@/lib/products"

export function AnnouncementBar({ announcements = defaultAnnouncements }: { announcements?: string[] }) {
  const [visible, setVisible] = useState(true)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!visible || announcements.length <= 1) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % announcements.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [visible])

  if (!visible || announcements.length === 0) return null

  return (
    <div className="relative bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-10 py-2.5">
        <div className="relative h-5 flex-1 overflow-hidden text-center">
          {announcements.map((text, i) => (
            <p
              key={text}
              aria-hidden={i !== index}
              className={`absolute inset-0 flex items-center justify-center text-xs font-medium tracking-wide transition-all duration-500 sm:text-sm ${
                i === index ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
              }`}
            >
              <span className="truncate">{text}</span>
            </p>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Fermer la bannière"
          className="absolute right-3 flex h-6 w-6 items-center justify-center rounded-full text-primary-foreground/80 transition-colors hover:bg-primary-foreground/15 hover:text-primary-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
