"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import type { StorefrontHeroSlide } from "@/lib/storefront"

const AUTOPLAY_MS = 6000

/**
 * Contenu de secours si aucun slide actif n'existe dans la table hero_slides (gérée depuis
 * l'admin > Contenu du site) — pour ne jamais laisser la page d'accueil vide.
 */
const FALLBACK_SLIDES: StorefrontHeroSlide[] = [
  {
    id: "fallback-hero",
    eyebrow: "Cosmétiques importés",
    title: "La beauté qui commence par la peau",
    subtitle:
      "Produits importés, une peau saine, une beauté qui se voit. Découvrez notre sélection de soins premium pour sublimer votre peau au quotidien.",
    ctaLabel: "Découvrir la boutique",
    ctaHref: "#boutique",
    imageUrl: "/images/hero-composition.webp",
  },
]

export function Hero({ slides: activeSlides }: { slides: StorefrontHeroSlide[] }) {
  const slides = activeSlides.length > 0 ? activeSlides : FALLBACK_SLIDES
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length

  const goTo = useCallback((index: number) => {
    setCurrent((index + count) % count)
  }, [count])

  useEffect(() => {
    if (paused || count <= 1) return
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % count)
    }, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [paused, count])

  // Si le nombre de slides actifs change (admin), on évite de rester bloqué sur un index hors limites.
  useEffect(() => {
    if (current >= count) setCurrent(0)
  }, [count, current])

  const slide = slides[Math.min(current, count - 1)]

  // Le dernier mot du titre est mis en avant en couleur primaire (comme le titre d'origine,
  // "La beauté qui commence par la <peau>"), quel que soit le titre choisi dans l'admin.
  const titleWords = slide.title.trim().split(/\s+/)
  const titleLead = titleWords.slice(0, -1).join(" ")
  const titleLast = titleWords[titleWords.length - 1] ?? ""

  return (
    <section
      id="accueil"
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20 lg:py-24">
        <div className="relative z-10 text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-card px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-gold-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            {slide.eyebrow ?? "Cosmétiques importés"}
          </span>

          <h1 className="mt-5 text-balance font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            {titleLead ? `${titleLead} ` : ""}
            <span className="text-primary">{titleLast}</span>
          </h1>

          {slide.subtitle && (
            <p className="mx-auto mt-5 max-w-md text-pretty leading-relaxed text-muted-foreground md:mx-0">
              {slide.subtitle}
            </p>
          )}

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
            <a
              href={slide.ctaHref ?? "#boutique"}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.03]"
            >
              {slide.ctaLabel ?? "Découvrir la boutique"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#categories"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Nos catégories
            </a>
          </div>

          {count > 1 && (
            <div className="mt-6 flex justify-center gap-2 md:justify-start">
              {slides.map((s, index) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Aller au slide ${index + 1}`}
                  aria-current={index === current}
                  className={`h-2 rounded-full transition-all ${
                    index === current ? "w-6 bg-primary" : "w-2 bg-border hover:bg-gold/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative z-10 mx-auto w-full max-w-md">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-gold/30 bg-card shadow-2xl shadow-primary/10">
            {/* eslint-disable-next-line @next/next/no-img-element -- image dynamique (locale ou Cloudinary), non listée dans next.config */}
            <img
              src={slide.imageUrl}
              alt="Composition de produits cosmétiques Fleur de peau"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="absolute -bottom-6 -left-4 flex h-28 w-28 rotate-[-8deg] items-center justify-center rounded-full border-2 border-gold bg-background p-2 text-center shadow-xl sm:-left-8 sm:h-32 sm:w-32">
            <span className="font-serif text-[0.65rem] font-semibold uppercase leading-tight tracking-wide text-primary sm:text-xs">
              Une peau saine, une beauté qui se voit
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
