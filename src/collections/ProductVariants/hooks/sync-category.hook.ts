import { APIError, type CollectionBeforeValidateHook } from 'payload'
import { resolveRelationId } from '@/hooks/resolve-relation-id'

export const syncCategoryHook: CollectionBeforeValidateHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  const categoryId =
    resolveRelationId(data?.category) ??
    (operation === 'update' ? resolveRelationId(originalDoc?.category) : null)
  const itemId =
    resolveRelationId(data?.item) ?? (operation === 'update' ? resolveRelationId(originalDoc?.item) : null)

  if (!itemId) {
    return data
  }

  const item = await req.payload.findByID({
    collection: 'product-items',
    id: itemId,
    depth: 0,
    req,
  })

  const itemCategoryId = resolveRelationId(item?.category)
  if (!itemCategoryId) {
    throw new APIError('Cannot determine category for selected item', 400)
  }

  if (categoryId && categoryId !== itemCategoryId) {
    throw new APIError('Selected item does not belong to selected category', 400)
  }

  return {
    ...data,
    category: itemCategoryId,
  }
}
