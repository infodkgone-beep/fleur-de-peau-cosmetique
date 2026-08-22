"use client"

import { useEffect, useRef, useState } from "react"
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
 * même en défilant, sur toutes les tailles d'écran), qui se déplie horizontalement pour révéler
 * le nom de la catégorie. Défile verticalement si la liste est trop longue pour la hauteur de
 * l'écran (utile sur mobile avec beaucoup de catégories).
 *
 * Comportement tactile (mobile/tablette, pas de souris) : un premier appui déplie l'icône et
 * affiche le nom SANS naviguer ; il faut appuyer une seconde fois (sur l'icône maintenant
 * dépliée) pour ouvrir la catégorie. Sur souris (desktop), le survol suffit à révéler le nom et
 * un simple clic ouvre directement la catégorie, comme avant. Un appui n'importe où ailleurs sur
 * la page referme la catégorie dépliée et revient à l'état initial (rien d'ouvert).
 */
export function CategoryRail({ categories }: { categories: Category[] }) {
  const [isTouch, setIsTouch] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches)
  }, [])

  useEffect(() => {
    if (expandedIndex === null) return
    function handleOutsidePointer(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpandedIndex(null)
      }
    }
    document.addEventListener("pointerdown", handleOutsidePointer)
    return () => document.removeEventListener("pointerdown", handleOutsidePointer)
  }, [expandedIndex])

  if (categories.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="fixed left-0 top-20 z-30 flex max-h-[calc(100vh-6rem)] flex-col gap-1 overflow-y-auto py-1 sm:top-24 sm:gap-1.5"
    >
      {categories.map((cat, i) => {
        const Icon = iconMap[cat.icon ?? ""] ?? Sparkles
        const isExpanded = isTouch && expandedIndex === i

        return (
          <Link
            key={cat.name}
            href="/#boutique"
            onClick={(e) => {
              if (!isTouch) return
              if (expandedIndex !== i) {
                e.preventDefault()
                setExpandedIndex(i)
              }
            }}
            className={`group flex items-center overflow-hidden rounded-r-full bg-card shadow-md ring-1 ring-border transition-shadow duration-300 hover:shadow-lg ${
              isExpanded ? "shadow-lg" : ""
            }`}
          >
            <span
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground sm:h-11 sm:w-11 ${
                isExpanded ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span
              className={`max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium text-foreground transition-all duration-300 group-hover:max-w-xs group-hover:py-2 group-hover:pl-1 group-hover:pr-4 ${
                isExpanded ? "max-w-xs py-2 pl-1 pr-4" : ""
              }`}
            >
              {cat.name}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
