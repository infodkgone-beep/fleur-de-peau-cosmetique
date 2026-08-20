import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/product-form"

export default async function NewProductPage() {
  await requireRole(["super_admin"])
  const supabase = await createClient()

  const [{ data: categories }, { data: brands }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("brands").select("*").order("name"),
  ])

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground">Nouveau produit</h1>
      <div className="mt-6">
        <ProductForm categories={categories ?? []} brands={brands ?? []} canEditAllFields />
      </div>
    </div>
  )
}
