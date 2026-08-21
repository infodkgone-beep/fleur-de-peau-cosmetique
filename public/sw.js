// Service worker minimal pour rendre le site "installable" (PWA) sur Android / Chrome / Edge
// et lui donner un comportement d'application (icône, écran de démarrage) sur iOS.
//
// Volontairement TRÈS simple : il ne met en cache que quelques images statiques (icônes),
// jamais les pages, les commandes, le stock ou l'admin. Le site vend des produits en temps
// réel (stock, commandes, comptabilité) : mettre en cache les pages ferait courir le risque
// d'afficher des données périmées (ex. un stock qui n'existe plus). On garde donc tout le
// reste en passthrough réseau pur.

const CACHE_NAME = "fdp-static-v1"
const PRECACHE_URLS = ["/icons/icon-192.png", "/icons/icon-512.png"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => {})
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return

  const url = new URL(request.url)
  const isPrecachedIcon = PRECACHE_URLS.includes(url.pathname)

  if (isPrecachedIcon) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    )
    return
  }

  // Tout le reste (pages, API, admin, images produits...) : réseau direct, jamais de cache,
  // pour ne jamais servir de données commerciales périmées.
})
