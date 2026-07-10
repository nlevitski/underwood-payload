import { APIError, type CollectionBeforeValidateHook } from 'payload'

import { resolveRelationId } from '@/hooks/resolve-relation-id'

export const validateProductSelection: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  if (!data) {
    return data
  }

  const groupId = resolveRelationId(data.group ?? originalDoc?.group)
  const categoryId = resolveRelationId(data.category ?? originalDoc?.category)
  const productId = resolveRelationId(data.product ?? originalDoc?.product)
  const defaultVariantId = resolveRelationId(data.defaultVariant ?? originalDoc?.defaultVariant)

  if (!groupId || !categoryId || !productId || !defaultVariantId) {
    return data
  }

  const [category, product, variant] = await Promise.all([
    req.payload.findByID({
      collection: 'product-categories',
      id: categoryId,
      depth: 0,
      req,
    }),
    req.payload.findByID({
      collection: 'product-items',
      id: productId,
      depth: 0,
      req,
    }),
    req.payload.findByID({
      collection: 'product-variants',
      id: defaultVariantId,
      depth: 0,
      req,
    }),
  ])

  if (resolveRelationId(category.group) !== groupId) {
    throw new APIError('Категория должна относиться к выбранной группе растений.', 400)
  }

  if (resolveRelationId(product.category) !== categoryId) {
    throw new APIError('Товар должен относиться к выбранной категории.', 400)
  }

  if (resolveRelationId(variant.item) !== productId) {
    throw new APIError('Вариация по умолчанию должна относиться к выбранному товару.', 400)
  }

  return data
}
