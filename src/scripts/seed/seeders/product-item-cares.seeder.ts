import type { Payload } from 'payload'
import { productCatalog, type CatalogItemCare } from './product-catalog.data'

type ProductItemCareData = {
  item: number
  watering?: string
  light?: string
  temperature?: string
  size?: string
}

function buildItemCareData(itemId: number, cares: CatalogItemCare[]): ProductItemCareData {
  const data: ProductItemCareData = {
    item: itemId,
  }

  for (const care of cares) {
    data[care.type] = care.description
  }

  return data
}

export async function seedProductItemCares(payload: Payload) {
  const [{ docs: groups }, { docs: categories }, { docs: items }] = await Promise.all([
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

    if (typeof category.nameRu === 'string') {
      categoryIdByKey.set(`${groupName}::${category.nameRu}`, category.id)
    }

    if (typeof category.name === 'string') {
      categoryIdByKey.set(`${groupName}::${category.name}`, category.id)
    }
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

  const createOperations: Promise<unknown>[] = []

  for (const catalogCategory of productCatalog) {
    const categoryId =
      categoryIdByKey.get(`${catalogCategory.group}::${catalogCategory.category}`) ??
      categoryIdByKey.get(`${catalogCategory.group}::${catalogCategory.categorySlug}`)
    if (!categoryId) {
      continue
    }

    for (const item of catalogCategory.items) {
      if (!item.cares?.length) {
        continue
      }

      const itemId = itemIdByKey.get(`${categoryId}::${item.name}`)
      if (!itemId) {
        throw new Error(
          `Product item not found for care seed: ${catalogCategory.category}/${item.name}`,
        )
      }

      createOperations.push(
        payload.create({
          collection: 'product-item-cares',
          data: buildItemCareData(itemId, item.cares),
        }),
      )
    }
  }

  await Promise.all(createOperations)
}
