import { APIError, type CollectionBeforeValidateHook } from 'payload'
import { resolveRelationId } from '@/hooks/resolve-relation-id'

type VariantType = 'none' | 'size' | 'age'

function resolveVariantType(data: Record<string, unknown> | undefined, originalDoc: Record<string, unknown> | undefined, operation: 'create' | 'update'): VariantType {
  const value = data?.variantType ?? (operation === 'update' ? originalDoc?.variantType : undefined)

  if (value === 'size' || value === 'age') {
    return value
  }

  return 'none'
}

export const generateSkuHook: CollectionBeforeValidateHook = async ({ data, operation, originalDoc, req }) => {
  const itemId = resolveRelationId(data?.item) ?? (operation === 'update' ? resolveRelationId(originalDoc?.item) : null)
  const potId = resolveRelationId(data?.pot) ?? (operation === 'update' ? resolveRelationId(originalDoc?.pot) : null)
  const variantType = resolveVariantType(data as Record<string, unknown> | undefined, originalDoc as Record<string, unknown> | undefined, operation)
  const ageId = resolveRelationId(data?.age) ?? (operation === 'update' ? resolveRelationId(originalDoc?.age) : null)
  const sizeId = resolveRelationId(data?.size) ?? (operation === 'update' ? resolveRelationId(originalDoc?.size) : null)

  if (!itemId || !potId) {
    return data
  }

  const [item, pot] = await Promise.all([
    req.payload.findByID({
      collection: 'product-items',
      id: itemId,
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

  if (!item?.slug || !pot?.code) {
    throw new APIError('Cannot generate SKU: missing item slug or pot code', 400)
  }

  if (variantType === 'age') {
    if (!ageId) {
      throw new APIError('Cannot generate SKU: missing age', 400)
    }

    const age = await req.payload.findByID({
      collection: 'product-ages',
      id: ageId,
      depth: 0,
      req,
    })

    if (typeof age?.months !== 'number') {
      throw new APIError('Cannot generate SKU: missing age months', 400)
    }

    return {
      ...data,
      sku: `${item.slug}-${age.months}m-${pot.code}`,
    }
  }

  if (variantType === 'size') {
    if (!sizeId) {
      throw new APIError('Cannot generate SKU: missing size', 400)
    }

    const size = await req.payload.findByID({
      collection: 'product-sizes',
      id: sizeId,
      depth: 0,
      req,
    })

    if (!size || typeof size !== 'object' || !('label' in size) || typeof size.label !== 'string') {
      throw new APIError('Cannot generate SKU: missing size label', 400)
    }

    return {
      ...data,
      sku: `${item.slug}-${size.label}-${pot.code}`,
    }
  }

  return {
    ...data,
    sku: `${item.slug}-${pot.code}`,
  }
}
