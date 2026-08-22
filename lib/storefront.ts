import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Lecture publique du catalogue (page d'accueil, fiches produit, catégories).
 *
 * Utilise le client "admin" (service_role) UNIQUEMENT pour contourner la latence RLS côté lecture
 * publique — mais ne sélectionne JAMAIS de colonnes sensibles (cost_price, sku, barcode,
 * low_stock_threshold, created_by...). C'est cette liste de colonnes, pas RLS, qui protège les
 * données commerciales internes ici : ne jamais élargir un `select()` de ce fichier sans vérifier
 * qu'aucune colonne interne n'y entre.
 */

export type StorefrontProduct = {
  id: string
  slug: string
  name: string
  brand: string | null
  price: number
  oldPrice: number | null
  image: string
  images: string[]
  imported: boolean
  category: string | null
  categoryId: string | null
  categorySlug: string | null
  inStock: boolean
  stockQuantity: number
}

export type StorefrontProductDetail = StorefrontProduct & {
  shortDescription: string | null
  longDescription: string | null
  benefits: string | null
  usageInstructions: string | null
  ingredients: string | null
  metaTitle: string | null
  metaDescription: string | null
  avgRating: number | null
  reviewCount: number
  reviews: { id: string; customerName: string; rating: number; comment: string | null; createdAt: string }[]
}

const PLACEHOLDER = "/placeholder.svg"

/** Liste des produits actifs pour la page d'accueil / grille boutique. */
export async function getActiveProducts(): Promise<StorefrontProduct[]> {
  const supabase = createAdminClient()

  const { data: products } = await supabase
    .from("products")
    .select(
      "id, name, slug, price, compare_at_price, stock_quantity, imported, category_id, brand_id, categories(name, slug), brands(name), product_images(url, sort_order)"
    )
    .eq("status", "actif")
    .order("sort_order", { ascending: true })

  return (products ?? []).map((p) => {
    const images = ((p.product_images as unknown as { url: string; sort_order: number }[]) ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => img.url)
    const category = p.categories as unknown as { name: string; slug: string } | null
    const brand = p.brands as unknown as { name: string } | null
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: brand?.name ?? null,
      price: p.price,
      oldPrice: p.compare_at_price,
      image: images[0] ?? PLACEHOLDER,
      images,
      imported: p.imported,
      category: category?.name ?? null,
      categoryId: p.category_id,
      categorySlug: category?.slug ?? null,
      inStock: p.stock_quantity > 0,
      stockQuantity: p.stock_quantity,
    }
  })
}

/** Fiche produit complète pour la page publique + SEO. */
export async function getProductBySlug(slug: string): Promise<StorefrontProductDetail | null> {
  const supabase = createAdminClient()

  const { data: p } = await supabase
    .from("products")
    .select(
      "id, name, slug, price, compare_at_price, stock_quantity, imported, short_description, long_description, benefits, usage_instructions, ingredients, meta_title, meta_description, category_id, brand_id, categories(name, slug), brands(name), product_images(url, sort_order)"
    )
    .eq("status", "actif")
    .eq("slug", slug)
    .maybeSingle()

  if (!p) return null

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, customer_name, rating, comment, created_at")
    .eq("product_id", p.id)
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(30)

  const images = ((p.product_images as unknown as { url: string; sort_order: number }[]) ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => img.url)
  const category = p.categories as unknown as { name: string; slug: string } | null
  const brand = p.brands as unknown as { name: string } | null
  const reviewList = reviews ?? []
  const avgRating = reviewList.length > 0 ? reviewList.reduce((s, r) => s + r.rating, 0) / reviewList.length : null

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: brand?.name ?? null,
    price: p.price,
    oldPrice: p.compare_at_price,
    image: images[0] ?? PLACEHOLDER,
    images: images.length > 0 ? images : [PLACEHOLDER],
    imported: p.imported,
    category: category?.name ?? null,
    categoryId: p.category_id,
    categorySlug: category?.slug ?? null,
    inStock: p.stock_quantity > 0,
    stockQuantity: p.stock_quantity,
    shortDescription: p.short_description,
    longDescription: p.long_description,
    benefits: p.benefits,
    usageInstructions: p.usage_instructions,
    ingredients: p.ingredients,
    metaTitle: p.meta_title,
    metaDescription: p.meta_description,
    avgRating,
    reviewCount: reviewList.length,
    reviews: reviewList.map((r) => ({
      id: r.id,
      customerName: r.customer_name,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
    })),
  }
}

