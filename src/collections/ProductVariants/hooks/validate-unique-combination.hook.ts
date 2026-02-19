import { APIError, type CollectionBeforeChangeHook } from 'payload'
import { resolveRelationId } from '@/hooks/resolve-relation-id'

export const validateUniqueCombinationHook: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  const itemId = resolveRelationId(data?.item) ?? (operation === 'update' ? resolveRelationId(originalDoc?.item) : null)
  const ageId = resolveRelationId(data?.age) ?? (operation === 'update' ? resolveRelationId(originalDoc?.age) : null)
  const potId = resolveRelationId(data?.pot) ?? (operation === 'update' ? resolveRelationId(originalDoc?.pot) : null)

  if (!itemId || !ageId || !potId) {
    return data
  }

  const existing = await req.payload.find({
    collection: 'product-variants',
    where: {
      and: [{ item: { equals: itemId } }, { age: { equals: ageId } }, { pot: { equals: potId } }],
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
