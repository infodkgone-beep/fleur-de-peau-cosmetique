import type { ReactNode } from "react"
import Link from "next/link"
import { requireRole, ROLE_LABELS } from "@/lib/auth"
import { AdminSignOutButton } from "@/components/admin/sign-out-button"
import { MobileNav } from "@/components/admin/mobile-nav"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  Wallet,
  Megaphone,
  Image as ImageIcon,
  Users,
  Tag,
} from "lucide-react"

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, roles: ["super_admin", "admin_commercial", "content_manager"] },
  { href: "/admin/produits", label: "Produits", icon: Package, roles: ["super_admin", "admin_commercial", "content_manager"] },
  { href: "/admin/commandes", label: "Commandes / Ventes", icon: ShoppingCart, roles: ["super_admin", "admin_commercial"] },
  { href: "/admin/stock", label: "Stock & Achats", icon: Boxes, roles: ["super_admin", "admin_commercial"] },
  { href: "/admin/comptabilite", label: "Comptabilité", icon: Wallet, roles: ["super_admin"] },
  { href: "/admin/promotions", label: "Codes promo", icon: Tag, roles: ["super_admin", "admin_commercial"] },
  { href: "/admin/contenu", label: "Contenu du site", icon: ImageIcon, roles: ["super_admin", "content_manager"] },
  { href: "/admin/marketing", label: "Pixels marketing", icon: Megaphone, roles: ["super_admin"] },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users, roles: ["super_admin"] },
] as const

type NavItem = (typeof NAV)[number]

function NavLinks({ items }: { items: NavItem[] }) {
  return (
    <nav className="flex-1 space-y-1 p-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

function AccountBlock({ fullName, roleLabel }: { fullName: string; roleLabel: string }) {
  return (
    <div className="border-t border-border p-4">
      <p className="truncate text-sm font-medium text-foreground">{fullName}</p>
      <p className="text-xs text-muted-foreground">{roleLabel}</p>
      <AdminSignOutButton />
    </div>
  )
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const profile = await requireRole()
  const visibleNav = NAV.filter((item) => (item.roles as readonly string[]).includes(profile.role!))

  return (
    <div className="flex min-h-screen flex-col bg-secondary/30 md:flex-row">
      <MobileNav>
        <NavLinks items={visibleNav} />
        <AccountBlock fullName={profile.full_name} roleLabel={ROLE_LABELS[profile.role!]} />
      </MobileNav>

      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="border-b border-border p-5">
          <p className="font-serif text-lg font-bold text-primary">Fleur de peau</p>
          <p className="text-xs text-muted-foreground">Administration</p>
        </div>
        <NavLinks items={visibleNav} />
        <AccountBlock fullName={profile.full_name} roleLabel={ROLE_LABELS[profile.role!]} />
      </aside>

      <main className="flex-1 overflow-x-hidden p-4 md:p-8">{children}</main>
    </div>
  )
}
