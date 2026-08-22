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
    <main className="min-h-screen bg-background">
      <AnnouncementBar announcements={settings.announcements} />
      <SiteHeader />
      <CategoryRail categories={categories} />
      <BannerCarousel />
      <Hero />
      <div className="flex flex-col">
        <div className="order-2 lg:order-1">
          <Promotions whatsappNumber={settings.whatsappNumber} />
        </div>
        <div className="order-1 lg:order-2">
          <Products products={products} whatsappNumber={settings.whatsappNumber} />
        </div>
      </div>
      <TrustBanner />
      <WhyChooseUs />
      <SiteFooter />
      <WhatsAppFloat whatsappNumber={settings.whatsappNumber} />
      <PwaInstallButton />
    </main>
  )
}
