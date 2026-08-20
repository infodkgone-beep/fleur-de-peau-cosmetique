"use client"

import { useState, useTransition, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ImageUploader, type UploadedImage } from "@/components/admin/image-uploader"
import { createProduct, updateProduct } from "@/lib/actions/products"
import type { CategoryRow, BrandRow, ProductRow, ProductImageRow, ProductStatus } from "@/lib/types/database"

type Props = {
  categories: CategoryRow[]
  brands: BrandRow[]
  product?: ProductRow
  productImages?: ProductImageRow[]
  canEditAllFields: boolean
}

export function ProductForm({ categories, brands, product, productImages, canEditAllFields }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<UploadedImage[]>(
    (productImages ?? []).map((img) => ({ url: img.url, publicId: img.cloudinary_public_id }))
  )

  const [form, setForm] = useState({
    name: product?.name ?? "",
    category_id: product?.category_id ?? "",
    brand_id: product?.brand_id ?? "",
    short_description: product?.short_description ?? "",
    long_description: product?.long_description ?? "",
    benefits: product?.benefits ?? "",
    usage_instructions: product?.usage_instructions ?? "",
    ingredients: product?.ingredients ?? "",
    price: product?.price ?? 0,
    compare_at_price: product?.compare_at_price ?? "",
    cost_price: product?.cost_price ?? 0,
    sku: product?.sku ?? "",
    barcode: product?.barcode ?? "",
    stock_quantity: product?.stock_quantity ?? 0,
    low_stock_threshold: product?.low_stock_threshold ?? 5,
    status: (product?.status ?? "brouillon") as ProductStatus,
    imported: product?.imported ?? false,
    meta_title: product?.meta_title ?? "",
    meta_description: product?.meta_description ?? "",
  })

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (images.length < 2) {
      setError("Ajoute au moins 2 images du produit.")
      return
    }

    const payload = {
      ...form,
      category_id: form.category_id || null,
      brand_id: form.brand_id || null,
      short_description: form.short_description || null,
      long_description: form.long_description || null,
      benefits: form.benefits || null,
      usage_instructions: form.usage_instructions || null,
      ingredients: form.ingredients || null,
      compare_at_price: form.compare_at_price === "" ? null : Number(form.compare_at_price),
      sku: form.sku || null,
      barcode: form.barcode || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      images,
    }

    startTransition(async () => {
      try {
        if (product) {
          await updateProduct(product.id, payload)
        } else {
          await createProduct(payload)
        }
        router.push("/admin/produits")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue.")
      }
    })
  }

  const margin = form.price > 0 ? Math.round(((form.price - form.cost_price) / form.price) * 100) : 0

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-serif text-lg font-semibold">Images ({images.length}/2 min.)</h2>
        <div className="mt-3">
          <ImageUploader images={images} onChange={setImages} />
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <h2 className="col-span-full font-serif text-lg font-semibold">Informations générales</h2>

        <Field label="Nom du produit" required disabled={!canEditAllFields}>
          <input required disabled={!canEditAllFields} value={form.name} onChange={(e) => update("name", e.target.value)} className="input" />
        </Field>

        <Field label="Catégorie" disabled={!canEditAllFields}>
          <select disabled={!canEditAllFields} value={form.category_id} onChange={(e) => update("category_id", e.target.value)} className="input">
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Marque" disabled={!canEditAllFields}>
          <select disabled={!canEditAllFields} value={form.brand_id} onChange={(e) => update("brand_id", e.target.value)} className="input">
            <option value="">—</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="SKU" disabled={!canEditAllFields}>
          <input disabled={!canEditAllFields} value={form.sku} onChange={(e) => update("sku", e.target.value)} className="input" />
        </Field>

        <Field label="Code barre (optionnel)" disabled={!canEditAllFields}>
          <input disabled={!canEditAllFields} value={form.barcode} onChange={(e) => update("barcode", e.target.value)} className="input" />
        </Field>

        <Field label="Statut" disabled={!canEditAllFields}>
          <select disabled={!canEditAllFields} value={form.status} onChange={(e) => update("status", e.target.value as ProductStatus)} className="input">
            <option value="brouillon">Brouillon</option>
            <option value="actif">Actif</option>
            <option value="archive">Archivé</option>
          </select>
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" disabled={!canEditAllFields} checked={form.imported} onChange={(e) => update("imported", e.target.checked)} />
          Produit importé
        </label>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <h2 className="col-span-full font-serif text-lg font-semibold">Descriptions</h2>
        <Field label="Description courte" full disabled={!canEditAllFields}>
          <textarea disabled={!canEditAllFields} value={form.short_description} onChange={(e) => update("short_description", e.target.value)} className="input min-h-20" />
        </Field>
        <Field label="Description longue (optimisée vente)" full disabled={!canEditAllFields}>
          <textarea disabled={!canEditAllFields} value={form.long_description} onChange={(e) => update("long_description", e.target.value)} className="input min-h-32" />
        </Field>
        <Field label="Bienfaits" full disabled={!canEditAllFields}>
          <textarea disabled={!canEditAllFields} value={form.benefits} onChange={(e) => update("benefits", e.target.value)} className="input min-h-20" />
        </Field>
        <Field label="Mode d'utilisation" full disabled={!canEditAllFields}>
          <textarea disabled={!canEditAllFields} value={form.usage_instructions} onChange={(e) => update("usage_instructions", e.target.value)} className="input min-h-20" />
        </Field>
        <Field label="Ingrédients (optionnel)" full disabled={!canEditAllFields}>
          <textarea disabled={!canEditAllFields} value={form.ingredients} onChange={(e) => update("ingredients", e.target.value)} className="input min-h-20" />
        </Field>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-3">
        <h2 className="col-span-full font-serif text-lg font-semibold">Prix &amp; stock</h2>

        <Field label="Prix normal (FCFA)" required>
          <input required type="number" min={0} value={form.price} onChange={(e) => update("price", Number(e.target.value))} className="input" />
        </Field>
        <Field label="Prix promotionnel (FCFA)">
          <input type="number" min={0} value={form.compare_at_price} onChange={(e) => update("compare_at_price", e.target.value)} className="input" />
        </Field>
        <Field label="Coût d'achat (FCFA)" disabled={!canEditAllFields}>
          <input disabled={!canEditAllFields} type="number" min={0} value={form.cost_price} onChange={(e) => update("cost_price", Number(e.target.value))} className="input" />
        </Field>
        <Field label="Marge calculée">
          <div className="input flex items-center bg-secondary/40 font-semibold text-primary">{margin}%</div>
        </Field>
        <Field label="Stock">
          <input type="number" min={0} value={form.stock_quantity} onChange={(e) => update("stock_quantity", Number(e.target.value))} className="input" />
        </Field>
        <Field label="Seuil d'alerte">
          <input type="number" min={0} value={form.low_stock_threshold} onChange={(e) => update("low_stock_threshold", Number(e.target.value))} className="input" />
        </Field>
      </section>

      {canEditAllFields && (
        <section className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
          <h2 className="col-span-full font-serif text-lg font-semibold">SEO</h2>
          <Field label="Meta title">
            <input value={form.meta_title} onChange={(e) => update("meta_title", e.target.value)} className="input" />
          </Field>
          <Field label="Meta description">
            <input value={form.meta_description} onChange={(e) => update("meta_description", e.target.value)} className="input" />
          </Field>
        </section>
      )}

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={isPending} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {isPending ? "Enregistrement..." : product ? "Enregistrer les modifications" : "Créer le produit"}
        </button>
      </div>

      <style jsx global>{`
        .input {
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: var(--background);
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          width: 100%;
        }
        .input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  )
}

function Field({
  label,
  children,
  required,
  full,
  disabled,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
  full?: boolean
  disabled?: boolean
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${full ? "sm:col-span-full" : ""} ${disabled ? "opacity-70" : ""}`}>
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
    </div>
  )
}
