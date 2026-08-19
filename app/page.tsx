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

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <Hero />
      <BannerCarousel />
      <Categories />
      <Promotions />
      <Products />
      <TrustBanner />
      <WhyChooseUs />
      <SiteFooter />
      <WhatsAppFloat />
    </main>
  )
}
