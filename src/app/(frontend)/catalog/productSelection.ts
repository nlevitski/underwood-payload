import type { DBProduct } from './dbProducts'

export type ProductSelection = {
  variantId: number
  potId: number
}

type SelectionParams = Pick<URLSearchParams, 'get' | 'has'>

function getVariantValue(variant: DBProduct['variants'][number]) {
  return 'value' in variant ? String(variant.value) : null
}

function getVariantAge(variant: DBProduct['variants'][number]) {
  return 'value' in variant ? `${variant.value} ${variant.postfix}`.trim() : null
}

function firstSelection(product: DBProduct): ProductSelection | null {
  const variant = product.variants[0]
  const pot = variant?.pots[0]

  return variant && pot ? { variantId: variant.id, potId: pot.id } : null
}

export function resolveProductSelection(
  product: DBProduct,
  params: SelectionParams,
): ProductSelection | null {
  const fallback = firstSelection(product)
  if (!fallback) return null

  const size = params.get('size')
  const age = params.get('age')
  const potCode = params.get('pot')

  if (!size && !age && !potCode) return fallback
  if (
    (size && age) ||
    (product.valueType === 'size' && age) ||
    (product.valueType === 'age' && size)
  ) {
    return fallback
  }
  if (product.valueType === 'none' && (size || age)) return fallback

  const matchingVariants = product.variants.filter((variant) => {
    if (product.valueType === 'size' && size) return getVariantValue(variant) === size
    if (product.valueType === 'age' && age) return getVariantAge(variant) === age
    return true
  })

  for (const variant of matchingVariants) {
    const pot = potCode
      ? variant.pots.find((entry) => entry.name.toUpperCase() === potCode.toUpperCase())
      : variant.pots[0]

    if (pot) return { variantId: variant.id, potId: pot.id }
  }

  return fallback
}

export function productSelectionParams(
  product: DBProduct,
  selection: ProductSelection,
  existing?: URLSearchParams,
) {
  const params = new URLSearchParams(existing)
  params.delete('size')
  params.delete('age')
  params.delete('pot')

  const variant = product.variants.find((entry) => entry.id === selection.variantId)
  const pot = variant?.pots.find((entry) => entry.id === selection.potId)
  if (!variant || !pot) return params

  if (product.valueType === 'size') {
    const value = getVariantValue(variant)
    if (value) params.set('size', value)
  } else if (product.valueType === 'age') {
    const value = getVariantAge(variant)
    if (value) params.set('age', value)
  }

  params.set('pot', pot.name)
  return params
}

export function productSelectionHref(product: DBProduct, selection: ProductSelection) {
  const query = productSelectionParams(product, selection).toString()
  const path = `/catalog/${encodeURIComponent(product.slug)}`
  return query ? `${path}?${query}` : path
}
