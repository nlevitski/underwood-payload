import type { Payload } from 'payload'
import { productCatalog, type CatalogItemAttributes } from './product-catalog.data'

type ProductItemAttributeData = {
  item: number
  type?: string
  notes?: string
  description?: string
  ripeningTime?: 'early' | 'earlyMid' | 'midSeason' | 'midLate' | 'late'
  growthForm?: string
  color?: string
}

function isFilledValue(value: unknown): value is string | number | boolean {
  return value !== '' && value !== '—' && value !== null && value !== undefined
}

function toTextValue(value: string | number | boolean): string {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return value ? 'true' : 'false'
}

function toRipeningTime(value: string | number | boolean): ProductItemAttributeData['ripeningTime'] {
  const textValue = toTextValue(value).toLowerCase()

  if (textValue.includes('ранний') && textValue.includes('средний')) {
    return 'earlyMid'
  }

  if (
    (textValue.includes('средний') || textValue.includes('средне')) &&
    textValue.includes('поздний')
  ) {
    return 'midLate'
  }

  if (textValue.includes('ранний')) {
    return 'early'
  }

  if (textValue.includes('средний') || textValue.includes('средне')) {
    return 'midSeason'
  }

  if (textValue.includes('поздний')) {
    return 'late'
  }

  return undefined
}

function buildItemAttributeData(
  itemId: number,
  attributes: CatalogItemAttributes,
): ProductItemAttributeData {
  const data: ProductItemAttributeData = {
    item: itemId,
  }

  if (isFilledValue(attributes.type)) {
    data.type = toTextValue(attributes.type)
  }

  if (isFilledValue(attributes.description)) {
    data.description = toTextValue(attributes.description)
  }

  if (isFilledValue(attributes.notes)) {
    data.notes = toTextValue(attributes.notes)
  } else if (isFilledValue(attributes.features)) {
    data.notes = toTextValue(attributes.features)
  }

  if (isFilledValue(attributes.ripeningTime)) {
    data.ripeningTime = toRipeningTime(attributes.ripeningTime)
  }

  if (isFilledValue(attributes.growthForm)) {
    data.growthForm = toTextValue(attributes.growthForm)
  }

  if (isFilledValue(attributes.color)) {
    data.color = toTextValue(attributes.color)
  }

  return data
}

export async function seedProductItemAttributes(payload: Payload) {
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
      const itemId = itemIdByKey.get(`${categoryId}::${item.name}`)
      if (!itemId) {
        continue
      }

      createOperations.push(
        payload.create({
          collection: 'product-item-attributes',
          data: buildItemAttributeData(itemId, item.attributes),
        }),
      )
    }
  }

  await Promise.all(createOperations)
}
