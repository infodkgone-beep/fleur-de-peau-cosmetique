import { notFound } from "next/navigation"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/product-form"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await requireRole(["super_admin", "admin_commercial"])
  const supabase = await createClient()

  const [{ data: product }, { data: images }, { data: categories }, { data: brands }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("product_images").select("*").eq("product_id", id).order("sort_order"),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("brands").select("*").order("name"),
  ])

  if (!product) notFound()

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-foreground">Modifier : {product.name}</h1>
      <div className="mt-6">
        <ProductForm
          product={product}
          productImages={images ?? []}
          categories={categories ?? []}
          brands={brands ?? []}
          canEditAllFields={profile.role === "super_admin"}
        />
      </div>
    </div>
  )
}
