import type {
  Media,
  ProductAge as PayloadProductAge,
  ProductCategory as PayloadProductCategory,
  ProductGroup as PayloadProductGroup,
  ProductItem as PayloadProductItem,
  ProductItemAttribute,
  ProductItemCare,
  ProductPot as PayloadProductPot,
  ProductSize,
  ProductVariant as PayloadProductVariant,
} from '@/payload-types'
import type { Payload } from 'payload'

import type { Care, CategoryKey, Product, ProductAttributes } from './products'

type DBProductImageSize = {
  url: string
  width: number
  height: number
  mimeType: string
  filesize: number
  filename: string
}

type DBProductImage = Product['variants'][number]['pots'][number]['images'][number] & {
  sizes?: Partial<Record<'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl', DBProductImageSize>>
}

type DBProductPot = {
  id: number
  name: string
  price: number
  inStock: boolean
  images: DBProductImage[]
}

type DBProductVariantBase = {
  id: number
  pots: DBProductPot[]
}

type DBProductVariantWithValue = DBProductVariantBase & {
  value: string
  postfix: string
}

type DBProductVariant = DBProductVariantBase | DBProductVariantWithValue

export type DBProduct = Omit<Product, 'id' | 'image' | 'variants'> & {
  slug: string
  image: string
  variants: DBProductVariant[]
}

type GroupedProduct = {
  item: PayloadProductItem
  category: PayloadProductCategory
  categoryKey: CategoryKey
  variants: PayloadProductVariant[]
}

type Relation<T> = number | null | undefined | T

const placeholderImagesByCategoryKey: Record<CategoryKey, string> = {
  conifers: '/api/media/file/conifers-placeholder-960x960.webp',
  berries: '/api/media/file/berry-placeholder-960x960.webp',
  foliage: '/api/media/file/conifers-placeholder-960x960.webp',
  perennials: '/api/media/file/conifers-placeholder-960x960.webp',
}

const categoryLabelsByKey = {
  conifers: 'Хвойные',
  berries: 'Ягодные',
  foliage: 'Лиственные',
  perennials: 'Многолетние',
} as const satisfies Record<CategoryKey, Product['category']>

const sizeValues = ['25-40', '35-50', '50-60', '60-70', '70-80', '80', '80-90', '90-120'] as const
const categoryOrder = Object.keys(categoryLabelsByKey)
const sizeOrder = new Map(sizeValues.map((size, index) => [size, index]))
const ripeningTimeLabels = {
  early: 'Ранний',
  earlyMid: 'Ранний-средний',
  midSeason: 'Средний',
  midLate: 'Средний-поздний',
  late: 'Поздний',
} as const satisfies Record<NonNullable<ProductItemAttribute['ripeningTime']>, string>

function isObjectRelation<T extends { id: number }>(relation: Relation<T>): relation is T {
  return typeof relation === 'object' && relation !== null
}

function isCategoryKey(value: unknown): value is CategoryKey {
  return typeof value === 'string' && value in categoryLabelsByKey
}

function resolveCategoryKey(category: PayloadProductCategory): CategoryKey | null {
  if (!isObjectRelation<PayloadProductGroup>(category.group)) {
    return null
  }

  if (isCategoryKey(category.group.name)) {
    return category.group.name
  }

  if (isCategoryKey(category.group.slug)) {
    return category.group.slug
  }

  return null
}

function resolveProductName(item: PayloadProductItem, category: PayloadProductCategory) {
  const categoryName = category.nameRu.trim()
  const itemName = item.nameRu.trim()

  if (categoryName.toLocaleLowerCase('ru') === itemName.toLocaleLowerCase('ru')) {
    return itemName
  }

  return `${categoryName} ${itemName}`.trim()
}

function resolveProductImage(categoryKey: CategoryKey) {
  return placeholderImagesByCategoryKey[categoryKey]
}

function resolveAttributes(item: PayloadProductItem) {
  if (!isObjectRelation<ProductItemAttribute>(item.attributes)) {
    return null
  }

  return item.attributes
}

function resolveDescription(item: PayloadProductItem) {
  const attributes = resolveAttributes(item)

  return attributes?.description ?? attributes?.notes ?? attributes?.type ?? ''
}

function normalizeTextValue(value: string | null | undefined) {
  const normalized = value?.trim()

  return normalized ? normalized : null
}

