import Link from "next/link"
import { Plus, AlertTriangle } from "lucide-react"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/products"
import { DeleteProductButton } from "@/components/admin/delete-product-button"

export default async function AdminProductsPage() {
  const profile = await requireRole(["super_admin", "admin_commercial", "content_manager"])
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, cost_price, stock_quantity, low_stock_threshold, status, sku")
    .order("created_at", { ascending: false })

  const canEdit = profile.role !== "content_manager"
  const canDelete = profile.role === "super_admin"

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Produits</h1>
          <p className="text-sm text-muted-foreground">{products?.length ?? 0} produits au catalogue</p>
        </div>
        {profile.role === "super_admin" && (
          <Link
            href="/admin/produits/nouveau"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Nouveau produit
          </Link>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Marge</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((p) => {
              const margin = p.price > 0 ? Math.round(((p.price - p.cost_price) / p.price) * 100) : 0
              const lowStock = p.stock_quantity <= p.low_stock_threshold
              return (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.sku ?? "—"}</td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">{margin}%</td>
                  <td className="px-4 py-3">
                    <span className={lowStock ? "flex items-center gap-1 font-semibold text-destructive" : ""}>
                      {lowStock && <AlertTriangle className="h-3.5 w-3.5" />}
                      {p.stock_quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium capitalize">{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {canEdit && (
                      <Link href={`/admin/produits/${p.id}`} className="font-medium text-primary hover:underline">
                        Modifier
                      </Link>
                    )}
                    {canDelete && <DeleteProductButton id={p.id} />}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
