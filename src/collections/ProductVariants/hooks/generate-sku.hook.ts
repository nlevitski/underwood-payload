import { APIError, type CollectionBeforeValidateHook } from 'payload'
import { resolveRelationId } from '@/hooks/resolve-relation-id'

export const generateSkuHook: CollectionBeforeValidateHook = async ({ data, operation, originalDoc, req }) => {
  const itemId = resolveRelationId(data?.item) ?? (operation === 'update' ? resolveRelationId(originalDoc?.item) : null)
  const ageId = resolveRelationId(data?.age) ?? (operation === 'update' ? resolveRelationId(originalDoc?.age) : null)
  const potId = resolveRelationId(data?.pot) ?? (operation === 'update' ? resolveRelationId(originalDoc?.pot) : null)

  if (!itemId || !ageId || !potId) {
    return data
  }

  const [item, age, pot] = await Promise.all([
    req.payload.findByID({
      collection: 'product-items',
      id: itemId,
      depth: 0,
      req,
    }),
    req.payload.findByID({
      collection: 'product-ages',
      id: ageId,
      depth: 0,
      req,
    }),
    req.payload.findByID({
      collection: 'pots',
      id: potId,
      depth: 0,
      req,
    }),
  ])

  if (!item?.slug || typeof age?.months !== 'number' || !pot?.code) {
    throw new APIError('Cannot generate SKU: missing item slug, age months, or pot code', 400)
  }

  return {
    ...data,
    sku: `${item.slug}-${age.months}m-${pot.code}`,
  }
}
