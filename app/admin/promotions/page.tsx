import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/products"
import { PromoCodeForm } from "@/components/admin/promo-code-form"
import { PromoCodeRowActions } from "@/components/admin/promo-code-row-actions"

export default async function PromotionsPage() {
  await requireRole(["super_admin", "admin_commercial"])
  const supabase = await createClient()

  const { data: codes } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Codes promo</h1>
        <p className="text-sm text-muted-foreground">Crée et gère les codes de réduction utilisés sur le site et en vente directe</p>
      </div>

      <PromoCodeForm />

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Réduction</th>
              <th className="px-4 py-3">Utilisations</th>
              <th className="px-4 py-3 text-right">Statut</th>
            </tr>
          </thead>
          <tbody>
            {(codes ?? []).map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-mono font-semibold text-foreground">{c.code}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.description ?? "—"}</td>
                <td className="px-4 py-3 font-medium">
                  {c.discount_type === "pourcentage" ? `${c.discount_value}%` : formatPrice(c.discount_value)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c.used_count}
                  {c.usage_limit ? ` / ${c.usage_limit}` : ""}
                </td>
                <td className="px-4 py-3">
                  <PromoCodeRowActions id={c.id} active={c.active} />
                </td>
              </tr>
            ))}
            {(codes ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  Aucun code promo pour l&apos;instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
