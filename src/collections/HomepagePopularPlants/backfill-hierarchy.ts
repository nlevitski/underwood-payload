import type { Payload } from 'payload'

import { resolveRelationId } from '@/hooks/resolve-relation-id'

export async function backfillHomepagePopularPlantHierarchy(payload: Payload) {
  const { docs } = await payload.find({
    collection: 'homepage-popular-plants',
    depth: 0,
    limit: 100,
    pagination: false,
  })

  for (const doc of docs) {
    if (resolveRelationId(doc.group) && resolveRelationId(doc.category)) {
      continue
    }

    const productId = resolveRelationId(doc.product)

    if (!productId) {
      continue
    }

    const product = await payload.findByID({
      collection: 'product-items',
      id: productId,
      depth: 0,
    })
    const categoryId = resolveRelationId(product.category)

    if (!categoryId) {
      continue
    }

    const category = await payload.findByID({
      collection: 'product-categories',
      id: categoryId,
      depth: 0,
    })
    const groupId = resolveRelationId(category.group)

    if (!groupId) {
      continue
    }

    await payload.update({
      collection: 'homepage-popular-plants',
      id: doc.id,
      data: {
        group: groupId,
        category: categoryId,
      },
    })
  }
}
