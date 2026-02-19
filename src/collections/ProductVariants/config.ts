import type { CollectionConfig } from 'payload'
import { setDefaultPotHook } from '@/hooks/set-default-pot.hook'
import { syncAvailabilityHook } from './hooks/sync-availability.hook'
import { validateUniqueCombinationHook } from './hooks/validate-unique-combination.hook'
import { generateSkuHook } from './hooks/generate-sku.hook'

export const ProductVariants: CollectionConfig = {
  slug: 'product-variants',
  admin: {
    useAsTitle: 'sku',
    defaultColumns: ['sku', 'item', 'age', 'pot', 'price', 'stockQty', 'isAvailable'],
  },
  fields: [
    {
      name: 'item',
      type: 'relationship',
      relationTo: 'product-items',
      required: true,
      index: true,
    },
    {
      name: 'age',
      type: 'relationship',
      relationTo: 'product-ages',
      required: true,
      index: true,
    },
    {
      name: 'pot',
      type: 'relationship',
      relationTo: 'pots',
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
  ],
  hooks: {
    beforeValidate: [generateSkuHook],
    beforeChange: [validateUniqueCombinationHook, syncAvailabilityHook],
  },
}
