"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { banners } from "@/lib/products"

const AUTOPLAY_MS = 5000

export function BannerCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = banners.length

  const goTo = useCallback((index: number) => {
    setCurrent((index + count) % count)
  }, [count])

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % count)
    }, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [paused, count])

  return (
    <section
      aria-label="Affiches promotionnelles"
      aria-roledescription="carrousel"
      className="mx-auto w-full max-w-6xl px-4 pt-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-3xl border border-border shadow-sm">
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="relative min-w-full"
              role="group"
              aria-roledescription="diapositive"
              aria-label={`${index + 1} sur ${count}`}
              aria-hidden={index !== current}
            >
              <div className="relative aspect-[16/10] w-full sm:aspect-[16/7] lg:aspect-[16/5]">
                <Image
                  src={banner.image || "/placeholder.svg"}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1152px) 100vw, 1152px"
                  className="object-cover"
                />
                {/* Overlay dégradé pour la lisibilité du texte */}
                <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/45 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center gap-2 p-6 sm:gap-3 sm:p-10 lg:p-14">
                  <span className="w-fit rounded-full bg-gold px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-gold-foreground shadow">
                    {banner.eyebrow}
                  </span>
                  <h2 className="max-w-md font-serif text-2xl font-bold leading-tight text-foreground text-balance sm:text-3xl lg:text-4xl">
                    {banner.title}
                  </h2>
                  <p className="max-w-sm text-sm text-muted-foreground text-pretty sm:text-base">
                    {banner.subtitle}
                  </p>
                  <a
                    href={banner.href}
                    className="mt-2 w-fit rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
                  >
                    {banner.cta}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Flèches */}
        <button
          type="button"
          onClick={prev}
          aria-label="Affiche précédente"
          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-foreground shadow backdrop-blur transition-colors hover:bg-card"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Affiche suivante"
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-foreground shadow backdrop-blur transition-colors hover:bg-card"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Points de navigation */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Aller à l'affiche ${index + 1}`}
              aria-current={index === current}
              className={`h-2 rounded-full transition-all ${
                index === current ? "w-6 bg-primary" : "w-2 bg-card/80 hover:bg-card"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
