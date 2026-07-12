import { getPayloadClient } from '@/lib/payload/client'
import type { Article } from '@/payload-types'
import { statusOptions } from './constants'

export async function getArticles() {
  try {
    const payload = await getPayloadClient()
    const { docs: articles } = await payload.find({
      depth: 2,
      collection: 'articles',
      where: {
        status: {
          equals: statusOptions.published,
        },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        contentSummary: true,
        author: true,
        category: true,
        coverImage: true,
        meta: true,
        status: true,
        readTimeInMins: true,
        publishedAt: true,
      },
      sort: 'id',
    })
    return (articles ?? []) as Article[]
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

export async function getArticleSlugs() {
  try {
    const payload = await getPayloadClient()
    const { docs: articles } = await payload.find({
      collection: 'articles',
      where: {
        status: {
          equals: statusOptions.published,
        },
      },
      select: {
        slug: true,
      },
    })
    return (articles ?? []) as Pick<Article, 'slug'>[]
  } catch (error) {
    console.error('Error fetching article:', error)
    return []
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    const { docs: articles } = await payload.find({
      depth: 1,
      collection: 'articles',
      where: {
        slug: {
          equals: slug,
        },
        status: {
          equals: statusOptions.published,
        },
      },
      limit: 1,
    })
    return ((articles ?? [])[0] ?? null) as Article | null
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}
