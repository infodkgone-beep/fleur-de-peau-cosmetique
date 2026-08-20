"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

const productSchema = z.object({
  name: z.string().min(2, "Le nom est obligatoire."),
  slug: z.string().min(2),
  category_id: z.string().uuid().nullable(),
  brand_id: z.string().uuid().nullable(),
  short_description: z.string().nullable(),
  long_description: z.string().nullable(),
  benefits: z.string().nullable(),
  usage_instructions: z.string().nullable(),
  ingredients: z.string().nullable(),
  price: z.coerce.number().min(0, "Le prix doit être positif."),
  compare_at_price: z.coerce.number().min(0).nullable(),
  cost_price: z.coerce.number().min(0),
  sku: z.string().nullable(),
  barcode: z.string().nullable(),
  stock_quantity: z.coerce.number().int().min(0),
  low_stock_threshold: z.coerce.number().int().min(0),
  status: z.enum(["actif", "brouillon", "archive"]),
  imported: z.boolean(),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
})

export type ProductInput = z.infer<typeof productSchema>

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function createProduct(input: Omit<ProductInput, "slug"> & { images: { url: string; publicId: string }[] }) {
  const profile = await requireRole(["super_admin"])
  const supabase = await createClient()

  const parsed = productSchema.parse({ ...input, slug: slugify(input.name) })

  const { data: product, error } = await supabase
    .from("products")
    .insert({ ...parsed, created_by: profile.id })
    .select("id")
    .single()

  if (error) throw new Error(error.message)

  if (input.images.length > 0) {
    await supabase.from("product_images").insert(
      input.images.map((img, index) => ({
        product_id: product!.id,
        url: img.url,
        cloudinary_public_id: img.publicId,
        sort_order: index,
      }))
    )
  }

  await supabase.from("activity_log").insert({
    user_id: profile.id,
    action: "create",
    entity_type: "product",
    entity_id: product!.id,
    details: { name: parsed.name },
  })

  revalidatePath("/admin/produits")
  revalidatePath("/boutique")
  return product!.id
}

export async function updateProduct(
  id: string,
  input: Omit<ProductInput, "slug"> & { images: { url: string; publicId: string }[] }
) {
  const profile = await requireRole(["super_admin", "admin_commercial"])
  const supabase = await createClient()

  // Admin Commercial ne peut modifier que prix/stock/promo — pas les autres champs produit.
  const parsed = productSchema.parse({ ...input, slug: slugify(input.name) })
  const payload =
    profile.role === "admin_commercial"
      ? {
          price: parsed.price,
          compare_at_price: parsed.compare_at_price,
          stock_quantity: parsed.stock_quantity,
          low_stock_threshold: parsed.low_stock_threshold,
        }
      : parsed

  const { error } = await supabase.from("products").update(payload).eq("id", id)
  if (error) throw new Error(error.message)

  if (profile.role === "super_admin") {
    await supabase.from("product_images").delete().eq("product_id", id)
    if (input.images.length > 0) {
      await supabase.from("product_images").insert(
        input.images.map((img, index) => ({
          product_id: id,
          url: img.url,
          cloudinary_public_id: img.publicId,
          sort_order: index,
        }))
      )
    }
  }

  await supabase.from("activity_log").insert({
    user_id: profile.id,
    action: "update",
    entity_type: "product",
    entity_id: id,
    details: { fields: Object.keys(payload) },
  })

  revalidatePath("/admin/produits")
  revalidatePath("/boutique")
}

export async function deleteProduct(id: string) {
  const profile = await requireRole(["super_admin"])
  const supabase = await createClient()

  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw new Error(error.message)

  await supabase.from("activity_log").insert({
    user_id: profile.id,
    action: "delete",
    entity_type: "product",
    entity_id: id,
  })

  revalidatePath("/admin/produits")
  revalidatePath("/boutique")
}
