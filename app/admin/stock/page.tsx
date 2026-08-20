import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { StockAdjustmentForm } from "@/components/admin/stock-adjustment-form"
import { PurchaseForm } from "@/components/admin/purchase-form"

const MOVEMENT_LABELS: Record<string, string> = {
  vente: "Vente",
  achat: "Achat",
  ajustement: "Ajustement",
  retour: "Retour",
  inventaire: "Inventaire",
}

const CHANNEL_LABELS: Record<string, string> = {
  site: "Site web",
  whatsapp: "WhatsApp",
  tiktok: "TikTok",
  facebook: "Facebook",
  instagram: "Instagram",
  telephone: "Téléphone",
  boutique: "Boutique",
}

function movementBadgeClass(type: string) {
  switch (type) {
    case "vente":
      return "bg-destructive/10 text-destructive"
    case "achat":
      return "bg-primary/10 text-primary"
    case "retour":
      return "bg-blue-500/10 text-blue-600"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

export default async function StockPage() {
  await requireRole(["super_admin", "admin_commercial"])
  const supabase = await createClient()

  const [{ data: movements }, { data: products }, { data: suppliers }] = await Promise.all([
    supabase
      .from("stock_movements")
      .select(
        "id, quantity, movement_type, channel, reason, created_at, products(name), profiles(full_name)"
      )
      .order("created_at", { ascending: false })
      .limit(150),
    supabase
      .from("products")
      .select("id, name, stock_quantity, cost_price, low_stock_threshold")
      .eq("status", "actif")
      .order("name"),
    supabase.from("suppliers").select("id, name").eq("active", true).order("name"),
  ])

  const lowStockCount = (products ?? []).filter((p) => p.stock_quantity <= p.low_stock_threshold).length

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Gestion du stock</h1>
        <p className="text-sm text-muted-foreground">
          Stock centralisé, jamais négatif — chaque mouvement (vente, achat, ajustement, retour) est historisé
          {lowStockCount > 0 && (
            <span className="ml-2 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
              {lowStockCount} produit{lowStockCount > 1 ? "s" : ""} en stock bas
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StockAdjustmentForm products={(products ?? []).map((p) => ({ id: p.id, name: p.name, stock_quantity: p.stock_quantity }))} />
        <PurchaseForm
          products={(products ?? []).map((p) => ({ id: p.id, name: p.name, cost_price: p.cost_price }))}
          suppliers={suppliers ?? []}
        />
      </div>

      <section>
        <h2 className="font-serif text-lg font-semibold text-foreground">Journal des mouvements</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Heure</th>
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Quantité</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Origine</th>
                <th className="px-4 py-3">Utilisateur</th>
                <th className="px-4 py-3">Motif</th>
              </tr>
            </thead>
            <tbody>
              {(movements ?? []).map((m) => {
                const date = new Date(m.created_at)
                const productName = (m.products as unknown as { name: string } | null)?.name ?? "—"
                const userName = (m.profiles as unknown as { full_name: string } | null)?.full_name ?? "Système"
                return (
                  <tr key={m.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-xs text-muted-foreground">{date.toLocaleDateString("fr-FR")}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 font-medium">{productName}</td>
                    <td className={`px-4 py-3 font-semibold ${m.quantity < 0 ? "text-destructive" : "text-primary"}`}>
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${movementBadgeClass(m.movement_type)}`}>
                        {MOVEMENT_LABELS[m.movement_type] ?? m.movement_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {m.channel ? CHANNEL_LABELS[m.channel] ?? m.channel : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{userName}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{m.reason ?? "—"}</td>
                  </tr>
                )
              })}
              {(movements ?? []).length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun mouvement de stock pour l&apos;instant.
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
