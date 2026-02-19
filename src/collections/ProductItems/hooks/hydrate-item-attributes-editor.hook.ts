import type { CollectionAfterReadHook } from 'payload'
import { resolveRelationId } from '@/hooks/resolve-relation-id'

export const hydrateItemAttributesEditorHook: CollectionAfterReadHook = async ({ doc, req }) => {
  if (typeof doc?.id !== 'number') {
    return doc
  }

  const result = await req.payload.find({
    collection: 'product-item-attributes',
    where: {
      item: {
        equals: doc.id,
      },
    },
    depth: 0,
    limit: 0,
    pagination: false,
    req,
  })

  const rows = result.docs
    .map((attributeDoc) => {
      const attributeId = resolveRelationId(attributeDoc.attribute)
      if (!attributeId) {
        return null
      }

      return {
        attribute: attributeId,
        label: attributeDoc.label,
        value: attributeDoc.value,
      }
    })
    .filter(Boolean)

  return {
    ...doc,
    itemAttributes: rows,
  }
}
