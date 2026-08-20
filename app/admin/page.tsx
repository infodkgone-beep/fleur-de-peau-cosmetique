import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/products"
import { SalesChart } from "@/components/admin/sales-chart"
import { VisitorsChart } from "@/components/admin/visitors-chart"
import { getVisitorStats, getDailyVisitorCounts } from "@/lib/actions/analytics"
import { TrendingUp, ShoppingCart, Package, AlertTriangle, Users, Wallet, Eye } from "lucide-react"

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function startOfYear(d: Date) {
  return new Date(d.getFullYear(), 0, 1)
}

export default async function AdminDashboardPage() {
  const profile = await requireRole()
  const supabase = await createClient()
  const now = new Date()
  const canSeeFinancials = profile.role === "super_admin" || profile.role === "admin_commercial"

  if (!canSeeFinancials) {
    // Gestionnaire Contenu : pas d'accès aux données financières.
    return (
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Bienvenue, {profile.full_name.split(" ")[0]}</h1>
        <p className="mt-2 text-muted-foreground">
          Utilise le menu pour gérer le contenu du site : slider, bannières, images et textes.
        </p>
      </div>
    )
  }

  const [ordersRes, productsRes, customersThisMonthRes, last30DaysRes, topProductsRes, visitorStats, dailyVisitors] =
    await Promise.all([
      supabase.from("orders").select("id, total, created_at, status").neq("status", "annulee"),
      supabase.from("products").select("id, name, stock_quantity, low_stock_threshold"),
      supabase.from("customers").select("id", { count: "exact", head: true }).gte("created_at", startOfMonth(now).toISOString()),
      supabase
        .from("orders")
        .select("total, created_at")
        .neq("status", "annulee")
        .gte("created_at", new Date(now.getTime() - 29 * 86400000).toISOString()),
      supabase.from("order_items").select("product_name_snapshot, quantity"),
      // La migration 0002 (site_visits) doit être appliquée pour que ces deux appels fonctionnent —
      // on dégrade en douceur vers des zéros tant que ce n'est pas fait, plutôt que de casser le tableau de bord.
      getVisitorStats().catch(() => ({
        todayVisitors: 0,
        todayViews: 0,
        weekVisitors: 0,
        weekViews: 0,
        monthVisitors: 0,
        monthViews: 0,
        yearVisitors: 0,
        yearViews: 0,
      })),
      getDailyVisitorCounts(30).catch(() => [] as { day: string; uniqueVisitors: number }[]),
    ])

  const orders = ordersRes.data ?? []
  const products = productsRes.data ?? []

  const caJour = orders.filter((o) => new Date(o.created_at) >= startOfDay(now)).reduce((s, o) => s + o.total, 0)
  const caMois = orders.filter((o) => new Date(o.created_at) >= startOfMonth(now)).reduce((s, o) => s + o.total, 0)
  const caAnnee = orders.filter((o) => new Date(o.created_at) >= startOfYear(now)).reduce((s, o) => s + o.total, 0)
  const commandesMois = orders.filter((o) => new Date(o.created_at) >= startOfMonth(now)).length
  const panierMoyen = commandesMois > 0 ? caMois / commandesMois : 0

  const ruptureStock = products.filter((p) => p.stock_quantity === 0).length
  const presqueRupture = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold).length

  const salesByDay = new Map<string, number>()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000)
    salesByDay.set(d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }), 0)
  }
  for (const o of last30DaysRes.data ?? []) {
    const key = new Date(o.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
    salesByDay.set(key, (salesByDay.get(key) ?? 0) + o.total)
  }
  const chartData = Array.from(salesByDay.entries()).map(([date, total]) => ({ date, total }))

  const productSales = new Map<string, number>()
  for (const item of topProductsRes.data ?? []) {
    productSales.set(item.product_name_snapshot, (productSales.get(item.product_name_snapshot) ?? 0) + item.quantity)
  }
  const topProducts = Array.from(productSales.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const produitsVendus = (topProductsRes.data ?? []).reduce((s, i) => s + i.quantity, 0)

  const visitorsChartData = dailyVisitors.map((row) => ({
    date: new Date(row.day).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
    visitors: row.uniqueVisitors,
  }))

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground">Tableau de bord</h1>
      <p className="text-sm text-muted-foreground">Vue d&apos;ensemble de l&apos;activité</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard icon={Wallet} label="CA aujourd'hui" value={formatPrice(caJour)} />
        <KpiCard icon={Wallet} label="CA ce mois" value={formatPrice(caMois)} />
        <KpiCard icon={TrendingUp} label="CA cette année" value={formatPrice(caAnnee)} />
        <KpiCard icon={ShoppingCart} label="Commandes (mois)" value={String(commandesMois)} />
        <KpiCard icon={Package} label="Produits vendus" value={String(produitsVendus)} />
        <KpiCard icon={Wallet} label="Panier moyen" value={formatPrice(Math.round(panierMoyen))} />
        <KpiCard icon={AlertTriangle} label="Ruptures de stock" value={String(ruptureStock)} alert={ruptureStock > 0} />
        <KpiCard icon={AlertTriangle} label="Stock bas" value={String(presqueRupture)} alert={presqueRupture > 0} />
        <KpiCard icon={Users} label="Nouveaux clients (mois)" value={String(customersThisMonthRes.count ?? 0)} />
      </div>

      <h2 className="mt-8 font-serif text-lg font-semibold text-foreground">Fréquentation du site</h2>
      <p className="text-sm text-muted-foreground">Visiteurs uniques (basé sur un cookie anonyme, sans donnée personnelle)</p>
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard icon={Eye} label="Aujourd'hui" value={String(visitorStats.todayVisitors)} />
        <KpiCard icon={Eye} label="Cette semaine" value={String(visitorStats.weekVisitors)} />
        <KpiCard icon={Eye} label="Ce mois" value={String(visitorStats.monthVisitors)} />
        <KpiCard icon={Eye} label="Cette année" value={String(visitorStats.yearVisitors)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="font-serif text-lg font-semibold">Évolution des ventes (30 jours)</h2>
          <div className="mt-4">
            <SalesChart data={chartData} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-serif text-lg font-semibold">Top 5 produits</h2>
          <ol className="mt-4 flex flex-col gap-3">
            {topProducts.map(([name, qty], i) => (
              <li key={name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  {name}
                </span>
                <span className="font-semibold">{qty}</span>
              </li>
            ))}
            {topProducts.length === 0 && <p className="text-sm text-muted-foreground">Aucune vente enregistrée.</p>}
          </ol>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-serif text-lg font-semibold">Visiteurs uniques (30 jours)</h2>
        <div className="mt-4">
          <VisitorsChart data={visitorsChartData} />
        </div>
      </div>
    </div>
  )
}

function KpiCard({
  icon: Icon,
  label,
  value,
  alert,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  alert?: boolean
}) {
  return (
    <div className={`rounded-2xl border p-4 ${alert ? "border-destructive/40 bg-destructive/5" : "border-border bg-card"}`}>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className={`mt-2 font-serif text-xl font-bold ${alert ? "text-destructive" : "text-foreground"}`}>{value}</p>
    </div>
  )
}
