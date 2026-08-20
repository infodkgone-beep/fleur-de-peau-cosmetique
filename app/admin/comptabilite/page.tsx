import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/products"
import { AccountingChart } from "@/components/admin/accounting-chart"
import { ExpenseForm, RevenueForm } from "@/components/admin/expense-revenue-forms"
import { DeleteRecordButton } from "@/components/admin/delete-record-button"
import { ExportCsvButton } from "@/components/admin/export-csv-button"
import { deleteExpense, deleteRevenue } from "@/lib/actions/accounting"
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ShoppingBag, Percent } from "lucide-react"

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
function monthKey(d: Date) {
  return d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
}

export default async function AccountingPage() {
  await requireRole(["super_admin"])
  const supabase = await createClient()
  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  const [ordersRes, itemsRes, expensesRes, revenuesRes, purchasesRes, marginsRes] = await Promise.all([
    supabase.from("orders").select("id, total, created_at, status").neq("status", "annulee"),
    supabase
      .from("order_items")
      .select("quantity, unit_cost, unit_price, orders!inner(created_at, status)")
      .neq("orders.status", "annulee"),
    supabase.from("expenses").select("*").order("expense_date", { ascending: false }).limit(200),
    supabase.from("revenues").select("*").order("revenue_date", { ascending: false }).limit(200),
    supabase.from("purchases").select("id, total_cost, created_at"),
    supabase.from("product_margins").select("*").order("margin_percent", { ascending: true }).limit(10),
  ])

  const orders = ordersRes.data ?? []
  const items = itemsRes.data ?? []
  const expenses = expensesRes.data ?? []
  const revenues = revenuesRes.data ?? []
  const purchases = purchasesRes.data ?? []

  const caJour = orders.filter((o) => new Date(o.created_at) >= startOfDay(now)).reduce((s, o) => s + o.total, 0)
  const caMois = orders.filter((o) => new Date(o.created_at) >= startOfMonth(now)).reduce((s, o) => s + o.total, 0)
  const caAnnee = orders.filter((o) => new Date(o.created_at) >= startOfYear(now)).reduce((s, o) => s + o.total, 0)

  function cogsSince(since: Date) {
    return items
      .filter((i) => new Date((i.orders as unknown as { created_at: string }).created_at) >= since)
      .reduce((s, i) => s + i.quantity * i.unit_cost, 0)
  }
  const cogsMois = cogsSince(startOfMonth(now))
  const cogsAnnee = cogsSince(startOfYear(now))

  const depensesMois = expenses.filter((e) => new Date(e.expense_date) >= startOfMonth(now)).reduce((s, e) => s + e.amount, 0)
  const revenusDiversMois = revenues.filter((r) => new Date(r.revenue_date) >= startOfMonth(now)).reduce((s, r) => s + r.amount, 0)
  const achatsMois = purchases.filter((p) => new Date(p.created_at) >= startOfMonth(now)).reduce((s, p) => s + p.total_cost, 0)

  const margeBruteMois = caMois - cogsMois
  const margePercentMois = caMois > 0 ? Math.round((margeBruteMois / caMois) * 100) : 0
  const beneficeNetMois = margeBruteMois + revenusDiversMois - depensesMois

  // Graphique 6 derniers mois
  const months: { key: string; date: Date }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ key: monthKey(d), date: d })
  }
  const chartData = months.map(({ key, date }) => {
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    const ca = orders
      .filter((o) => new Date(o.created_at) >= date && new Date(o.created_at) < nextMonth)
      .reduce((s, o) => s + o.total, 0)
    const dep = expenses
      .filter((e) => new Date(e.expense_date) >= date && new Date(e.expense_date) < nextMonth)
      .reduce((s, e) => s + e.amount, 0)
    const ach = purchases
      .filter((p) => new Date(p.created_at) >= date && new Date(p.created_at) < nextMonth)
      .reduce((s, p) => s + p.total_cost, 0)
    return { month: key, ca, depenses: dep, achats: ach }
  })

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Comptabilité</h1>
        <p className="text-sm text-muted-foreground">Chiffre d&apos;affaires, marges, dépenses et achats</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard icon={Wallet} label="CA aujourd'hui" value={formatPrice(caJour)} />
        <KpiCard icon={Wallet} label="CA ce mois" value={formatPrice(caMois)} />
        <KpiCard icon={TrendingUp} label="CA cette année" value={formatPrice(caAnnee)} />
        <KpiCard icon={Percent} label="Marge brute (mois)" value={`${formatPrice(margeBruteMois)} (${margePercentMois}%)`} />
        <KpiCard icon={TrendingDown} label="Dépenses (mois)" value={formatPrice(depensesMois)} />
        <KpiCard icon={ShoppingBag} label="Achats fournisseurs (mois)" value={formatPrice(achatsMois)} />
        <KpiCard icon={TrendingDown} label="Coût des ventes / COGS (année)" value={formatPrice(cogsAnnee)} />
        <KpiCard icon={PiggyBank} label="Bénéfice net (mois)" value={formatPrice(beneficeNetMois)} highlight />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold">CA, dépenses et achats — 6 derniers mois</h2>
          <div className="flex gap-2">
            <ExportCsvButton
              filename="commandes.csv"
              label="Exporter commandes (CSV/Excel)"
              headers={["Numéro", "Date", "Statut", "Total"]}
              rows={orders.map((o) => [o.id, new Date(o.created_at).toLocaleDateString("fr-FR"), o.status, o.total])}
            />
          </div>
        </div>
        <div className="mt-4">
          <AccountingChart data={chartData} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ExpenseForm />
        <RevenueForm />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold">Dépenses récentes</h2>
            <ExportCsvButton
              filename="depenses.csv"
              label="Exporter (CSV)"
              headers={["Date", "Catégorie", "Libellé", "Montant"]}
              rows={expenses.map((e) => [new Date(e.expense_date).toLocaleDateString("fr-FR"), e.category, e.label, e.amount])}
            />
          </div>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3">Libellé</th>
                  <th className="px-4 py-3">Montant</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {expenses.slice(0, 20).map((e) => (
                  <tr key={e.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(e.expense_date).toLocaleDateString("fr-FR")}</td>
                    <td className="px-4 py-3">{e.category}</td>
                    <td className="px-4 py-3">{e.label}</td>
                    <td className="px-4 py-3 font-semibold text-destructive">-{formatPrice(e.amount)}</td>
                    <td className="px-4 py-3">
                      <DeleteRecordButton id={e.id} action={deleteExpense} />
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                      Aucune dépense enregistrée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold">Revenus divers</h2>
            <ExportCsvButton
              filename="revenus.csv"
              label="Exporter (CSV)"
              headers={["Date", "Source", "Libellé", "Montant"]}
              rows={revenues.map((r) => [new Date(r.revenue_date).toLocaleDateString("fr-FR"), r.source, r.label, r.amount])}
            />
          </div>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Libellé</th>
                  <th className="px-4 py-3">Montant</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {revenues.slice(0, 20).map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(r.revenue_date).toLocaleDateString("fr-FR")}</td>
                    <td className="px-4 py-3">{r.source}</td>
                    <td className="px-4 py-3">{r.label}</td>
                    <td className="px-4 py-3 font-semibold text-primary">+{formatPrice(r.amount)}</td>
                    <td className="px-4 py-3">
                      <DeleteRecordButton id={r.id} action={deleteRevenue} />
                    </td>
                  </tr>
                ))}
                {revenues.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                      Aucun revenu divers enregistré.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section>
        <h2 className="font-serif text-lg font-semibold">Produits à marge la plus faible</h2>
        <p className="text-xs text-muted-foreground">À surveiller — marge par rapport au prix de vente</p>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Prix de vente</th>
                <th className="px-4 py-3">Coût</th>
                <th className="px-4 py-3">Marge</th>
                <th className="px-4 py-3">Marge %</th>
              </tr>
            </thead>
            <tbody>
              {(marginsRes.data ?? []).map((m) => (
                <tr key={m.product_id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3">{formatPrice(m.price)}</td>
                  <td className="px-4 py-3">{formatPrice(m.cost_price)}</td>
                  <td className="px-4 py-3">{formatPrice(m.margin_amount)}</td>
                  <td className={`px-4 py-3 font-semibold ${m.margin_percent < 20 ? "text-destructive" : "text-primary"}`}>
                    {m.margin_percent}%
                  </td>
                </tr>
              ))}
              {(marginsRes.data ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                    Aucun produit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function KpiCard({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className={`rounded-2xl border p-4 ${highlight ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className={`mt-2 font-serif text-xl font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  )
}
