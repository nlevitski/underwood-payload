import type { Payload } from 'payload'

import type { Media, ProductCategory, ProductGroup } from '@/payload-types'

export type HomepageCategoryCardViewModel = {
  id: number
  title: string
  description: string
  image: string
  href: string
  category: string
  chips: string[]
}

function isPopulatedRelation<T extends { id: number }>(value: number | T): value is T {
  return typeof value === 'object' && value !== null
}

export async function getHomepageCategoryCards(
  payload: Payload,
): Promise<HomepageCategoryCardViewModel[]> {
  const { docs } = await payload.find({
    collection: 'homepage-category-cards',
    depth: 2,
    limit: 20,
    pagination: false,
    sort: 'sortOrder',
  })

  return docs.flatMap(({ id, title, description, image, group, categories }) => {
    if (!isPopulatedRelation<Media>(image) || !image.url) {
      return []
    }

    if (!isPopulatedRelation<ProductGroup>(group)) {
      return []
    }

    const chips = (categories ?? []).flatMap((category) =>
      isPopulatedRelation<ProductCategory>(category) ? [category.nameRu] : [],
    )

    return [
      {
        id,
        title,
        description,
        image: image.url,
        href: `/catalog?category=${encodeURIComponent(group.slug)}`,
        category: group.slug,
        chips,
      },
    ]
  })
}
