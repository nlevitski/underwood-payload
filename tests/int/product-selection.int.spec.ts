import { describe, expect, it } from 'vitest'

import type { DBProduct } from '@/app/(frontend)/catalog/dbProducts'
import {
  productSelectionHref,
  productSelectionParams,
  resolveProductSelection,
} from '@/app/(frontend)/catalog/productSelection'

const sizeProduct = {
  slug: 'thuja-smaragd',
  valueType: 'size',
  variants: [
    { id: 1, value: '25-40', postfix: 'см', pots: [{ id: 11, name: 'P9' }] },
    {
      id: 2,
      value: '50-60',
      postfix: 'см',
      pots: [
        { id: 21, name: 'C2' },
        { id: 22, name: 'C5' },
      ],
    },
  ],
} as DBProduct

const ageProduct = {
  slug: 'blueberry',
  valueType: 'age',
  variants: [
    { id: 1, value: '1', postfix: 'год', pots: [{ id: 31, name: 'C1' }] },
    { id: 2, value: '2', postfix: 'года', pots: [{ id: 32, name: 'C2' }] },
  ],
} as DBProduct

const potOnlyProduct = {
  slug: 'raspberry',
  valueType: 'none',
  variants: [
    { id: 1, pots: [{ id: 41, name: 'P9' }] },
    { id: 2, pots: [{ id: 42, name: 'C2' }] },
  ],
} as DBProduct

describe('product selection URL', () => {
  it('selects the exact size and pot from a direct link', () => {
    const params = new URLSearchParams('size=50-60&pot=C5')
    expect(resolveProductSelection(sizeProduct, params)).toEqual({ variantId: 2, potId: 22 })
    expect(productSelectionHref(sizeProduct, { variantId: 2, potId: 22 })).toBe(
      '/catalog/thuja-smaragd?size=50-60&pot=C5',
    )
  })

  it('completes a valid partial selection and falls back for an invalid combination', () => {
    expect(resolveProductSelection(sizeProduct, new URLSearchParams('size=50-60'))).toEqual({
      variantId: 2,
      potId: 21,
    })
    expect(resolveProductSelection(sizeProduct, new URLSearchParams('size=50-60&pot=P9'))).toEqual({
      variantId: 1,
      potId: 11,
    })
    expect(resolveProductSelection(sizeProduct, new URLSearchParams())).toEqual({
      variantId: 1,
      potId: 11,
    })
  })

  it('uses readable age and pot parameters, including Cyrillic values', () => {
    const href = productSelectionHref(ageProduct, { variantId: 2, potId: 32 })
    expect(href).toBe('/catalog/blueberry?age=2+%D0%B3%D0%BE%D0%B4%D0%B0&pot=C2')
    expect(
      resolveProductSelection(ageProduct, new URL(href, 'https://underwood.by').searchParams),
    ).toEqual({
      variantId: 2,
      potId: 32,
    })
  })

  it('selects a pot without an age or size and preserves unrelated parameters', () => {
    expect(resolveProductSelection(potOnlyProduct, new URLSearchParams('pot=C2'))).toEqual({
      variantId: 2,
      potId: 42,
    })
    expect(productSelectionHref(potOnlyProduct, { variantId: 2, potId: 42 })).toBe(
      '/catalog/raspberry?pot=C2',
    )
    expect(
      productSelectionParams(
        sizeProduct,
        { variantId: 2, potId: 21 },
        new URLSearchParams('utm_source=x&age=bad'),
      ).toString(),
    ).toBe('utm_source=x&size=50-60&pot=C2')
  })
})
