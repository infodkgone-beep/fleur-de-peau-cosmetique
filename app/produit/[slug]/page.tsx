import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Star, ShieldCheck, Truck, RefreshCw } from "lucide-react"
import { AnnouncementBar } from "@/components/announcement-bar"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { PwaInstallButton } from "@/components/pwa-install-button"
import { ProductGallery } from "@/components/product-gallery"
import { ProductPurchaseActions } from "@/components/product-purchase-actions"
import { formatPrice, type Product } from "@/lib/products"
import { getProductBySlug, getSimilarProducts, getSiteSettings } from "@/lib/storefront"

const siteUrl = "https://fleurdepeau.beauty"

/** Pourcentage de réduction arrondi, ou null si le produit n'est pas en promo. */
function discountPercent(price: number, oldPrice: number | null): number | null {
  if (!oldPrice || oldPrice <= price) return null
  return Math.round((1 - price / oldPrice) * 100)
}

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Produit introuvable" }

  const title = product.metaTitle || product.name
  const description = product.metaDescription || product.shortDescription || `${product.name} — Fleur de peau Cosmétique`
  const url = `${siteUrl}/produit/${product.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [{ url: product.image, width: 1200, height: 1200, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const [similar, settings] = await Promise.all([
    getSimilarProducts(product.categoryId, product.id),
    getSiteSettings(),
  ])

  const orderFormProduct: Product = {
    id: product.id,
    name: product.name,
    brand: product.brand ?? "Fleur de peau",
    price: product.price,
    oldPrice: product.oldPrice ?? undefined,
    image: product.image,
    imported: product.imported,
    category: product.category ?? "",
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.shortDescription ?? product.longDescription ?? undefined,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    sku: product.id,
    aggregateRating:
      product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.avgRating?.toFixed(1),
            reviewCount: product.reviewCount,
          }
        : undefined,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/produit/${product.slug}`,
      priceCurrency: "XOF",
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  }

  return (
    <main className="min-h-screen bg-background">
      <AnnouncementBar announcements={settings.announcements} />
      <SiteHeader />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Accueil
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <span>{product.category}</span>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-2">
          <ProductGallery images={product.images} name={product.name} />

          <div className="flex flex-col">
            {product.brand && (
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.brand}</p>
            )}
            <h1 className="mt-1 text-balance font-serif text-2xl font-bold text-foreground sm:text-3xl">
              {product.name}
            </h1>

            {product.reviewCount > 0 && product.avgRating && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" fill={i < Math.round(product.avgRating!) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {product.avgRating.toFixed(1)} ({product.reviewCount} avis)
                </span>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-baseline gap-x-3">
              <p className="font-serif text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
              {product.oldPrice && (
                <p className="text-lg font-medium text-muted-foreground line-through">{formatPrice(product.oldPrice)}</p>
              )}
              {discountPercent(product.price, product.oldPrice) !== null && (
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  -{discountPercent(product.price, product.oldPrice)}%
                </span>
              )}
            </div>

            {product.shortDescription && (
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{product.shortDescription}</p>
            )}

            <div className="mt-6">
              <ProductPurchaseActions
                product={orderFormProduct}
                slug={product.slug}
                image={product.image}
                inStock={product.inStock}
                stockQuantity={product.stockQuantity}
                whatsappNumber={settings.whatsappNumber}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-3">
              <TrustPoint icon={Truck} label="Livraison à Abidjan" />
              <TrustPoint icon={ShieldCheck} label="Produits authentiques" />
              <TrustPoint icon={RefreshCw} label="Support WhatsApp" />
            </div>

            {(product.longDescription || product.benefits || product.usageInstructions || product.ingredients) && (
              <div className="mt-8 flex flex-col gap-6 border-t border-border pt-6">
                {product.longDescription && <InfoBlock title="Description" content={product.longDescription} />}
                {product.benefits && <InfoBlock title="Bienfaits" content={product.benefits} />}
                {product.usageInstructions && <InfoBlock title="Mode d'utilisation" content={product.usageInstructions} />}
                {product.ingredients && <InfoBlock title="Ingrédients" content={product.ingredients} />}
              </div>
            )}
          </div>
        </div>

        {product.reviews.length > 0 && (
          <section className="mt-14 border-t border-border pt-10">
            <h2 className="font-serif text-2xl font-bold text-foreground">Avis clients</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {product.reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{r.customerName}</p>
                    <div className="flex items-center gap-0.5 text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5" fill={i < r.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {similar.length > 0 && (
          <section className="mt-14 border-t border-border pt-10">
            <h2 className="font-serif text-2xl font-bold text-foreground">Produits similaires</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {similar.map((p) => (
                <Link
                  key={p.id}
                  href={`/produit/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="aspect-square overflow-hidden bg-secondary/50">
                    <img
                      src={p.image || "/placeholder.svg"}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-serif text-sm font-semibold text-foreground">{p.name}</p>
                    <p className="mt-1 text-sm font-bold text-primary">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <SiteFooter />
      <WhatsAppFloat whatsappNumber={settings.whatsappNumber} />
      <PwaInstallButton />
    </main>
  )
}

function TrustPoint({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  )
}

function InfoBlock({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 whitespace-pre-line text-pretty leading-relaxed text-muted-foreground">{content}</p>
    </div>
  )
}
