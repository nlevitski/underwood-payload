import type { Payload } from 'payload'
import { slugify } from 'payload/shared'

export async function seedProductGroups(payload: Payload) {
  await Promise.all(
    [
      {
        name: 'conifers',
        nameRu: 'Хвойные',
      },
      { name: 'berries', nameRu: 'Ягодные' },
      { name: 'foliage', nameRu: 'Лиственные' },
      { name: 'perennials', nameRu: 'Многолетние' },
    ].map(({ name, nameRu }) => {
      return payload.create({
        collection: 'product-groups',
        data: {
          name,
          nameRu,
          slug: slugify(name) || '',
        },
      })
    }),
  )
}
