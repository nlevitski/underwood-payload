import type { Payload } from 'payload'
import { productCatalog } from './product-catalog.data'

function toTextValue(value: string | number | boolean): string {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return value ? 'true' : 'false'
}

export async function seedProductItemAttributes(payload: Payload) {
  const [{ docs: groups }, { docs: categories }, { docs: items }, { docs: attributes }] = await Promise.all([
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
    payload.find({
      collection: 'product-items',
      depth: 0,
      limit: 0,
      pagination: false,
    }),
    payload.find({
      collection: 'product-attributes',
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

  const itemIdByKey = new Map<string, number>()
  for (const item of items) {
    if (typeof item.id !== 'number') {
      continue
    }

    const categoryId = typeof item.category === 'number' ? item.category : null
    if (!categoryId) {
      continue
    }

    itemIdByKey.set(`${categoryId}::${item.name}`, item.id)
  }

  const attributeByKey = new Map<string, { id: number; label: string }>()
  for (const attribute of attributes) {
    if (typeof attribute.id !== 'number') {
      continue
    }

    const categoryId = typeof attribute.category === 'number' ? attribute.category : null
    if (!categoryId) {
      continue
    }

    attributeByKey.set(`${categoryId}::${attribute.key}`, { id: attribute.id, label: attribute.label })
  }

  for (const catalogCategory of productCatalog) {
    const categoryId = categoryIdByKey.get(`${catalogCategory.group}::${catalogCategory.category}`)
    if (!categoryId) {
      continue
    }

    for (const item of catalogCategory.items) {
      const itemId = itemIdByKey.get(`${categoryId}::${item.name}`)
      if (!itemId) {
        continue
      }

      for (const [attributeKey, rawValue] of Object.entries(item.attributes)) {
        if (rawValue === '' || rawValue === '—') {
          continue
        }

        const attribute = attributeByKey.get(`${categoryId}::${attributeKey}`)
        if (!attribute) {
          continue
        }

        await payload.create({
          collection: 'product-item-attributes',
          data: {
            item: itemId,
            attribute: attribute.id,
            value: toTextValue(rawValue),
            label: toTextValue(rawValue),
          },
        })
      }
    }
  }
}
