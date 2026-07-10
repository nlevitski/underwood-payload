import type { Payload } from 'payload'

import type { DBProduct } from '@/app/(frontend)/catalog/dbProducts'
import { getDbProducts } from '@/app/(frontend)/catalog/dbProducts'
import { resolveRelationId } from '@/hooks/resolve-relation-id'

export type HomepagePopularPlantViewModel = DBProduct & {
  initialVariantId: number
  initialPotId: number
}

export async function getHomepagePopularPlants(
  payload: Payload,
): Promise<HomepagePopularPlantViewModel[]> {
  const { docs } = await payload.find({
    collection: 'homepage-popular-plants',
    depth: 0,
    limit: 100,
    pagination: false,
    sort: 'sortOrder',
  })

  const selections = docs.flatMap(({ product, defaultVariant }) => {
    const productId = resolveRelationId(product)
    const defaultVariantId = resolveRelationId(defaultVariant)

    return productId && defaultVariantId ? [{ productId, defaultVariantId }] : []
  })

  if (selections.length === 0) {
    return []
  }

  const products = await getDbProducts(payload, {
    itemIds: selections.map(({ productId }) => productId),
  })
  const productsByItemId = new Map(products.map((product) => [product.itemId, product]))

  return selections.flatMap(({ productId, defaultVariantId }) => {
    const product = productsByItemId.get(productId)
    const initialVariant = product?.variants.find((variant) =>
      variant.pots.some((pot) => pot.id === defaultVariantId),
    )

    if (!product || !initialVariant) {
      return []
    }

    return [
      {
        ...product,
        initialVariantId: initialVariant.id,
        initialPotId: defaultVariantId,
      },
    ]
  })
}
