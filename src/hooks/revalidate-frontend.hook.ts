import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

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

export const createGlobalRevalidator =
  (paths: string[]): GlobalAfterChangeHook =>
  ({ doc }) => {
    invalidatePaths([...paths, '/sitemap.xml'])
    return doc
  }
