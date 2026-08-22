import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { HeroSlideForm } from "@/components/admin/hero-slide-form"
import { BannerForm } from "@/components/admin/banner-form"
import { HeroSlideRowActions, BannerRowActions } from "@/components/admin/content-row-actions"
import { WhyChooseUsImageForm } from "@/components/admin/why-choose-us-image-form"

const DEFAULT_WHY_CHOOSE_US_IMAGE = "/images/why-choose-us.webp"

export default async function ContentPage() {
  await requireRole(["super_admin", "content_manager"])
  const supabase = await createClient()

  const [{ data: slides }, { data: banners }, { data: whyChooseUsSetting }] = await Promise.all([
    supabase.from("hero_slides").select("*").order("sort_order", { ascending: true }),
    supabase.from("banners").select("*").order("sort_order", { ascending: true }),
    supabase.from("site_settings").select("value").eq("key", "why_choose_us_image_url").maybeSingle(),
  ])

  const whyChooseUsImageUrl = (whyChooseUsSetting?.value as string | undefined) ?? DEFAULT_WHY_CHOOSE_US_IMAGE

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Contenu du site</h1>
        <p className="text-sm text-muted-foreground">
          Gère le slider d&apos;accueil, les bannières promotionnelles et les autres images du site — sans toucher au
          code.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-serif text-lg font-semibold text-foreground">Slider d&apos;accueil</h2>
          <p className="text-xs text-muted-foreground">
            Toutes les slides actives défilent automatiquement en haut de la page d&apos;accueil, comme un carrousel.
          </p>
        </div>
        <HeroSlideForm />
        <div className="flex flex-col gap-2">
          {(slides ?? []).map((s) => (
            <div key={s.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3">
              {s.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.image_url} alt="" className="h-16 w-16 flex-shrink-0 rounded-xl object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{s.title}</p>
                <p className="truncate text-xs text-muted-foreground">{s.subtitle ?? s.eyebrow ?? "—"}</p>
              </div>
              <HeroSlideRowActions id={s.id} active={s.active} cloudinaryPublicId={s.cloudinary_public_id} />
            </div>
          ))}
          {(slides ?? []).length === 0 && <p className="text-sm text-muted-foreground">Aucun slide pour l&apos;instant.</p>}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-lg font-semibold text-foreground">Bannières promotionnelles</h2>
        <BannerForm />
        <div className="flex flex-col gap-2">
          {(banners ?? []).map((b) => (
            <div key={b.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3">
              {b.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.image_url} alt="" className="h-16 w-16 flex-shrink-0 rounded-xl object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">
                  {b.title} {b.badge && <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{b.badge}</span>}
                </p>
                <p className="truncate text-xs text-muted-foreground">{b.description ?? "—"}</p>
              </div>
              <BannerRowActions id={b.id} active={b.active} cloudinaryPublicId={b.cloudinary_public_id} />
            </div>
          ))}
          {(banners ?? []).length === 0 && <p className="text-sm text-muted-foreground">Aucune bannière pour l&apos;instant.</p>}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-lg font-semibold text-foreground">Autres images du site</h2>
        <WhyChooseUsImageForm currentImageUrl={whyChooseUsImageUrl} />
      </section>
    </div>
  )
}
