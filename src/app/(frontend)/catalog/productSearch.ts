export function normalizeProductSearch(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase('ru').replace(/ё/g, 'е').trim()
}

export function matchesProductSearch(name: string, query: string) {
  const normalizedName = normalizeProductSearch(name)
  const words = normalizeProductSearch(query).split(/\s+/).filter(Boolean)

  return words.every((word) => normalizedName.includes(word))
}
