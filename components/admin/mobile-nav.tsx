"use client"

import { useEffect, useState, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

/**
 * Barre + menu de navigation admin pour mobile/tablette (en dessous du breakpoint md).
 * `children` reçoit les liens de navigation déjà rendus côté serveur (voir app/admin/layout.tsx) :
 * on ne fait ici que gérer l'ouverture/fermeture, pas le contenu du menu lui-même.
 */
export function MobileNav({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="border-b border-border bg-card md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="font-serif text-base font-bold text-primary">Fleur de peau</p>
          <p className="text-[0.65rem] text-muted-foreground">Administration</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && <div className="border-t border-border">{children}</div>}
    </div>
  )
}
