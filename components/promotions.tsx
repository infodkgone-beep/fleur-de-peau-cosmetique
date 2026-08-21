import { Tag, Truck, Gift } from "lucide-react"
import { WhatsAppIcon } from "@/components/site-header"
import { promotions, WHATSAPP_NUMBER as DEFAULT_WHATSAPP_NUMBER } from "@/lib/products"

const icons = [Tag, Truck, Gift]

function whatsappLink(number: string, title: string, code?: string) {
  const message =
    `Bonjour Fleur de peau Cosmétique ! Je suis intéressé(e) par la promotion : ${title}.` +
    (code ? `\nCode promo : ${code}` : "")
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function Promotions({ whatsappNumber = DEFAULT_WHATSAPP_NUMBER }: { whatsappNumber?: string }) {
  return (
    <section id="promotions" className="bg-background py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-gold-foreground">
            <Tag className="h-3.5 w-3.5" />
            Offres du moment
          </span>
          <h2 className="mt-4 text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Nos promotions
          </h2>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            Profitez de nos offres exclusives pour prendre soin de votre peau à petit prix.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {promotions.map((promo, i) => {
            const Icon = icons[i % icons.length]
            return (
              <article
                key={promo.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-gold/30 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 text-sm font-extrabold text-primary-foreground shadow">
                  {promo.badge}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-serif text-xl font-bold text-foreground">{promo.title}</h3>
                <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {promo.description}
                </p>
                {promo.code && (
                  <p className="mt-3 text-sm text-foreground">
                    Code&nbsp;:{" "}
                    <span className="rounded-md border border-dashed border-primary/50 bg-secondary px-2 py-0.5 font-mono font-bold tracking-widest text-primary">
                      {promo.code}
                    </span>
                  </p>
                )}
                <a
                  href={whatsappLink(whatsappNumber, promo.title, promo.code)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  J&apos;en profite
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
