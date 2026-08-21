"use server"

import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Recherche publique de produits par nom (boîte de recherche du header). Utilise le client
 * admin comme le reste de lib/storefront.ts (aucune session client sur la boutique publique) —
 * même liste de colonnes restreinte, jamais de données internes (cost_price, sku...).
 */

export type ProductSearchResult = {
  id: string
  slug: string
  name: string
  brand: string | null
  price: number
  image: string
}

const PLACEHOLDER = "/placeholder.svg"

export async function searchProducts(query: string): Promise<ProductSearchResult[]> {
  const q = query.trim()
  if (q.length < 2) return []

  const supabase = createAdminClient()
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, price, brands(name), product_images(url, sort_order)")
    .eq("status", "actif")
    .ilike("name", `%${q}%`)
    .order("sort_order", { ascending: true })
    .limit(8)

  return (data ?? []).map((p) => {
    const images = ((p.product_images as unknown as { url: string; sort_order: number }[]) ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => img.url)
    const brand = p.brands as unknown as { name: string } | null
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: brand?.name ?? null,
      price: p.price,
      image: images[0] ?? PLACEHOLDER,
    }
  })
}
