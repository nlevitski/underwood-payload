import { APIError } from 'payload'
import type { CollectionBeforeValidateHook } from 'payload'

import { resolveRelationId } from '@/hooks/resolve-relation-id'

export const validateCategoriesBelongToGroup: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  if (!data) {
    return data
  }

  const groupId = resolveRelationId(data.group ?? originalDoc?.group)
  const categoryRelations = data.categories ?? originalDoc?.categories ?? []
  const categoryIds = Array.isArray(categoryRelations)
    ? categoryRelations.map(resolveRelationId).filter((id): id is number => id !== null)
    : []

  if (!groupId || categoryIds.length === 0) {
    return data
  }

  const { docs } = await req.payload.find({
    collection: 'product-categories',
    depth: 0,
    limit: categoryIds.length,
    pagination: false,
    where: {
      and: [{ id: { in: categoryIds } }, { group: { equals: groupId } }],
    },
    req,
  })

  if (docs.length !== new Set(categoryIds).size) {
    throw new APIError('Все выбранные роды растений должны относиться к выбранной группе.', 400)
  }

  return data
}
