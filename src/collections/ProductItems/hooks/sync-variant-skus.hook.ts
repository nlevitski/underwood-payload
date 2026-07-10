import type { CollectionAfterChangeHook } from 'payload'

export const syncVariantSkusOnItemSlugChangeHook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  if (operation !== 'update' || typeof doc?.id !== 'number' || doc.slug === previousDoc?.slug) {
    return doc
  }

  await req.payload.update({
    collection: 'product-variants',
    where: {
      item: {
        equals: doc.id,
      },
    },
    data: {
      item: doc.id,
    },
    depth: 0,
    req,
  })

  return doc
}
