import { Check } from "lucide-react"

const points = [
  "Des marques importées et authentiques",
  "Des soins adaptés à toutes les carnations",
  "Un accompagnement beauté personnalisé",
  "Des prix justes pour une qualité premium",
]

export function WhyChooseUs({ imageUrl }: { imageUrl: string }) {
  return (
    <section id="a-propos" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="relative order-last md:order-first">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-gold/30 shadow-2xl shadow-primary/10">
            {/* eslint-disable-next-line @next/next/no-img-element -- image dynamique (locale ou Cloudinary), non listée dans next.config */}
            <img
              src={imageUrl}
              alt="Femme à la peau éclatante utilisant les soins Fleur de peau"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="absolute -right-3 bottom-8 rounded-2xl border border-gold/40 bg-background px-5 py-3 text-center shadow-xl sm:-right-6">
            <p className="font-serif text-2xl font-bold text-primary">+500</p>
            <p className="text-xs text-muted-foreground">clientes satisfaites</p>
          </div>
        </div>

        <div className="rounded-3xl bg-background/90 p-6 backdrop-blur-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-foreground">Pourquoi nous choisir</p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Prends soin de ta peau, elle te le rendra
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Chez Fleur de peau Cosmétique, nous croyons qu&apos;une belle peau est le reflet d&apos;un soin quotidien.
            Nous sélectionnons pour vous des produits importés de qualité, efficaces et sûrs, pour révéler votre beauté
            naturelle.
          </p>

          <ul className="mt-6 flex flex-col gap-3">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm text-foreground">{point}</span>
              </li>
            ))}
          </ul>

          <a
            href="#boutique"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-[1.03]"
          >
            Découvrir nos soins
          </a>
        </div>
      </div>
    </section>
  )
}
