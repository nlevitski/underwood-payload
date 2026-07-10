import { comparePotCodes, getSizeLowerBound } from '@/app/(frontend)/catalog/productVariantSorting'
import { describe, expect, it } from 'vitest'

describe('product variant sorting', () => {
  it('orders P pots before C pots and sorts each family numerically', () => {
    const codes = ['C10', 'C2', 'P10', 'C1', 'P9', 'C3']

    expect(codes.sort(comparePotCodes)).toEqual(['P9', 'P10', 'C1', 'C2', 'C3', 'C10'])
  })

  it('orders sizes by the lower bound of the range', () => {
    const sizes = ['25-35', '80', '20-40', '25-30']

    expect(
      sizes.sort(
        (left, right) =>
          getSizeLowerBound(left) - getSizeLowerBound(right) ||
          left.localeCompare(right, 'ru', { numeric: true }),
      ),
    ).toEqual(['20-40', '25-30', '25-35', '80'])
  })
})
