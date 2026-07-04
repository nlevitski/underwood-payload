import type { CollectionAfterChangeHook, CollectionBeforeDeleteHook } from 'payload'
import { resolveRelationId } from '@/hooks/resolve-relation-id'

async function syncProductItemAttributeLink(
  req: Parameters<CollectionAfterChangeHook>[0]['req'],
  itemId: number,
  attributeId: number | null,
) {
  await req.payload.update({
    collection: 'product-items',
    id: itemId,
    data: {
      attributes: attributeId,
    },
    req,
  })
}

export const syncItemAttributeLinkHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  const attributeId = typeof doc?.id === 'number' ? doc.id : null
  const currentItemId = resolveRelationId(doc?.item)
  const previousItemId = operation === 'update' ? resolveRelationId(previousDoc?.item) : null

  if (!attributeId || !currentItemId) {
    return doc
  }

  if (previousItemId && previousItemId !== currentItemId) {
    await syncProductItemAttributeLink(req, previousItemId, null)
  }

  await syncProductItemAttributeLink(req, currentItemId, attributeId)

  return doc
}

export const clearItemAttributeLinkHook: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const attribute = await req.payload.findByID({
    collection: 'product-item-attributes',
    id,
    depth: 0,
    req,
  })

  const attributeId = typeof attribute?.id === 'number' ? attribute.id : null
  const itemId = resolveRelationId(attribute?.item)

  if (!attributeId || !itemId) {
    return
  }

  await req.payload.update({
    collection: 'product-items',
    id: itemId,
    data: {
      attributes: null,
    },
    req,
  })
}
