import { describe, expect, it } from 'vitest'

import { matchesProductSearch } from '@/app/(frontend)/catalog/productSearch'

describe('catalog product search', () => {
  it('matches partial names regardless of case, whitespace, or word order', () => {
    expect(matchesProductSearch('Туя Смарагд', '  СМАР   туя ')).toBe(true)
    expect(matchesProductSearch('Туя Смарагд', 'смарагд')).toBe(true)
    expect(matchesProductSearch('Туя Смарагд', 'туя даника')).toBe(false)
  })

  it('treats е and ё equally and supports Latin cultivar names', () => {
    expect(matchesProductSearch('Берёза Youngii', 'береза young')).toBe(true)
    expect(matchesProductSearch('Береза', 'берёза')).toBe(true)
  })

  it('keeps every product for an empty query and treats punctuation literally', () => {
    expect(matchesProductSearch('Туя Смарагд', ' \t ')).toBe(true)
    expect(matchesProductSearch('Туя Смарагд', '.*')).toBe(false)
  })
})
