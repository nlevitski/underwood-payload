import type { Payload } from 'payload'

type AttributeDataType = 'text' | 'number' | 'boolean'

type ProductAttribute = {
  label: string
  key: string
  dataType: AttributeDataType
}

type ProductAttributeCollection = {
  category: 'conifers' | 'berries' | 'foliage'
  name: string
  attributes: ProductAttribute[]
}

const coniferAttributes: ProductAttribute[] = [
  { label: 'Тип', key: 'type', dataType: 'text' },
  { label: 'Примечания', key: 'notes', dataType: 'text' },
]

const berryAttributes: ProductAttribute[] = [
  { label: 'Срок созревания', key: 'ripening_time', dataType: 'text' },
  { label: 'Рост и форма куста', key: 'growth_form', dataType: 'text' },
  { label: 'Особенности', key: 'features', dataType: 'text' },
  { label: 'Цвет', key: 'color', dataType: 'text' },
]

const foliageAttributes: ProductAttribute[] = [
  { label: 'Рост и форма', key: 'growth_form', dataType: 'text' },
  { label: 'Особенности', key: 'features', dataType: 'text' },
  { label: 'Цвет', key: 'color', dataType: 'text' },
]

const collections: ProductAttributeCollection[] = [
  { category: 'conifers', name: 'Туя', attributes: coniferAttributes },
  { category: 'conifers', name: 'Можжевельник', attributes: coniferAttributes },
  { category: 'conifers', name: 'Сосна', attributes: coniferAttributes },
  { category: 'conifers', name: 'Ель', attributes: coniferAttributes },
  { category: 'conifers', name: 'Пихта', attributes: coniferAttributes },
  { category: 'conifers', name: 'Кипарисовик', attributes: coniferAttributes },
  { category: 'berries', name: 'Голубика', attributes: berryAttributes },
  { category: 'berries', name: 'Малина', attributes: berryAttributes },
  { category: 'berries', name: 'Ежевика', attributes: berryAttributes },
  { category: 'berries', name: 'Смородина', attributes: berryAttributes },
  { category: 'berries', name: 'Крыжовник', attributes: berryAttributes },
  { category: 'berries', name: 'Брусника', attributes: berryAttributes },
  { category: 'berries', name: 'Клюква', attributes: berryAttributes },
  { category: 'foliage', name: 'Дёрен', attributes: foliageAttributes },
  { category: 'foliage', name: 'Пузыреплодник', attributes: foliageAttributes },
]

export async function seedProductAttributes(payload: Payload) {
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

  const createOperations = collections.flatMap((entry) => {
    const categoryId = categoryIdByKey.get(`${entry.category}::${entry.name}`)
    if (!categoryId) {
      return []
    }

    return entry.attributes.map((attribute) =>
      payload.create({
        collection: 'product-attributes',
        data: {
          category: categoryId,
          label: attribute.label,
          key: attribute.key,
          dataType: attribute.dataType,
        },
      }),
    )
  })

  await Promise.all(createOperations)
}
