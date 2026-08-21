import {
  Sparkles,
  Flower2,
  Sun,
  Droplets,
  ShieldCheck,
  Leaf,
  ShowerHead,
  SprayCan,
  Smile,
  Palette,
  Scissors,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Flower2,
  Sun,
  Droplets,
  ShieldCheck,
  Leaf,
  ShowerHead,
  SprayCan,
  Smile,
  Palette,
  Scissors,
}

type Category = { name: string; description: string | null; icon: string | null }

export function Categories({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null

  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-foreground">Nos univers</p>
        <h2 className="mt-3 text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Explorez nos catégories
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon ?? ""] ?? Sparkles
          return (
            <a
              key={cat.name}
              href="#boutique"
              className="group flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-gold/60 hover:shadow-lg sm:p-6"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-serif text-base font-semibold text-foreground sm:text-lg">{cat.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{cat.description}</p>
            </a>
          )
        })}
      </div>
    </section>
  )
}
