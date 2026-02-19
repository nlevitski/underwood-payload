import type { Payload } from 'payload'
import { slugify } from 'payload/shared'

export async function seedProductGroups(payload: Payload) {
  await Promise.all(
    ['conifers', 'berries', 'shrubs'].map((name) => {
      return payload.create({
        collection: 'product-groups',
        data: {
          name,
          slug: slugify(name) || '',
        },
      })
    }),
  )
}
