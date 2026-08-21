import Link from "next/link"
import { Plus } from "lucide-react"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { OrderRow } from "@/components/admin/order-row"

export default async function OrdersPage() {
  await requireRole(["super_admin", "admin_commercial"])
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, order_number, channel, status, payment_status, total, created_at, delivery_address, notes, customers(full_name, phone), order_items(product_name_snapshot, quantity, unit_price, line_total)"
    )
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
              <th className="px-2 py-3" />
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
            {(orders ?? []).map((o) => {
              const customer = o.customers as unknown as { full_name: string; phone: string | null } | null
              return (
                <OrderRow
                  key={o.id}
                  id={o.id}
                  orderNumber={o.order_number}
                  customerName={customer?.full_name ?? "—"}
                  customerPhone={customer?.phone ?? null}
                  channel={o.channel}
                  status={o.status}
                  paymentStatus={o.payment_status}
                  total={o.total}
                  createdAt={o.created_at}
                  deliveryAddress={o.delivery_address}
                  notes={o.notes}
                  items={(o.order_items as unknown as {
                    product_name_snapshot: string
                    quantity: number
                    unit_price: number
                    line_total: number
                  }[]) ?? []}
                />
              )
            })}
            {(orders ?? []).length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
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
