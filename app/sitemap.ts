import type { MetadataRoute } from 'next'
import { getAllProductSlugs } from '@/lib/storefront'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProductSlugs()

  return [
    {
      url: 'https://fleurdepeau.beauty',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...products.map((p) => ({
      url: `https://fleurdepeau.beauty/produit/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
