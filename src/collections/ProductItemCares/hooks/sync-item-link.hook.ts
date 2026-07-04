import type { CollectionAfterChangeHook, CollectionBeforeDeleteHook } from 'payload'
import { resolveRelationId } from '@/hooks/resolve-relation-id'

async function syncProductItemCareLink(
  req: Parameters<CollectionAfterChangeHook>[0]['req'],
  itemId: number,
  careId: number | null,
) {
  await req.payload.update({
    collection: 'product-items',
    id: itemId,
    data: {
      cares: careId,
    },
    req,
  })
}

export const syncItemCareLinkHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  const careId = typeof doc?.id === 'number' ? doc.id : null
  const currentItemId = resolveRelationId(doc?.item)
  const previousItemId = operation === 'update' ? resolveRelationId(previousDoc?.item) : null

  if (!careId || !currentItemId) {
    return doc
  }

  if (previousItemId && previousItemId !== currentItemId) {
    await syncProductItemCareLink(req, previousItemId, null)
  }

  await syncProductItemCareLink(req, currentItemId, careId)

  return doc
}

export const clearItemCareLinkHook: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const care = await req.payload.findByID({
    collection: 'product-item-cares',
    id,
    depth: 0,
    req,
  })

  const careId = typeof care?.id === 'number' ? care.id : null
  const itemId = resolveRelationId(care?.item)

  if (!careId || !itemId) {
    return
  }

  await req.payload.update({
    collection: 'product-items',
    id: itemId,
    data: {
      cares: null,
    },
    req,
  })
}
