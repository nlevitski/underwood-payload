import type { MetadataRoute } from 'next'

import { getArticles } from '@/collections/Articles/fetchers'
import { getPayloadClient } from '@/lib/payload/client'
import { absoluteURL } from '@/lib/seo/metadata'

import { getDbProducts } from './catalog/dbProducts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const [articles, products] = await Promise.all([getArticles(), getDbProducts(payload)])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteURL('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteURL('/catalog'), changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteURL('/blog'), changeFrequency: 'weekly', priority: 0.8 },
    { url: absoluteURL('/about'), changeFrequency: 'monthly', priority: 0.6 },
    { url: absoluteURL('/gallery'), changeFrequency: 'monthly', priority: 0.6 },
    { url: absoluteURL('/contacts'), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteURL(`/catalog/${product.slug}`),
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: absoluteURL(`/blog/${article.slug}`),
    lastModified: article.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes, ...articleRoutes]
}
