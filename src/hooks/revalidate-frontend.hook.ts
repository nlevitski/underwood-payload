import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

import { resolveRelationId } from './resolve-relation-id'

function invalidatePaths(paths: string[]) {
  if (process.env.NEXT_PHASE === 'phase-production-build') return

  try {
    paths.forEach((path) => revalidatePath(path))
  } catch (error) {
    console.error('Unable to revalidate frontend routes:', error)
  }
}

export const revalidateArticle: CollectionAfterChangeHook = ({ doc }) => {
  invalidatePaths(['/blog', `/blog/${doc.slug}`, '/sitemap.xml'])
  return doc
}

export const revalidateProduct: CollectionAfterChangeHook = ({ doc }) => {
  invalidatePaths(['/catalog', `/catalog/${doc.slug}`, '/sitemap.xml'])
  return doc
}

async function invalidateVariantProductPaths(req: PayloadRequest, items: unknown[]) {
  const itemIds = [...new Set(items.map(resolveRelationId).filter((id): id is number => id !== null))]
  const slugs: string[] = []

  for (const id of itemIds) {
    try {
      const item = await req.payload.findByID({ collection: 'product-items', id, depth: 0, req })
      if (item.slug) slugs.push(item.slug)
    } catch (error) {
      console.error(`Unable to find product item ${id} for frontend revalidation:`, error)
    }
  }

  invalidatePaths(['/', '/catalog', ...slugs.map((slug) => `/catalog/${slug}`), '/sitemap.xml'])
}

export const revalidateProductVariant: CollectionAfterChangeHook = async ({
  doc,
  operation,
  previousDoc,
  req,
}) => {
  await invalidateVariantProductPaths(
    req,
    operation === 'update' ? [doc.item, previousDoc?.item] : [doc.item],
  )
  return doc
}

export const revalidateDeletedProductVariant: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await invalidateVariantProductPaths(req, [doc.item])
  return doc
}

export const createGlobalRevalidator =
  (paths: string[]): GlobalAfterChangeHook =>
  ({ doc }) => {
    invalidatePaths([...paths, '/sitemap.xml'])
    return doc
  }
