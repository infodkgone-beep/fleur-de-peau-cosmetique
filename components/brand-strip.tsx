import type { StorefrontBrand } from "@/lib/storefront"

/**
 * Bandeau "Nos marques" — défilement horizontal automatique et continu des marques importées
 * vendues en boutique. Affiche le logo réel de la marque une fois ajouté depuis l'admin
 * (Contenu du site > Logos des marques) ; en attendant, affiche son nom en badge texte pour que
 * le bandeau reste complet même si tous les logos n'ont pas encore été mis en ligne.
 */
export function BrandStrip({ brands }: { brands: StorefrontBrand[] }) {
  if (brands.length === 0) return null

  // La liste est dupliquée pour un défilement en boucle continue et sans coupure (translateX -50%).
  const track = [...brands, ...brands]

  return (
    <section className="border-y border-border bg-secondary/30 py-8">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-foreground">Nos marques</p>
      </div>

      <div className="group relative mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="brand-marquee flex w-max items-center gap-10 group-hover:[animation-play-state:paused]">
          {track.map((brand, index) => (
            <div key={`${brand.name}-${index}`} className="flex h-16 flex-shrink-0 items-center justify-center px-2">
              {brand.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- logo dynamique (Cloudinary), non listé dans next.config
                <img src={brand.logoUrl} alt={brand.name} className="h-12 w-auto max-w-[9rem] object-contain" />
              ) : (
                <span className="whitespace-nowrap rounded-full border border-gold/30 bg-card px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-foreground shadow-sm">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