function resolveProductAttributes(item: PayloadProductItem): ProductAttributes | null {
  const attributes = resolveAttributes(item)

  if (!attributes) {
    return null
  }

  const normalizedAttributes: ProductAttributes = {
    type: normalizeTextValue(attributes.type),
    notes: normalizeTextValue(attributes.notes),
    description: normalizeTextValue(attributes.description),
    ripeningTime: attributes.ripeningTime ? ripeningTimeLabels[attributes.ripeningTime] : null,
    growthForm: normalizeTextValue(attributes.growthForm),
    color: normalizeTextValue(attributes.color),
  }

  return Object.values(normalizedAttributes).some(Boolean) ? normalizedAttributes : null
}

function resolveCares(item: PayloadProductItem): Care[] {
  if (!isObjectRelation<ProductItemCare>(item.cares)) {
    return []
  }

  const cares = item.cares
  const fields = ['watering', 'light', 'soil', 'temperature', 'size'] as const

  return fields.flatMap((type) => {
    const description = cares[type]?.trim()

    if (!description) {
      return []
    }

    return [{ type, description }]
  })
}

function normalizeImageSize(size: NonNullable<Media['sizes']>[keyof NonNullable<Media['sizes']>]) {
  if (!size?.url) {
    return null
  }

  return {
    url: size.url,
    width: size.width ?? 0,
    height: size.height ?? 0,
    mimeType: size.mimeType ?? '',
    filesize: size.filesize ?? 0,
    filename: size.filename ?? '',
  }
}

function normalizeImageSizes(media: Media): DBProductImage['sizes'] {
  const normalizedSizes: DBProductImage['sizes'] = {}
  const imageSizes = ['xs', 's', 'm', 'l', 'xl', 'xxl'] as const

  imageSizes.forEach((sizeName) => {
    const size = normalizeImageSize(media.sizes?.[sizeName])

    if (size) {
      normalizedSizes[sizeName] = size
    }
  })

  return Object.keys(normalizedSizes).length > 0 ? normalizedSizes : undefined
}

function normalizeMediaImage(relation: Relation<Media>): DBProductImage[] {
  if (!isObjectRelation<Media>(relation)) {
    return []
  }

  const url =
    relation.url ??
    relation.sizes?.l?.url ??
    relation.sizes?.m?.url ??
    relation.sizes?.s?.url ??
    relation.sizes?.xs?.url

  if (!url) {
    return []
  }

  return [
    {
      id: relation.id,
      alt: relation.alt,
      blurDataUrl: '',
      updatedAt: relation.updatedAt,
      createdAt: relation.createdAt,
      url,
      thumbnailURL: relation.thumbnailURL ?? relation.sizes?.xs?.url ?? null,
      filename: relation.filename ?? '',
      mimeType: relation.mimeType ?? '',
      filesize: relation.filesize ?? 0,
      width: relation.width ?? 0,
      height: relation.height ?? 0,
      focalX: relation.focalX ?? 50,
      focalY: relation.focalY ?? 50,
      sizes: normalizeImageSizes(relation),
    },
  ]
}

function normalizePot(variant: PayloadProductVariant): DBProductPot | null {
  if (!isObjectRelation<PayloadProductPot>(variant.pot)) {
    return null
  }

  return {
    id: variant.id,
    name: variant.pot.code,
    price: variant.price,
    inStock: variant.isAvailable,
    images: normalizeMediaImage(variant.Image),
  }
}

function splitAgeLabel(label: string) {
  const match = label.trim().match(/^(.+)\s+(месяц|месяца|месяцев|год|года|лет)$/)

  if (!match) {
    return { value: label, postfix: '' }
  }

  return {
    value: match[1] ?? label,
    postfix: match[2] ?? '',
  }
}

function resolveVariantValue(variant: PayloadProductVariant) {
  if (variant.variantType === 'size' && isObjectRelation<ProductSize>(variant.size)) {
    return {
      value: variant.size.label,
      postfix: 'см',
      sortValue: sizeOrder.get(variant.size.label) ?? Number.MAX_SAFE_INTEGER,
    }
  }

  if (variant.variantType === 'age' && isObjectRelation<PayloadProductAge>(variant.age)) {
    const { value, postfix } = splitAgeLabel(variant.age.label)

    return {
      value,
      postfix,
      sortValue: variant.age.months,
    }
  }

  return null
}

