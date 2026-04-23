import { CollectionConfig } from 'payload'

export const ProductVariantTypes: CollectionConfig = {
  slug: 'product-variant-types',
  admin: {
    useAsTitle: 'type',
    defaultColumns: ['id', 'type'],
  },
  fields: [
    {
      name: 'type',
      type: 'text',
      required: true,
      index: true,
    },
  ],
}
