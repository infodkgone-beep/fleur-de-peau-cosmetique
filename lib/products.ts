export const WHATSAPP_NUMBER = "2250702602458"

export type Product = {
  id: string
  name: string
  brand: string
  price: number
  /** Ancien prix avant réduction. Si présent, le produit est en promotion. */
  oldPrice?: number
  image: string
  imported?: boolean
  category: string
}

export type Promotion = {
  id: string
  title: string
  description: string
  badge: string
  /** Code promo optionnel à mentionner sur WhatsApp. */
  code?: string
}

export type Banner = {
  id: string
  image: string
  eyebrow: string
  title: string
  subtitle: string
  cta: string
  href: string
}

/** Affiches défilantes du carrousel hero. */
export const banners: Banner[] = [
  {
    id: "banner-serums",
    image: "/images/banner-serums.webp",
    eyebrow: "Offre de la semaine",
    title: "-20% sur tous les sérums",
    subtitle: "Éclat, hydratation et anti-taches à prix réduit. Code SERUM20.",
    cta: "Profiter de l'offre",
    href: "#promotions",
  },
  {
    id: "banner-delivery",
    image: "/images/banner-delivery.webp",
    eyebrow: "Rien que pour vous",
    title: "Livraison offerte à Abidjan",
    subtitle: "Dès 20 000 FCFA d'achat. Vos soins livrés jusqu'à votre porte.",
    cta: "Découvrir la boutique",
    href: "#boutique",
  },
  {
    id: "banner-newarrivals",
    image: "/images/banner-newarrivals.webp",
    eyebrow: "Nouveautés",
    title: "Nouveaux produits importés",
    subtitle: "Fraîchement arrivés et en quantités limitées. À saisir vite !",
    cta: "Voir les nouveautés",
    href: "#boutique",
  },
]

/** Bannières promotionnelles défilantes affichées en haut du site. */
export const announcements: string[] = [
  "🎉 -20% sur tous les sérums cette semaine · Code SERUM20",
  "🚚 Livraison OFFERTE à Abidjan dès 20 000 FCFA d'achat",
  "🌸 Nouveaux produits importés en stock · Quantités limitées",
]

export const promotions: Promotion[] = [
  {
    id: "promo-semaine",
    title: "Offre de la semaine",
    description: "Jusqu'à -25% sur une sélection de soins visage et corps.",
    badge: "-25%",
    code: "PEAU25",
  },
  {
    id: "promo-livraison",
    title: "Livraison offerte",
    description: "Frais de livraison gratuits à Abidjan dès 20 000 FCFA d'achat.",
    badge: "GRATUIT",
  },
  {
    id: "promo-duo",
    title: "Duo éclat",
    description: "Sérum + crème hydratante achetés ensemble à prix réduit.",
    badge: "PACK",
    code: "DUOECLAT",
  },
]

export const products: Product[] = [
  {
    id: "serum-eclat",
    name: "Sérum Éclat Vitamine C",
    brand: "Glow Lab",
    price: 9600,
    oldPrice: 12000,
    image: "/images/product-serum.webp",
    imported: true,
    category: "Soins du visage",
  },
  {
    id: "creme-hydratante",
    name: "Crème Hydratante Intense",
    brand: "Belle Peau",
    price: 7600,
    oldPrice: 9500,
    image: "/images/product-cream.webp",
    category: "Hydratants nourrissants",
  },
  {
    id: "lait-corps",
    name: "Lait Corps Nourrissant",
    brand: "Soft Skin",
    price: 8000,
    image: "/images/product-lotion.webp",
    category: "Soins du corps",
  },
  {
    id: "protection-solaire",
    name: "Écran Solaire SPF 50+",
    brand: "Sun Care",
    price: 11000,
    image: "/images/product-sunscreen.webp",
    imported: true,
    category: "Protection solaire",
  },
  {
    id: "serum-anti-taches",
    name: "Sérum Anti-Taches Éclaircissant",
    brand: "Pure Glow",
    price: 11600,
    oldPrice: 14500,
    image: "/images/product-darkspot.webp",
    imported: true,
    category: "Anti-taches éclaircissants",
  },
  {
    id: "complement",
    name: "Complément Beauté Collagène",
    brand: "Vita Beauty",
    price: 16000,
    image: "/images/product-supplement.webp",
    category: "Compléments alimentaires",
  },
  {
    id: "nettoyant",
    name: "Mousse Nettoyante Douce",
    brand: "Belle Peau",
    price: 7000,
    image: "/images/product-cleanser.webp",
    category: "Soins du visage",
  },
  {
    id: "huile-corps",
    name: "Huile Précieuse Corps",
    brand: "Soft Skin",
    price: 10500,
    image: "/images/product-oil.webp",
    imported: true,
    category: "Soins du corps",
  },
]

export type Category = {
  name: string
  description: string
  icon: string
}

export const categories: Category[] = [
  { name: "Soins du visage", description: "Éclat & fraîcheur", icon: "Sparkles" },
  { name: "Soins du corps", description: "Douceur au quotidien", icon: "Flower2" },
  { name: "Anti-taches éclaircissants", description: "Teint unifié", icon: "Sun" },
  { name: "Hydratants nourrissants", description: "Peau nourrie", icon: "Droplets" },
  { name: "Protection solaire", description: "Protection UV", icon: "ShieldCheck" },
  { name: "Compléments alimentaires", description: "Beauté de l'intérieur", icon: "Leaf" },
]

export function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
}

/** Pourcentage de réduction arrondi, ou null si le produit n'est pas en promo. */
export function discountPercent(product: Product): number | null {
  if (!product.oldPrice || product.oldPrice <= product.price) return null
  return Math.round((1 - product.price / product.oldPrice) * 100)
}
