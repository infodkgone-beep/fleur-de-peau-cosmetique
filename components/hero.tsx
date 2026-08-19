import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section id="accueil" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20 lg:py-24">
        <div className="relative z-10 text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-card px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-gold-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Cosmétiques importés
          </span>

          <h1 className="mt-5 text-balance font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            La beauté qui commence par la <span className="text-primary">peau</span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-pretty leading-relaxed text-muted-foreground md:mx-0">
            Produits importés, une peau saine, une beauté qui se voit. Découvrez notre sélection de soins premium pour
            sublimer votre peau au quotidien.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
            <a
              href="#boutique"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.03]"
            >
              Découvrir la boutique
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#categories"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Nos catégories
            </a>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-md">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-gold/30 bg-card shadow-2xl shadow-primary/10">
            <Image
              src="/images/hero-composition.webp"
              alt="Composition de produits cosmétiques Fleur de peau"
              fill
              priority
              className="object-cover"
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