function comparePots(left: DBProductPot, right: DBProductPot) {
  const leftValue = Number(left.name.replace(/[^\d]/g, ''))
  const rightValue = Number(right.name.replace(/[^\d]/g, ''))

  if (Number.isNaN(leftValue) || Number.isNaN(rightValue)) {
    return left.name.localeCompare(right.name, 'ru')
  }

  return leftValue - rightValue || left.name.localeCompare(right.name, 'ru')
}

function normalizeVariants(variants: PayloadProductVariant[]): DBProductVariant[] {
  const variantType = variants[0]?.variantType ?? 'none'

  if (variantType === 'none') {
    return variants.flatMap((variant, index) => {
      const pot = normalizePot(variant)

      if (!pot) {
        return []
      }

      return [
        {
          id: index + 1,
          pots: [pot],
        },
      ]
    })
  }

  const variantsByValue = new Map<
    string,
    {
      value: string
      postfix: string
      sortValue: number
      variants: PayloadProductVariant[]
    }
  >()

  variants.forEach((variant) => {
    const variantValue = resolveVariantValue(variant)

    if (!variantValue) {
      return
    }

    const key = `${variantValue.value} ${variantValue.postfix}`.trim()
    const group = variantsByValue.get(key)

    if (group) {
      group.variants.push(variant)
      return
    }

    variantsByValue.set(key, {
      ...variantValue,
      variants: [variant],
    })
  })

  return Array.from(variantsByValue.values())
    .sort(
      (left, right) =>
        left.sortValue - right.sortValue || left.value.localeCompare(right.value, 'ru'),
    )
    .flatMap((group, index) => {
      const pots = group.variants.flatMap((variant) => {
        const pot = normalizePot(variant)
        return pot ? [pot] : []
      })

      if (pots.length === 0) {
        return []
      }

      return [
        {
          id: index + 1,
          value: group.value,
          postfix: group.postfix,
          pots: pots.sort(comparePots),
        },
      ]
    })
}

function normalizeProduct(groupedProduct: GroupedProduct): DBProduct | null {
  const variants = normalizeVariants(groupedProduct.variants)

  if (variants.length === 0) {
    return null
  }

  return {
    slug: groupedProduct.item.slug,
    name: resolveProductName(groupedProduct.item, groupedProduct.category),
    description: resolveDescription(groupedProduct.item),
    attributes: resolveProductAttributes(groupedProduct.item),
    cares: resolveCares(groupedProduct.item),
    valueType: groupedProduct.variants[0]?.variantType ?? 'none',
    category: categoryLabelsByKey[groupedProduct.categoryKey],
    categoryKey: groupedProduct.categoryKey,
    image: resolveProductImage(groupedProduct.categoryKey),
    variants,
  }
}

function groupVariantsByProduct(variants: PayloadProductVariant[]) {
  const groupedProducts = new Map<number, GroupedProduct>()

  variants.forEach((variant) => {
    if (
      !isObjectRelation<PayloadProductItem>(variant.item) ||
      !isObjectRelation<PayloadProductCategory>(variant.category)
    ) {
      return
    }

    const categoryKey = resolveCategoryKey(variant.category)

    if (!categoryKey) {
      return
    }

    const existingProduct = groupedProducts.get(variant.item.id)

    if (existingProduct) {
      existingProduct.variants.push(variant)
      return
    }

    groupedProducts.set(variant.item.id, {
      item: variant.item,
      category: variant.category,
      categoryKey,
      variants: [variant],
    })
  })

  return Array.from(groupedProducts.values())
}

export async function getDbProducts(payload: Payload): Promise<DBProduct[]> {
  const { docs } = await payload.find({
    collection: 'product-variants',
    depth: 3,
    pagination: false,
    limit: 0,
    sort: 'id',
  })

  return groupVariantsByProduct(docs)
    .flatMap((groupedProduct) => {
      const product = normalizeProduct(groupedProduct)

      return product ? [product] : []
    })
    .sort((left, right) => {
      const leftCategoryIndex = categoryOrder.indexOf(left.categoryKey)
      const rightCategoryIndex = categoryOrder.indexOf(right.categoryKey)

      return (
        leftCategoryIndex - rightCategoryIndex ||
        left.slug.localeCompare(right.slug, 'ru', { numeric: true })
      )
    })
}
