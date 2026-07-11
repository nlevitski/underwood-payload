import type { CollectionConfig } from 'payload'
import { setDefaultPotHook } from '@/hooks/set-default-pot.hook'
import { resolveRelationId } from '@/hooks/resolve-relation-id'
import { syncVariantSelectionHook } from './hooks/sync-variant-selection.hook'
import { syncAvailabilityHook } from './hooks/sync-availability.hook'
import { validateUniqueCombinationHook } from './hooks/validate-unique-combination.hook'
import { generateSkuHook } from './hooks/generate-sku.hook'
import { syncCategoryHook } from './hooks/sync-category.hook'

const variantTypeOptions = [
  { label: 'Нет', value: 'none' },
  { label: 'Размер', value: 'size' },
  { label: 'Возраст', value: 'age' },
]

export const ProductVariants: CollectionConfig = {
  slug: 'product-variants',
  admin: {
    useAsTitle: 'sku',
    defaultColumns: [
      'sku',
      'category',
      'item',
      'variantType',
      'age',
      'size',
      'pot',
      'price',
      'stockQty',
      'isAvailable',
    ],
  },
  fields: [
    {
      name: 'variantType',
      label: 'Тип варианта',
      type: 'select',
      required: true,
      defaultValue: 'none',
      index: true,
      options: variantTypeOptions,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      required: true,
      index: true,
    },
    {
      name: 'item',
      type: 'relationship',
      relationTo: 'product-items',
      required: true,
      index: true,
      filterOptions: ({ data }) => {
        const categoryId = resolveRelationId(data?.category)

        if (!categoryId) {
          return false
        }

        return {
          category: {
            equals: categoryId,
          },
        }
      },
    },
    {
      name: 'age',
      type: 'relationship',
      relationTo: 'product-ages',
      required: false,
      index: true,
      admin: {
        condition: (_, siblingData) => siblingData?.variantType === 'age',
      },
    },
    {
      name: 'size',
      type: 'relationship',
      relationTo: 'product-sizes',
      required: false,
      index: true,
      admin: {
        condition: (_, siblingData) => siblingData?.variantType === 'size',
      },
    },
    {
      name: 'pot',
      type: 'relationship',
      relationTo: 'product-pots',
      required: true,
      index: true,
      hooks: {
        beforeValidate: [setDefaultPotHook],
      },
    },
    {
      name: 'sku',
      type: 'text',
      required: false,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Generated automatically from item, age, and pot.',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      index: true,
    },
    {
      name: 'stockQty',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      index: true,
    },
    {
      name: 'isAvailable',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'Image',
      label: 'Фотографии вариации',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      filterOptions: {
        mimeType: {
          contains: 'image',
        },
      },
      admin: {
        description: 'Порядок файлов определяет порядок фотографий в слайдере на сайте.',
      },
    },
  ],
  hooks: {
    beforeValidate: [syncCategoryHook, syncVariantSelectionHook, generateSkuHook],
    beforeChange: [validateUniqueCombinationHook, syncAvailabilityHook],
  },
}
