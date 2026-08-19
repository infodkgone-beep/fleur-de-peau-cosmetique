import { BadgeCheck, HeartPulse, MessageCircleHeart, Truck } from "lucide-react"

const items = [
  {
    icon: BadgeCheck,
    title: "Produits de qualité",
    text: "Une sélection rigoureuse de cosmétiques importés.",
  },
  {
    icon: HeartPulse,
    title: "Efficacité & sécurité",
    text: "Des résultats visibles, en toute confiance.",
  },
  {
    icon: MessageCircleHeart,
    title: "Conseils personnalisés",
    text: "Adaptés à votre type de peau et vos besoins.",
  },
  {
    icon: Truck,
    title: "Livraison rapide",
    text: "Une livraison sécurisée partout à Abidjan.",
  },
]

export function TrustBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <item.icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-serif text-base font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
