import type { CollectionAfterReadHook, CollectionBeforeValidateHook } from 'payload'
import { resolveRelationId } from '@/hooks/resolve-relation-id'

type HookReq = Parameters<CollectionAfterReadHook>[0]['req']

async function resolveItemAttributeDisplayName(
  req: HookReq,
  itemId: number,
) {
  const item = await req.payload.findByID({
    collection: 'product-items',
    id: itemId,
    depth: 0,
    req,
  })

  return (
    (typeof item?.nameRu === 'string' && item.nameRu.trim().length > 0 && item.nameRu) ||
    (typeof item?.name === 'string' && item.name) ||
    `Item #${itemId}`
  )
}

export const populateItemAttributeDisplayNameHook: CollectionBeforeValidateHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  const itemId =
    resolveRelationId(data?.item) ?? (operation === 'update' ? resolveRelationId(originalDoc?.item) : null)
  if (!itemId) {
    return data
  }

  return {
    ...data,
    displayName: await resolveItemAttributeDisplayName(req, itemId),
  }
}

export const hydrateItemAttributeDisplayNameHook: CollectionAfterReadHook = async ({ doc, req }) => {
  const itemId = resolveRelationId(doc?.item)
  if (!itemId) {
    return doc
  }

  return {
    ...doc,
    displayName: await resolveItemAttributeDisplayName(req, itemId),
  }
}
