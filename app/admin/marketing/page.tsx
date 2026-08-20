import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { PixelToggle } from "@/components/admin/pixel-toggle"
import { SiteSettingsForm } from "@/components/admin/site-settings-form"
import type { MarketingPlatform } from "@/lib/types/database"

const PLATFORM_LABELS: Record<MarketingPlatform, string> = {
  meta_pixel: "Meta Pixel (Facebook)",
  instagram: "Instagram",
  tiktok_pixel: "TikTok Pixel",
  google_analytics: "Google Analytics (GA4)",
  google_tag_manager: "Google Tag Manager",
  google_ads: "Google Ads",
  youtube: "YouTube",
  pinterest: "Pinterest",
  snapchat: "Snapchat",
}

const PLATFORM_ORDER: MarketingPlatform[] = [
  "meta_pixel",
  "instagram",
  "tiktok_pixel",
  "google_analytics",
  "google_tag_manager",
  "google_ads",
  "youtube",
  "pinterest",
  "snapchat",
]

export default async function MarketingPage() {
  await requireRole(["super_admin"])
  const supabase = await createClient()

  const [{ data: pixels }, { data: settings }] = await Promise.all([
    supabase.from("marketing_pixels").select("platform, pixel_id, enabled"),
    supabase.from("site_settings").select("key, value").in("key", ["whatsapp_number", "free_delivery_threshold", "announcements"]),
  ])

  const settingsMap = new Map((settings ?? []).map((s) => [s.key, s.value]))
  const pixelsMap = new Map((pixels ?? []).map((p) => [p.platform, p]))

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Pixels marketing & paramètres</h1>
        <p className="text-sm text-muted-foreground">
          Active tes outils de suivi publicitaire sans toucher au code — ils s&apos;injectent automatiquement sur le
          site public dès qu&apos;un identifiant est renseigné et activé.
        </p>
      </div>

      <section>
        <h2 className="font-serif text-lg font-semibold text-foreground">Pixels & balises</h2>
        <div className="mt-3 flex flex-col gap-2">
          {PLATFORM_ORDER.map((platform) => {
            const row = pixelsMap.get(platform)
            return (
              <PixelToggle
                key={platform}
                platform={platform}
                label={PLATFORM_LABELS[platform]}
                initialPixelId={row?.pixel_id ?? null}
                initialEnabled={row?.enabled ?? false}
              />
            )
          })}
        </div>
      </section>

      <SiteSettingsForm
        whatsappNumber={(settingsMap.get("whatsapp_number") as string) ?? "2250702602458"}
        freeDeliveryThreshold={(settingsMap.get("free_delivery_threshold") as number) ?? 20000}
        announcements={(settingsMap.get("announcements") as string[]) ?? []}
      />
    </div>
  )
}
