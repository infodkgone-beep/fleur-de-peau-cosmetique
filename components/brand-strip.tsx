/** Bandeau "Nos marques" — met en avant les marques importées vendues en boutique. */
export function BrandStrip({ brands }: { brands: string[] }) {
  if (brands.length === 0) return null

  return (
    <section className="border-y border-border bg-secondary/30 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-foreground">Nos marques</p>
          <h2 className="mt-3 text-balance font-serif text-2xl font-bold text-foreground sm:text-3xl">
            Des marques importées que vous connaissez et adorez
          </h2>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {brands.map((brand) => (
            <span
              key={brand}
              className="rounded-full border border-gold/30 bg-card px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-foreground shadow-sm"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
