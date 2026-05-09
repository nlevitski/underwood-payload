import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as ts from 'typescript'
import type { Payload } from 'payload'
import type { ProductVariant } from '@/payload-types'
import { productCatalog } from './product-catalog.data'

type VariantType = 'none' | 'size' | 'age'

type ParsedPot = {
  name: string
  price: number
  inStock: boolean
}

type ParsedVariant = {
  value: string | null
  postfix: string | null
  pots: ParsedPot[]
}

type ParsedProduct = {
  id: string
  name: string
  valueType: VariantType
  variants: ParsedVariant[]
}

type CollectionDoc = {
  id: number | string
  name?: string
  label?: string
  code?: string
  months?: number
  type?: string
  category?: number | string | { id?: number | string } | null
}

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

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .split('')
    .map((char) => transliterationMap[char] ?? char)
    .join('')
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function stripCategoryPrefix(productName: string): string {
  const categoryPrefixes = productCatalog
    .map((entry) => entry.category)
    .sort((a, b) => b.length - a.length)

  for (const category of categoryPrefixes) {
    if (productName.startsWith(`${category} `)) {
      return productName.slice(category.length).trim()
    }
  }

  return productName.trim()
}

function buildCatalogItemLookup(): Map<string, string> {
  const lookup = new Map<string, string>()

  for (const category of productCatalog) {
    for (const item of category.items) {
      const aliases = new Set<string>([item.name, item.nameRu])
      const mainPart = item.name.split('(')[0]?.trim()
      if (mainPart) {
        aliases.add(mainPart)
      }
      const mainPartRu = item.nameRu.split('(')[0]?.trim()
      if (mainPartRu) {
        aliases.add(mainPartRu)
      }

      for (const alias of aliases) {
        lookup.set(normalizeName(alias), item.name)
      }
    }
  }

  return lookup
}

function getLiteralValue(node: ts.Expression | ts.ObjectLiteralExpression | ts.ArrayLiteralExpression | null | undefined): string | number | boolean | null {
  if (!node) {
    return null
  }

  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text
  }

  if (ts.isNumericLiteral(node)) {
    return Number(node.text)
  }

  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true
  }

  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false
  }

  return null
}

function getObjectProperty<TNode extends ts.ObjectLiteralExpression>(node: TNode, name: string): ts.Expression | null {
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property) && !ts.isShorthandPropertyAssignment(property)) {
      continue
    }

    const key = property.name.getText().replace(/^['"]|['"]$/g, '')
    if (key !== name) {
      continue
    }

    return ts.isPropertyAssignment(property) ? property.initializer : property.name
  }

  return null
}

function parseProductsSource(): ParsedProduct[] {
  const sourcePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../../../src/app/(frontend)/catalog/products.ts',
  )
  const source = fs.readFileSync(sourcePath, 'utf8')
  const sf = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

  let productsArray: ts.ArrayLiteralExpression | null = null
  for (const statement of sf.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue
    }

    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText(sf) !== 'products') {
        continue
      }

      if (declaration.initializer && ts.isArrayLiteralExpression(declaration.initializer)) {
        productsArray = declaration.initializer
      }
    }
  }

  if (!productsArray) {
    throw new Error('Cannot find products array in products.ts')
  }

  return productsArray.elements.flatMap((element) => {
    if (!ts.isObjectLiteralExpression(element)) {
      return []
    }

    const id = getLiteralValue(getObjectProperty(element, 'id'))
    const name = getLiteralValue(getObjectProperty(element, 'name'))
    const valueType = getLiteralValue(getObjectProperty(element, 'valueType'))
    const variantsNode = getObjectProperty(element, 'variants')

    if (typeof id !== 'string' || typeof name !== 'string' || (valueType !== 'none' && valueType !== 'size' && valueType !== 'age')) {
      return []
    }

    if (!variantsNode || !ts.isArrayLiteralExpression(variantsNode)) {
      return []
    }

    const variants = variantsNode.elements.flatMap((variantElement) => {
      if (!ts.isObjectLiteralExpression(variantElement)) {
        return []
      }

      const value = getLiteralValue(getObjectProperty(variantElement, 'value'))
      const postfix = getLiteralValue(getObjectProperty(variantElement, 'postfix'))
      const potsNode = getObjectProperty(variantElement, 'pots')

      if (!potsNode || !ts.isArrayLiteralExpression(potsNode)) {
        return []
      }

      const pots = potsNode.elements.flatMap((potElement) => {
        if (!ts.isObjectLiteralExpression(potElement)) {
          return []
        }

        const potName = getLiteralValue(getObjectProperty(potElement, 'name'))
        const price = getLiteralValue(getObjectProperty(potElement, 'price'))
        const inStock = getLiteralValue(getObjectProperty(potElement, 'inStock'))

        if (typeof potName !== 'string' || typeof price !== 'number' || typeof inStock !== 'boolean') {
          return []
        }

        return [{ name: potName, price, inStock }]
      })

      return [
        {
          value: typeof value === 'string' ? value : null,
          postfix: typeof postfix === 'string' ? postfix : null,
          pots,
        },
      ]
    })

    return [{ id, name, valueType, variants }]
  })
}

