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
 * même en défilant, sur toutes les tailles d'écran), qui se déplie horizontalement au
 * survol/appui pour révéler le nom de la catégorie. Défile verticalement si la liste est trop
 * longue pour la hauteur de l'écran (utile sur mobile avec beaucoup de catégories).
 */
export function CategoryRail({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null

  return (
    <div className="fixed left-0 top-1/2 z-30 flex max-h-[80vh] -translate-y-1/2 flex-col gap-1 overflow-y-auto py-1 sm:gap-1.5">
      {categories.map((cat) => {
        const Icon = iconMap[cat.icon ?? ""] ?? Sparkles
        return (
          <Link
            key={cat.name}
            href="/#boutique"
            className="group flex items-center overflow-hidden rounded-r-full bg-card shadow-md ring-1 ring-border transition-shadow duration-300 hover:shadow-lg active:shadow-lg"
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-active:bg-primary group-active:text-primary-foreground sm:h-11 sm:w-11">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium text-foreground transition-all duration-300 group-hover:max-w-xs group-hover:py-2 group-hover:pl-1 group-hover:pr-4 group-active:max-w-xs group-active:py-2 group-active:pl-1 group-active:pr-4">
              {cat.name}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
