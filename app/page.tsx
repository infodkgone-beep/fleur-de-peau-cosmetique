import { AnnouncementBar } from "@/components/announcement-bar"
import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { BannerCarousel } from "@/components/banner-carousel"
import { Categories } from "@/components/categories"
import { Promotions } from "@/components/promotions"
import { Products } from "@/components/products"
import { TrustBanner } from "@/components/trust-banner"
import { WhyChooseUs } from "@/components/why-choose-us"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
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
      <Hero />
      <BannerCarousel />
      <Categories categories={categories} />
      <Promotions whatsappNumber={settings.whatsappNumber} />
      <Products products={products} whatsappNumber={settings.whatsappNumber} />
      <TrustBanner />
      <WhyChooseUs />
      <SiteFooter />
      <WhatsAppFloat whatsappNumber={settings.whatsappNumber} />
    </main>
  )
}
