import type { Payload } from 'payload'
import { DEFAULT_POT_CODE } from '@/collections/ProductPots/constants'

const resetCollectionsOrder = [
  'product-variants',
  'product-item-attributes',
  'product-item-cares',
  'product-items',
  'product-variant-types',
  'product-ages',
  'product-sizes',
  'product-attributes',
  'product-categories',
  'product-groups',
  'product-pots',
  'articles',
  'article-authors',
  'media',
] as const

export async function resetSeedData(payload: Payload) {
  for (const collection of resetCollectionsOrder) {
    while (true) {
      const result = await payload.find({
        collection,
        depth: 0,
        limit: 100,
        pagination: false,
      })

      if (!result.docs.length) {
        break
      }

      for (const doc of result.docs) {
        if (
          collection === 'product-pots' &&
          'code' in doc &&
          typeof doc.code === 'string' &&
          doc.code === DEFAULT_POT_CODE
        ) {
          continue
        }

        await payload.delete({
          collection,
          id: doc.id,
        })
      }
    }
  }
}
