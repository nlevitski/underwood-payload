import type { CollectionAfterChangeHook } from 'payload'
import { resolveRelationId } from '@/hooks/resolve-relation-id'

type EditorRow = {
  attribute?: unknown
  label?: string
  value?: string
}

export const syncItemAttributesEditorHook: CollectionAfterChangeHook = async ({ doc, req, previousDoc }) => {
  if (typeof doc?.id !== 'number') {
    return doc
  }

  const editorRowsRaw =
    (doc as { itemAttributes?: unknown }).itemAttributes ??
    (previousDoc as { itemAttributes?: unknown } | undefined)?.itemAttributes

  if (!Array.isArray(editorRowsRaw)) {
    return doc
  }

  await req.payload.delete({
    collection: 'product-item-attributes',
    where: {
      item: {
        equals: doc.id,
      },
    },
    req,
  })

  for (const rawRow of editorRowsRaw) {
    const row = rawRow as EditorRow
    const attributeId = resolveRelationId(row.attribute)
    const value = row.value?.trim()
    if (!attributeId || !value) {
      continue
    }

    const label = row.label?.trim() || value

    await req.payload.create({
      collection: 'product-item-attributes',
      data: {
        item: doc.id,
        attribute: attributeId,
        label,
        value,
      },
      req,
    })
  }

  return doc
}
