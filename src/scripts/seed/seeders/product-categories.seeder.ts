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
    conifers: [
      { name: 'Thuja', nameRu: 'Туя' },
      { name: 'Juniper', nameRu: 'Можжевельник' },
      { name: 'Pine', nameRu: 'Сосна' },
      { name: 'Spruce', nameRu: 'Ель' },
      { name: 'Fir', nameRu: 'Пихта' },
      { name: 'False Cypress', nameRu: 'Кипарисовик' },
    ],
    berries: [
      { name: 'Blueberry', nameRu: 'Голубика' },
      { name: 'Raspberry', nameRu: 'Малина' },
      { name: 'Blackberry', nameRu: 'Ежевика' },
      { name: 'Currant', nameRu: 'Смородина' },
      { name: 'Gooseberry', nameRu: 'Крыжовник' },
      { name: 'Lingonberry', nameRu: 'Брусника' },
      { name: 'Cranberry', nameRu: 'Клюква' },
    ],
    foliage: [
      { name: 'Dogwood', nameRu: 'Дёрен' },
      { name: 'Ninebark', nameRu: 'Пузыреплодник' },
    ],
    perennials: [],
  } as const
  const createOperations = productGroups.flatMap(({ name, id }) => {
    const categories = categoriesMap[name as keyof typeof categoriesMap]
    if (!categories) {
      return []
    }

    return categories.map((category) => {
      return payload.create({
        collection: 'product-categories',
        data: {
          name: category.name,
          nameRu: category.nameRu,
          slug: buildCategorySlug(category.name),
          group: id,
        },
      })
    })
  })

  await Promise.all(createOperations)
}