function resolveItemName(product: ParsedProduct, catalogLookup: Map<string, string>): string | null {
  const candidates = [stripCategoryPrefix(product.name), product.name]

  for (const candidate of candidates) {
    const words = candidate
      .trim()
      .split(/\s+/u)
      .filter(Boolean)

    for (let start = 0; start < words.length; start += 1) {
      const suffix = words.slice(start).join(' ').trim()
      if (!suffix) {
        continue
      }

      const match = catalogLookup.get(normalizeName(suffix))
      if (match) {
        return match
      }
    }
  }

  return null
}

function getRelationId(doc: CollectionDoc | undefined): number | null {
  if (!doc) {
    return null
  }

  if (typeof doc.id === 'number') {
    return doc.id
  }

  if (typeof doc.id === 'string') {
    const parsed = Number(doc.id)
    return Number.isInteger(parsed) ? parsed : null
  }

  return null
}

function getCategoryId(item: CollectionDoc | undefined): number | null {
  if (!item) {
    return null
  }

  if (typeof item?.category === 'number') {
    return item.category
  }

  if (typeof item?.category === 'string') {
    const parsed = Number(item.category)
    return Number.isInteger(parsed) ? parsed : null
  }

  if (item?.category && typeof item.category === 'object' && 'id' in item.category) {
    const relationId = (item.category as { id?: number | string }).id
    if (typeof relationId === 'number') {
      return relationId
    }

    if (typeof relationId === 'string') {
      const parsed = Number(relationId)
      return Number.isInteger(parsed) ? parsed : null
    }
  }

  return null
}

export async function seedProductVariants(payload: Payload) {
  const [
    { docs: items },
    { docs: sizes },
    { docs: ages },
    { docs: pots },
  ] = await Promise.all([
    payload.find({
      collection: 'product-items',
      depth: 0,
      limit: 0,
      pagination: false,
    }),
    payload.find({
      collection: 'product-sizes',
      depth: 0,
      limit: 0,
      pagination: false,
    }),
    payload.find({
      collection: 'product-ages',
      depth: 0,
      limit: 0,
      pagination: false,
    }),
    payload.find({
      collection: 'product-pots',
      depth: 0,
      limit: 0,
      pagination: false,
    }),
  ])

  const itemByName = new Map<string, CollectionDoc>(
    items.flatMap((item) => {
      if (typeof item.name !== 'string') {
        return []
      }

      return [[item.name, item as CollectionDoc]]
    }),
  )
  const ageByLabel = new Map<string, CollectionDoc>(
    ages.flatMap((age) => {
      if (typeof age.label !== 'string') {
        return []
      }

      return [[age.label, age as CollectionDoc]]
    }),
  )
  const sizeByLabel = new Map<string, CollectionDoc>(
    sizes.flatMap((size) => {
      if (typeof size.label !== 'string') {
        return []
      }

      return [[size.label, size as CollectionDoc]]
    }),
  )
  const potByCode = new Map<string, CollectionDoc>(
    pots.flatMap((pot) => {
      if (typeof pot.code !== 'string') {
        return []
      }

      return [[pot.code, pot as CollectionDoc]]
    }),
  )

  const parsedProducts = parseProductsSource()
  const catalogLookup = buildCatalogItemLookup()

  for (const product of parsedProducts) {
    const itemName = resolveItemName(product, catalogLookup)
    if (!itemName) {
      console.warn(`Skipping product variants for "${product.name}" because matching item was not found`)
      continue
    }

    const item = itemByName.get(itemName)
    const itemId = getRelationId(item)
    const categoryId = getCategoryId(item)

    if (!itemId) {
      console.warn(`Skipping product variants for "${product.name}" because item "${itemName}" was not found in product-items`)
      continue
    }

    if (!categoryId) {
      console.warn(`Skipping product variants for "${product.name}" because item "${itemName}" is missing category`)
      continue
    }

    for (const variant of product.variants) {
      for (const potSeed of variant.pots) {
        const pot = potByCode.get(potSeed.name)
        const potId = getRelationId(pot)

        if (!potId) {
          throw new Error(`Cannot seed product variants: pot "${potSeed.name}" was not found`)
        }

        const data: Omit<ProductVariant, 'id' | 'createdAt' | 'updatedAt'> = {
          category: categoryId,
          variantType: product.valueType,
          item: itemId,
          pot: potId,
          price: potSeed.price,
          stockQty: potSeed.inStock ? 1 : 0,
          isAvailable: false,
        }

        if (product.valueType === 'age') {
          if (!variant.value || !variant.postfix) {
            throw new Error(`Cannot seed age variant for "${product.name}": missing age label`)
          }

          const ageLabel = `${variant.value} ${variant.postfix}`
          const age = ageByLabel.get(ageLabel)
          const ageId = getRelationId(age)
          if (!ageId) {
            console.warn(`Skipping age variant for "${product.name}" because age "${ageLabel}" was not found`)
            continue
          }

          data.age = ageId
        }

        if (product.valueType === 'size') {
          if (!variant.value) {
            throw new Error(`Cannot seed size variant for "${product.name}": missing size value`)
          }

          const size = sizeByLabel.get(variant.value)
          const sizeId = getRelationId(size)
          if (!sizeId) {
            console.warn(`Skipping size variant for "${product.name}" because size "${variant.value}" was not found`)
            continue
          }

          data.size = sizeId
        }

        await payload.create({
          collection: 'product-variants',
          draft: false,
          data,
        })
      }
    }
  }
}
