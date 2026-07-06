import type { Payload } from 'payload'
import { productCatalog, type CatalogItemAttributes } from './product-catalog.data'

type CatalogCategorySlug = (typeof productCatalog)[number]['categorySlug']
type CatalogCategory = (typeof productCatalog)[number]
type CatalogItem = CatalogCategory['items'][number]

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

const typeByCategorySlug: Partial<Record<CatalogCategorySlug, string>> = {
  thuja: 'Хвойный вечнозелёный кустарник / дерево',
  juniper: 'Хвойный вечнозелёный кустарник',
  pine: 'Хвойное вечнозелёное дерево / кустарниковая форма',
  spruce: 'Хвойное вечнозелёное дерево',
  fir: 'Хвойное вечнозелёное дерево',
  cypress: 'Хвойный вечнозелёный кустарник / дерево',
  blueberry: 'Ягодный листопадный кустарник',
  raspberry: 'Ягодный полукустарник',
  blackberry: 'Ягодный полукустарник',
  currant: 'Ягодный листопадный кустарник',
  gooseberry: 'Ягодный листопадный кустарник',
  lingonberry: 'Ягодный вечнозелёный кустарничек',
  cranberry: 'Ягодный вечнозелёный кустарничек',
  dogwood: 'Декоративный листопадный кустарник',
  ninebark: 'Декоративный листопадный кустарник',
  sage: 'Декоративный травянистый многолетник',
  lavander: 'Декоративный ароматный многолетник',
}

const colorByCategorySlug: Partial<Record<CatalogCategorySlug, string>> = {
  blueberry: 'Синяя / тёмно-синяя',
  blackberry: 'Чёрная',
  lingonberry: 'Красная',
  cranberry: 'Тёмно-красная',
}

const growthFormByCategorySlug: Partial<Record<CatalogCategorySlug, string>> = {
  raspberry: 'Кустовая форма с прямостоячими побегами',
  currant: 'Кустовая форма',
  sage: 'Кустистая куртина',
  lavander: 'Компактный полукустарник',
}

const colorByItemKey: Record<string, string> = {
  'thuja::Brabant': 'Ярко-зелёная',
  'thuja::Woodwardii': 'Зелёная',
  'thuja::Globosa': 'Зелёная',
  'thuja::Golden Brabant': 'Золотистая',
  'thuja::Golden Smaragd': 'Золотистая',
  'thuja::Danica': 'Зелёная',
  'thuja::Zebrina': 'Зелёная с золотистыми полосами',
  'thuja::Columna': 'Зелёная',
  'thuja::Kornik': 'Зелёная',
  'thuja::Miriam': 'Золотисто-зелёная',
  'thuja::Rheingold': 'Золотистая',
  'thuja::Smaragd': 'Насыщенно-зелёная',
  'thuja::Tiny Tim': 'Зелёная',
  'thuja::Hoseri': 'Зелёная',
  'thuja::Ericoides': 'Мягко-зелёная',
  'juniper::Blue Carpet': 'Серебристо-голубая',
  'juniper::Blue Star': 'Серебристо-голубая',
  'juniper::Blue Chip': 'Голубовато-серая',
  'juniper::Blue Arrow': 'Голубоватая',
  'juniper::Wiltonii': 'Голубовато-зелёная',
  'juniper::Glacier': 'Серебристо-голубая',
  'juniper::Golden Carpet': 'Золотистая',
  'juniper::Green Carpet': 'Зелёная',
  'juniper::Cossack Juniper': 'Зелёная',
  'juniper::Lime Glow': 'Лимонно-зелёная',
  'juniper::Old Gold': 'Золотисто-бронзовая',
  'juniper::Prince of Wales': 'Зелёная',
  'juniper::Stricta': 'Голубовато-зелёная',
  'juniper::Holger': 'Голубовато-зелёная с золотистым приростом',
  'pine::Winter Gold': 'Зелёная летом, золотистая зимой',
  'pine::Green Tower': 'Зелёная',
  'pine::Maria Brigon': 'Зелёная',
  'pine::Moseri': 'Зелёная',
  'pine::Mugus': 'Зелёная',
  'pine::Pumilio': 'Тёмно-зелёная',
  'pine::Uncinata': 'Тёмно-зелёная',
  'pine::Black Pine': 'Тёмно-зелёная',
  'spruce::Glauca Globosa': 'Серебристо-голубая',
  'spruce::Kaibab': 'Серебристо-синяя',
  'spruce::Conica (Canadian)': 'Зелёная',
  'spruce::Majestic Blue': 'Синевато-серебристая',
  'spruce::Nidiformis': 'Зелёная',
  'fir::Icebreaker': 'Серебристая',
  'fir::Korean Fir': 'Тёмно-зелёная',
  'fir::Nordmann Fir': 'Тёмно-зелёная',
  'fir::Silberlocke': 'Синевато-зелёная с серебристо-белой нижней стороной',
  "cypress::Lawson's Yvonne": 'Жёлто-зелёная',
  'cypress::Plumosa Aurea': 'Золотистая',
  'cypress::Sun Gold': 'Золотистая',
  'cypress::Filifera Nana': 'Зелёная',
  'raspberry::Rubifol': 'Красная',
  'raspberry::Maravilla': 'Ярко-красная',
  'raspberry::18-183-1': 'Красная',
  'raspberry::Cascade Harvest': 'Красная',
  'raspberry::Sokolytsa': 'Красная',
  'raspberry::Cumberland': 'Чёрная',
  'gooseberry::Kseniya': 'Красная',
  'gooseberry::Pax': 'Красная',
  'gooseberry::Orpheus': 'Жёлто-зелёная',
  'sage::Woodland': 'Лилово-фиолетовая',
  'lavander::Lavander': 'Фиолетовая / серо-зелёная листва',
}

