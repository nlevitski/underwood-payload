import type { Payload } from 'payload'
import { slugify } from 'payload/shared'

function buildCategorySlug(categoryName: string): string {
  const directSlug = slugify(categoryName)
  if (directSlug) {
    return directSlug
  }

  const unicodeSlug = categoryName
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

  if (unicodeSlug) {
    return unicodeSlug
  }

  throw new Error(`Cannot generate slug for product category "${categoryName}"`)
}

export async function seedProductCategories(payload: Payload) {
  const { docs: productGroups } = await payload.find({
    collection: 'product-groups',
    depth: 0,
    limit: 0,
    pagination: false,
  })
  const categoriesMap = {
    conifers: ['Туя', 'Можжевельник', 'Сосна', 'Ель', 'Пихта', 'Кипарисовик'],
    berries: ['Голубика', 'Малина', 'Ежевика', 'Смородина', 'Крыжовник', 'Брусника', 'Клюква'],
    shrubs: ['Дёрен', 'Пузыреплодник'],
  }
  const createOperations = productGroups.flatMap(({ name, id }) => {
    const categories = categoriesMap[name as keyof typeof categoriesMap]
    if (!categories) {
      return []
    }

    return categories.map((category) => {
      return payload.create({
        collection: 'product-categories',
        data: {
          name: category,
          slug: buildCategorySlug(category),
          group: id,
        },
      })
    })
  })

  await Promise.all(createOperations)
}
