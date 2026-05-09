import type { CollectionConfig } from 'payload'

export const ProductItemCares: CollectionConfig = {
  slug: 'product-item-cares',
  admin: {
    useAsTitle: 'item',
    defaultColumns: ['item', 'watering', 'light', 'temperature', 'size'],
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
      name: 'watering',
      type: 'text',
    },
    {
      name: 'light',
      type: 'text',
    },
    {
      name: 'temperature',
      type: 'text',
    },
    {
      name: 'size',
      type: 'text',
    },
  ],
}
