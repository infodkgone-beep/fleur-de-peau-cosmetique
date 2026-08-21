import type { MetadataRoute } from "next"

/**
 * Manifeste PWA — permet au site d'être "installé" comme une application sur mobile
 * (Android : bouton "Installer l'application" / bannière automatique de Chrome), sur
 * ordinateur (Chrome, Edge : icône d'installation dans la barre d'adresse), et via
 * "Ajouter à l'écran d'accueil" sur iOS/iPadOS (Safari ne propose pas d'installation
 * automatique, mais utilise ce manifeste + app/apple-icon.png pour l'icône et le nom).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fleur de peau Cosmétique",
    short_name: "Fleur de peau",
    description:
      "Boutique en ligne de produits cosmétiques importés : soins visage, corps, anti-taches, hydratants, protection solaire et compléments alimentaires. Livraison à Abidjan.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#fff8f8",
    theme_color: "#972159",
    lang: "fr",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
