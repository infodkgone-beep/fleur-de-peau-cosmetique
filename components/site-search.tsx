"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Search, X, Loader2 } from "lucide-react"
import { searchProducts, type ProductSearchResult } from "@/lib/actions/search"
import { formatPrice } from "@/lib/products"

export function SiteSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ProductSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const timeout = setTimeout(() => {
      searchProducts(q)
        .then(setResults)
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(timeout)
  }, [query, open])

  function close() {
    setOpen(false)
    setQuery("")
    setResults([])
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Rechercher un produit"
        className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
      >
        <Search className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/50 p-4 backdrop-blur-sm sm:pt-24"
          role="dialog"
          aria-modal="true"
          aria-label="Recherche de produits"
          onClick={close}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
              />
              {loading && <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-muted-foreground" />}
              <button
                type="button"
                onClick={close}
                aria-label="Fermer la recherche"
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim().length < 2 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Tapez au moins 2 lettres du nom d&apos;un produit.
                </p>
              ) : (
                <>
                  {!loading && results.length === 0 && (
                    <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                      Aucun produit trouvé pour « {query.trim()} ».
                    </p>
                  )}
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/produit/${product.slug}`}
                      onClick={close}
                      className="flex items-center gap-3 border-b border-border px-4 py-3 transition-colors last:border-0 hover:bg-secondary/60"
                    >
                      <span className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-secondary/50">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">{product.name}</span>
                        <span className="block text-xs text-muted-foreground">{product.brand ?? "Fleur de peau"}</span>
                      </span>
                      <span className="flex-shrink-0 text-sm font-semibold text-primary">
                        {formatPrice(product.price)}
                      </span>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
