import type { Metadata } from "next"
import { AnnouncementBar } from "@/components/announcement-bar"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { CartPageClient } from "@/components/cart-page-client"
import { getSiteSettings } from "@/lib/storefront"

export const metadata: Metadata = {
  title: "Votre panier",
  robots: { index: false, follow: true },
}

export const revalidate = 60

export default async function CartPage() {
  const settings = await getSiteSettings()

  return (
    <main className="min-h-screen bg-background">
      <AnnouncementBar announcements={settings.announcements} />
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
        <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">Votre panier</h1>
        <div className="mt-8">
          <CartPageClient whatsappNumber={settings.whatsappNumber} freeDeliveryThreshold={settings.freeDeliveryThreshold} />
        </div>
      </div>

      <SiteFooter />
      <WhatsAppFloat whatsappNumber={settings.whatsappNumber} />
    </main>
  )
}
