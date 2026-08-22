import { AnnouncementBar } from "@/components/announcement-bar"
import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { BannerCarousel } from "@/components/banner-carousel"
import { CategoryRail } from "@/components/category-rail"
import { Promotions } from "@/components/promotions"
import { Products } from "@/components/products"
import { TrustBanner } from "@/components/trust-banner"
import { WhyChooseUs } from "@/components/why-choose-us"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { PwaInstallButton } from "@/components/pwa-install-button"
import { getActiveCategories, getActiveProducts, getSiteSettings } from "@/lib/storefront"

export const revalidate = 60

export default async function Page() {
  const [products, categories, settings] = await Promise.all([
    getActiveProducts(),
    getActiveCategories(),
    getSiteSettings(),
  ])

  return (
    <main className="relative min-h-screen bg-background">
      {/* Motif de fond décoratif (icônes cosmétiques), en filigrane léger derrière le contenu —
          uniquement sur la page d'accueil. Les sections qui ont leur propre fond (produits,
          pied de page...) le recouvrent naturellement ; il ne reste visible que dans les zones
          transparentes (hero, bannières de confiance...). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-repeat opacity-[0.3]"
        style={{ backgroundImage: "url('/images/bg-motifs-accueil.webp')" }}
      />
      <AnnouncementBar announcements={settings.announcements} />
      <SiteHeader />
      <CategoryRail categories={categories} />
      <BannerCarousel />
      <Hero />
      <div className="flex flex-col">
        <Products products={products} whatsappNumber={settings.whatsappNumber} />
        <Promotions whatsappNumber={settings.whatsappNumber} />
      </div>
      <TrustBanner />
      <WhyChooseUs />
      <SiteFooter />
      <WhatsAppFloat whatsappNumber={settings.whatsappNumber} />
      <PwaInstallButton />
    </main>
  )
}