const notesByItemKey: Record<string, string> = {
  'juniper::Glacier': 'Компактная форма с холодным серебристо-голубым оттенком',
  'juniper::Holger': 'Золотистый молодой прирост на голубовато-зелёной хвое',
  'pine::Uncinata': 'Устойчивая горная сосна для природных композиций',
  'sage::Woodland': 'Долгоцветущий ароматный многолетник, привлекает опылителей',
  'lavander::Lavander': 'Ароматная культура для солнечных сухих участков и бордюров',
}

function getDefaultType(category: CatalogCategory): string | undefined {
  return typeByCategorySlug[category.categorySlug]
}

function getDefaultGrowthForm(category: CatalogCategory, item: CatalogItem): string | undefined {
  if (category.group === 'conifers' && isFilledValue(item.attributes.type)) {
    return toTextValue(item.attributes.type)
  }

  return growthFormByCategorySlug[category.categorySlug]
}

function getDefaultColor(category: CatalogCategory, item: CatalogItem): string | undefined {
  return (
    colorByItemKey[`${category.categorySlug}::${item.name}`] ??
    colorByCategorySlug[category.categorySlug]
  )
}

function getDefaultNotes(category: CatalogCategory, item: CatalogItem): string | undefined {
  return notesByItemKey[`${category.categorySlug}::${item.name}`]
}

function toRipeningTime(
  value: string | number | boolean,
): ProductItemAttributeData['ripeningTime'] {
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

export function buildItemAttributeData(
  itemId: number,
  category: CatalogCategory,
  item: CatalogItem,
  attributes: CatalogItemAttributes,
): ProductItemAttributeData {
  const data: ProductItemAttributeData = {
    item: itemId,
  }

  const defaultType = getDefaultType(category)
  const defaultGrowthForm = getDefaultGrowthForm(category, item)
  const defaultColor = getDefaultColor(category, item)
  const defaultNotes = getDefaultNotes(category, item)

  if (category.group === 'conifers' && isFilledValue(defaultType)) {
    data.type = defaultType
  } else if (isFilledValue(attributes.type)) {
    data.type = toTextValue(attributes.type)
  } else if (isFilledValue(defaultType)) {
    data.type = defaultType
  }

  if (isFilledValue(attributes.description)) {
    data.description = toTextValue(attributes.description)
  }

  if (isFilledValue(attributes.notes)) {
    data.notes = toTextValue(attributes.notes)
  } else if (isFilledValue(attributes.features)) {
    data.notes = toTextValue(attributes.features)
  } else if (isFilledValue(defaultNotes)) {
    data.notes = defaultNotes
  }

  if (isFilledValue(attributes.ripeningTime)) {
    data.ripeningTime = toRipeningTime(attributes.ripeningTime)
  }

  if (isFilledValue(attributes.growthForm)) {
    data.growthForm = toTextValue(attributes.growthForm)
  } else if (isFilledValue(defaultGrowthForm)) {
    data.growthForm = defaultGrowthForm
  }

  if (isFilledValue(attributes.color)) {
    data.color = toTextValue(attributes.color)
  } else if (isFilledValue(defaultColor)) {
    data.color = defaultColor
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
          data: buildItemAttributeData(itemId, catalogCategory, item, item.attributes),
        }),
      )
    }
  }

  await Promise.all(createOperations)
}
