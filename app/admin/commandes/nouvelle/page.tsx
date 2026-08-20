import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { NewOrderForm } from "@/components/admin/new-order-form"

export default async function NewOrderPage() {
  await requireRole(["super_admin", "admin_commercial"])
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, stock_quantity")
    .eq("status", "actif")
    .order("name")

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground">Enregistrer une vente</h1>
      <p className="text-sm text-muted-foreground">
        Site, WhatsApp, TikTok, Facebook, Instagram, téléphone ou boutique — le stock est mis à jour immédiatement.
      </p>
      <div className="mt-6">
        <NewOrderForm products={products ?? []} />
      </div>
    </div>
  )
}
