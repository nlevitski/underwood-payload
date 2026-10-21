import type { DBProduct } from '../catalog/dbProducts'
import { matchesProductSearch } from '../catalog/productSearch'
import { productSelectionHref } from '../catalog/productSelection'

export const MAX_SEARCH_LENGTH = 200
export type SearchOffer = {
  id: number
  value: string
  pot: string
  price: number
  inStock: boolean
  href: string
  image: string
}
export type SearchGroup = {
  itemId: number
  name: string
  valueType: DBProduct['valueType']
  offers: SearchOffer[]
  primary: SearchOffer
}
export type SearchResults = { groups: SearchGroup[]; plants: number; offers: number }

export function prepareSearchResults(
  products: DBProduct[],
  query: string,
  limit = 4,
): SearchResults {
  if (!query.trim()) return { groups: [], plants: 0, offers: 0 }
  const groups = products
    .filter((product) => matchesProductSearch(product.name, query))
    .flatMap((product): SearchGroup[] => {
      // Keep the adapter's natural order and the actual parent of every pot.
      const offers = product.variants.flatMap((variant) =>
        variant.pots.map((pot) => ({
          id: pot.id,
          value: 'value' in variant ? `${variant.value} ${variant.postfix}`.trim() : '',
          pot: pot.name,
          price: pot.price,
          inStock: pot.inStock,
          href: productSelectionHref(product, { variantId: variant.id, potId: pot.id }),
          image: pot.images[0]?.sizes?.xs?.url ?? pot.images[0]?.url ?? product.image,
        })),
      )
      const available = offers.filter((offer) => offer.inStock)
      const primary = [...(available.length ? available : offers)].sort(
        (a, b) => a.price - b.price || a.id - b.id,
      )[0]
      return primary
        ? [
            {
              itemId: product.itemId,
              name: product.name,
              valueType: product.valueType,
              offers,
              primary,
            },
          ]
        : []
    })
    .sort(
      (a, b) =>
        a.primary.price - b.primary.price ||
        a.name.localeCompare(b.name, 'ru') ||
        a.itemId - b.itemId,
    )
  return {
    groups: groups.slice(0, limit),
    plants: groups.length,
    offers: groups.reduce((total, group) => total + group.offers.length, 0),
  }
}

export function plural(count: number, forms: readonly [string, string, string]) {
  const last = count % 10
  const teen = count % 100
  return teen >= 11 && teen <= 14
    ? forms[2]
    : last === 1
      ? forms[0]
      : last >= 2 && last <= 4
        ? forms[1]
        : forms[2]
}
export function plantCount(count: number) {
  return `${count} ${plural(count, ['растение', 'растения', 'растений'])}`
}
export function offerCount(count: number) {
  return `${count} ${plural(count, ['вариант', 'варианта', 'вариантов'])}`
}
export function catalogSearchHref(pathname: string, search: string, query: string) {
  const params = new URLSearchParams(pathname === '/catalog' ? search : '')
  params.delete('page')
  const trimmed = query.trim()
  if (trimmed) params.set('q', trimmed)
  else params.delete('q')
  return `/catalog${params.size ? `?${params}` : ''}`
}
export function hasCatalogFilters(pathname: string, search: string) {
  const params = new URLSearchParams(search)
  return (
    pathname === '/catalog' &&
    ['category', 'pot', 'priceMin', 'priceMax', 'stock'].some((key) => params.has(key))
  )
}
