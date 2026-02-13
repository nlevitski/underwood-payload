import type { CollectionConfig } from 'payload'

export const ProductItems: CollectionConfig = {
  slug: 'product-items',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'category'],
  },
  fields: [
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      required: true,
      index: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
  ],
}
