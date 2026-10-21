import { describe, expect, it } from 'vitest'
import type { DBProduct } from '@/app/(frontend)/catalog/dbProducts'
import { resolveProductSelection } from '@/app/(frontend)/catalog/productSelection'
import {
  catalogSearchHref,
  offerCount,
  plantCount,
  prepareSearchResults,
} from '@/app/(frontend)/search/searchResults'

function product(overrides: Partial<DBProduct> = {}): DBProduct {
  return {
    itemId: 1,
    slug: 'test',
    name: 'Туя Ёлка',
    category: 'Хвойные',
    categoryKey: 'conifers',
    description: '',
    cares: [],
    image: '/fallback.png',
    updatedAt: '',
    valueType: 'size',
    variants: [
      {
        id: 1,
        value: '20-30',
        postfix: 'см',
        pots: [{ id: 101, name: 'P9', price: 5, inStock: false, images: [] }],
      },
      {
        id: 2,
        value: '40-60',
        postfix: 'см',
        pots: [{ id: 102, name: 'C2', price: 10, inStock: true, images: [] }],
      },
    ],
    ...overrides,
  }
}

describe('global plant search', () => {
  it('projects only real pairs, picks the available minimum and uses its photo', () => {
    const p = product()
    p.variants[1]!.pots[0]!.images = [
      { url: '/selected.png' },
    ] as DBProduct['variants'][number]['pots'][number]['images']
    const result = prepareSearchResults([p], '  ЕЛКА   туЯ ')
    expect(result.plants).toBe(1)
    expect(result.offers).toBe(2)
    const group = result.groups[0]!
    expect(group.primary).toMatchObject({
      id: 102,
      price: 10,
      value: '40-60 см',
      pot: 'C2',
      image: '/selected.png',
    })
    expect(group.offers.map((offer) => offer.href)).toEqual([
      '/catalog/test?size=20-30&pot=P9',
      '/catalog/test?size=40-60&pot=C2',
    ])
    for (const offer of group.offers) {
      expect(
        resolveProductSelection(p, new URL(offer.href, 'https://example.org').searchParams)?.potId,
      ).toBe(offer.id)
    }
  })
  it('keeps order stable, breaks price ties and counts all matches before preview truncation', () => {
    const products = Array.from({ length: 6 }, (_, index) =>
      product({ itemId: index + 1, name: `Туя ${index}`, slug: `tuya-${index}` }),
    )
    const result = prepareSearchResults(products.reverse(), 'туя')
    expect(result.groups.map((group) => group.itemId)).toEqual([1, 2, 3, 4])
    expect(result).toMatchObject({ plants: 6, offers: 12 })
  })
  it('keeps all on-order offers selectable and chooses their minimum', () => {
    const p = product()
    p.variants[1]!.pots[0]!.inStock = false
    const group = prepareSearchResults([p], 'туя').groups[0]!
    expect(group.primary).toMatchObject({ id: 101, inStock: false, image: '/fallback.png' })
    expect(group.offers).toHaveLength(2)
    expect(group.offers.every((offer) => Boolean(offer.href))).toBe(true)
  })
  it('round trips ages and pot-only offers without adding nonexistent parameters', () => {
    for (const valueType of ['age', 'none'] as const) {
      const p = product({
        valueType,
        variants: [
          {
            id: 9,
            ...(valueType === 'age' ? { value: '4', postfix: 'года' } : {}),
            pots: [{ id: 55, name: 'C3', price: 25, inStock: false, images: [] }],
          },
        ],
      })
      const offer = prepareSearchResults([p], 'туя').groups[0]!.primary
      const params = new URL(offer.href, 'https://example.org').searchParams
      expect(params.has('size')).toBe(false)
      expect(params.get('age')).toBe(valueType === 'age' ? '4 года' : null)
      expect(resolveProductSelection(p, params)).toEqual({ variantId: 9, potId: 55 })
    }
  })
  it('does not return the catalog for empty input and preserves literal matching', () => {
    expect(prepareSearchResults([product()], '  ').plants).toBe(0)
    expect(prepareSearchResults([product()], 'Туя.*').plants).toBe(0)
  })
  it('applies a trimmed draft preserving catalog filters and resets only pagination', () => {
    const search =
      '?category=conifers&pot=C2&priceMin=7&priceMax=40&stock=1&perPage=24&page=3&q=old'
    const href = catalogSearchHref('/catalog', search, '  голубика  ')
    const params = new URL(href, 'https://example.org').searchParams
    expect(params.get('q')).toBe('голубика')
    expect(params.has('page')).toBe(false)
    for (const key of ['category', 'pot', 'priceMin', 'priceMax', 'stock', 'perPage'])
      expect(params.get(key)).toBe(new URLSearchParams(search).get(key))
    expect(catalogSearchHref('/about', search, 'туя')).toBe('/catalog?q=%D1%82%D1%83%D1%8F')
    expect(catalogSearchHref('/catalog', '?category=berries&page=2&q=туя', '  ')).toBe(
      '/catalog?category=berries',
    )
  })
  it('uses Russian noun forms including teens and 21', () => {
    expect([1, 2, 5, 11, 21, 22, 25].map(plantCount)).toEqual([
      '1 растение',
      '2 растения',
      '5 растений',
      '11 растений',
      '21 растение',
      '22 растения',
      '25 растений',
    ])
    expect([1, 2, 5, 11, 21].map(offerCount)).toEqual([
      '1 вариант',
      '2 варианта',
      '5 вариантов',
      '11 вариантов',
      '21 вариант',
    ])
  })
})
