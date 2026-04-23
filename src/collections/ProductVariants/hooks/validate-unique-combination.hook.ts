import { APIError, type CollectionBeforeChangeHook } from 'payload'
import { resolveRelationId } from '@/hooks/resolve-relation-id'

type VariantType = 'none' | 'size' | 'age'

function resolveVariantType(data: Record<string, unknown> | undefined, originalDoc: Record<string, unknown> | undefined, operation: 'create' | 'update'): VariantType {
  const value = data?.variantType ?? (operation === 'update' ? originalDoc?.variantType : undefined)

  if (value === 'size' || value === 'age') {
    return value
  }

  return 'none'
}

export const validateUniqueCombinationHook: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  const itemId = resolveRelationId(data?.item) ?? (operation === 'update' ? resolveRelationId(originalDoc?.item) : null)
  const potId = resolveRelationId(data?.pot) ?? (operation === 'update' ? resolveRelationId(originalDoc?.pot) : null)
  const variantType = resolveVariantType(data as Record<string, unknown> | undefined, originalDoc as Record<string, unknown> | undefined, operation)
  const ageId = resolveRelationId(data?.age) ?? (operation === 'update' ? resolveRelationId(originalDoc?.age) : null)
  const sizeId = resolveRelationId(data?.size) ?? (operation === 'update' ? resolveRelationId(originalDoc?.size) : null)

  if (!itemId || !potId) {
    return data
  }

  const andConditions: any[] = [
    { item: { equals: itemId } },
    { pot: { equals: potId } },
    { variantType: { equals: variantType } },
  ]

  if (variantType === 'age' && ageId) {
    andConditions.push({ age: { equals: ageId } })
  }

  if (variantType === 'size' && sizeId) {
    andConditions.push({ size: { equals: sizeId } })
  }

  const existing = await req.payload.find({
    collection: 'product-variants',
    where: {
      and: andConditions,
    },
    depth: 0,
    limit: 1,
    pagination: false,
    req,
  })

  const existingDoc = existing.docs[0]
  if (!existingDoc) {
    return data
  }

  const currentId = operation === 'update' && typeof originalDoc?.id === 'number' ? originalDoc.id : null
  if (currentId && existingDoc.id === currentId) {
    return data
  }

  throw new APIError('Variant with this item, age and pot already exists', 400)
}
