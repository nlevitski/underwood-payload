import type { CollectionConfig } from 'payload'

export const ProductAges: CollectionConfig = {
  slug: 'product-ages',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'months'],
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'months',
      type: 'number',
      required: true,
      unique: true,
      index: true,
    },
  ],
}
