import type { Payload } from 'payload'
import { productCatalog } from './product-catalog.data'

const transliterationMap: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
}

function toAsciiSlug(value: string): string {
  const normalized = value
    .toLowerCase()
    .split('')
    .map((char) => transliterationMap[char] ?? char)
    .join('')

  return normalized
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function buildSlug(value: string, fallback: string): string {
  const asciiSlug = toAsciiSlug(value)
  if (asciiSlug) {
    return asciiSlug
  }

  return fallback
}

export async function seedProductItems(payload: Payload) {
  const [{ docs: groups }, { docs: categories }] = await Promise.all([
    payload.find({
      collection: 'product-groups',
      depth: 0,
      limit: 0,
      pagination: false,
    }),
    payload.find({
      collection: 'product-categories',
      depth: 0,
      limit: 0,
      pagination: false,
    }),
  ])

  const groupNameById = new Map<number, string>()
  for (const group of groups) {
    if (typeof group.id === 'number') {
      groupNameById.set(group.id, group.name)
    }
  }

  const categoryIdByKey = new Map<string, number>()
  for (const category of categories) {
    const groupId = typeof category.group === 'number' ? category.group : null
    if (!groupId || typeof category.id !== 'number') {
      continue
    }

    const groupName = groupNameById.get(groupId)
    if (!groupName) {
      continue
    }

    categoryIdByKey.set(`${groupName}::${category.name}`, category.id)
  }

  const slugCounts = new Map<string, number>()

  for (const catalogCategory of productCatalog) {
    const categoryId = categoryIdByKey.get(`${catalogCategory.group}::${catalogCategory.category}`)
    if (!categoryId) {
      continue
    }

    for (const [index, item] of catalogCategory.items.entries()) {
      const itemSlug = buildSlug(item.name, `item-${index + 1}`)
      const baseSlug = `${catalogCategory.group}-${catalogCategory.categorySlug}-${itemSlug}`
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')

      const nextCount = (slugCounts.get(baseSlug) ?? 0) + 1
      slugCounts.set(baseSlug, nextCount)
      const uniqueSlug = nextCount > 1 ? `${baseSlug}-${nextCount}` : baseSlug

      await payload.create({
        collection: 'product-items',
        data: {
          category: categoryId,
          name: item.name,
          slug: uniqueSlug,
        },
      })
    }
  }
}