/** Produits similaires (même catégorie), pour la fiche produit. */
export async function getSimilarProducts(categoryId: string | null, excludeId: string, limit = 4): Promise<StorefrontProduct[]> {
  if (!categoryId) return []
  const supabase = createAdminClient()

  const { data: products } = await supabase
    .from("products")
    .select(
      "id, name, slug, price, compare_at_price, stock_quantity, imported, category_id, categories(name, slug), brands(name), product_images(url, sort_order)"
    )
    .eq("status", "actif")
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .limit(limit)

  return (products ?? []).map((p) => {
    const images = ((p.product_images as unknown as { url: string; sort_order: number }[]) ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => img.url)
    const category = p.categories as unknown as { name: string; slug: string } | null
    const brand = p.brands as unknown as { name: string } | null
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: brand?.name ?? null,
      price: p.price,
      oldPrice: p.compare_at_price,
      image: images[0] ?? PLACEHOLDER,
      images,
      imported: p.imported,
      category: category?.name ?? null,
      categoryId: p.category_id,
      categorySlug: category?.slug ?? null,
      inStock: p.stock_quantity > 0,
      stockQuantity: p.stock_quantity,
    }
  })
}

/** Catégories actives, pour la page d'accueil. */
export async function getActiveCategories() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug, description, icon")
    .eq("active", true)
    .order("sort_order", { ascending: true })
  return data ?? []
}

/** Tous les slugs produits actifs, pour générer le sitemap. */
export async function getAllProductSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  const supabase = createAdminClient()
  const { data } = await supabase.from("products").select("slug, updated_at").eq("status", "actif")
  return (data ?? []).map((p) => ({ slug: p.slug, updatedAt: p.updated_at }))
}

export type SiteSettingsPublic = {
  whatsappNumber: string
  freeDeliveryThreshold: number
  announcements: string[]
  whyChooseUsImageUrl: string
}

const DEFAULT_SITE_SETTINGS: SiteSettingsPublic = {
  whatsappNumber: "2250702602458",
  freeDeliveryThreshold: 20000,
  announcements: [],
  whyChooseUsImageUrl: "/images/why-choose-us.webp",
}

/**
 * Paramètres généraux du site (numéro WhatsApp, seuil de livraison offerte, annonces défilantes,
 * image de la section "Pourquoi nous choisir").
 */
export async function getSiteSettings(): Promise<SiteSettingsPublic> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["whatsapp_number", "free_delivery_threshold", "announcements", "why_choose_us_image_url"])

  const map = new Map((data ?? []).map((row) => [row.key, row.value]))

  return {
    whatsappNumber: (map.get("whatsapp_number") as string) ?? DEFAULT_SITE_SETTINGS.whatsappNumber,
    freeDeliveryThreshold: (map.get("free_delivery_threshold") as number) ?? DEFAULT_SITE_SETTINGS.freeDeliveryThreshold,
    announcements: (map.get("announcements") as string[]) ?? DEFAULT_SITE_SETTINGS.announcements,
    whyChooseUsImageUrl: (map.get("why_choose_us_image_url") as string) ?? DEFAULT_SITE_SETTINGS.whyChooseUsImageUrl,
  }
}

export type StorefrontHeroSlide = {
  id: string
  eyebrow: string | null
  title: string
  subtitle: string | null
  ctaLabel: string | null
  ctaHref: string | null
  imageUrl: string
}

/**
 * Slides "hero" à faire défiler en haut de la page d'accueil — gérés depuis l'admin
 * (Contenu du site). Tableau vide si aucun slide actif n'existe encore (le composant Hero
 * utilise alors un contenu de secours codé en dur, pour ne jamais laisser la page d'accueil vide).
 */
export async function getActiveHeroSlides(): Promise<StorefrontHeroSlide[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from("hero_slides")
    .select("id, eyebrow, title, subtitle, cta_label, cta_href, image_url")
    .eq("active", true)
    .not("image_url", "is", null)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: true })

  return (data ?? [])
    .filter((s): s is typeof s & { image_url: string } => Boolean(s.image_url))
    .map((s) => ({
      id: s.id,
      eyebrow: s.eyebrow,
      title: s.title,
      subtitle: s.subtitle,
      ctaLabel: s.cta_label,
      ctaHref: s.cta_href,
      imageUrl: s.image_url,
    }))
}

export type StorefrontBanner = {
  id: string
  title: string
  description: string | null
  badge: string | null
  code: string | null
  link: string | null
  imageUrl: string
}

/** Bannières promotionnelles actives pour le carrousel d'accueil, gérées depuis l'admin. */
export async function getActiveBanners(): Promise<StorefrontBanner[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from("banners")
    .select("id, title, description, badge, code, link, image_url")
    .eq("active", true)
    .not("image_url", "is", null)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: true })

  return (data ?? [])
    .filter((b): b is typeof b & { image_url: string } => Boolean(b.image_url))
    .map((b) => ({
      id: b.id,
      title: b.title,
      description: b.description,
      badge: b.badge,
      code: b.code,
      link: b.link,
      imageUrl: b.image_url,
    }))
}

export type PublicMarketingPixel = { platform: string; pixelId: string | null }

/** Pixels marketing actifs, pour l'injection dans le site public. */
export async function getEnabledMarketingPixels(): Promise<PublicMarketingPixel[]> {
  const supabase = createAdminClient()
  const { data } = await supabase.from("marketing_pixels").select("platform, pixel_id").eq("enabled", true)
  return (data ?? []).filter((p) => p.pixel_id).map((p) => ({ platform: p.platform, pixelId: p.pixel_id }))
}
