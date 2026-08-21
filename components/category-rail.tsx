import Link from "next/link"
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

/**
 * Barre d'icônes de catégories, fixée sur le bord gauche de l'écran (visible en permanence,
 * même en défilant), qui se déplie horizontalement au survol pour révéler le nom de la
 * catégorie. Uniquement sur desktop (lg+) — au survol à la souris, pas d'équivalent tactile
 * pertinent sur mobile/tablette, où la grille de catégories classique reste affichée à la place.
 */
export function CategoryRail({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null

  return (
    <div className="fixed left-0 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-1.5 lg:flex">
      {categories.map((cat) => {
        const Icon = iconMap[cat.icon ?? ""] ?? Sparkles
        return (
          <Link
            key={cat.name}
            href="/#boutique"
            className="group flex items-center overflow-hidden rounded-r-full bg-card shadow-md ring-1 ring-border transition-shadow duration-300 hover:shadow-lg"
          >
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-5 w-5" />
            </span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium text-foreground transition-all duration-300 group-hover:max-w-xs group-hover:py-2 group-hover:pl-1 group-hover:pr-4">
              {cat.name}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
