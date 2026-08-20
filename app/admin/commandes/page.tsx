import Link from "next/link"
import { Plus } from "lucide-react"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/products"
import { OrderStatusSelect } from "@/components/admin/order-status-select"

const CHANNEL_LABELS: Record<string, string> = {
  site: "Site web",
  whatsapp: "WhatsApp",
  tiktok: "TikTok",
  facebook: "Facebook",
  instagram: "Instagram",
  telephone: "Téléphone",
  boutique: "Boutique",
}

export default async function OrdersPage() {
  await requireRole(["super_admin", "admin_commercial"])
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, channel, status, payment_status, total, created_at, customers(full_name, phone)")
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Commandes / Ventes</h1>
          <p className="text-sm text-muted-foreground">Toutes les ventes, tous canaux confondus</p>
        </div>
        <Link
          href="/admin/commandes/nouvelle"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Enregistrer une vente
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">N°</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Canal</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Paiement</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{o.order_number}</td>
                <td className="px-4 py-3">
                  {(o.customers as unknown as { full_name: string; phone: string } | null)?.full_name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                    {CHANNEL_LABELS[o.channel] ?? o.channel}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold">{formatPrice(o.total)}</td>
                <td className="px-4 py-3 capitalize">{o.payment_status.replace("_", " ")}</td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={o.id} status={o.status} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
            {(orders ?? []).length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Aucune commande enregistrée pour l&apos;instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
