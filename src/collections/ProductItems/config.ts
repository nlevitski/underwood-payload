import type { CollectionConfig } from 'payload'

export const ProductItems: CollectionConfig = {
  slug: 'product-items',
  admin: {
    useAsTitle: 'nameRu',
    defaultColumns: ['nameRu', 'name', 'slug', 'category', 'attributes', 'cares'],
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
      name: 'nameRu',
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
    {
      name: 'attributes',
      type: 'relationship',
      relationTo: 'product-item-attributes',
    },
    {
      name: 'cares',
      type: 'relationship',
      relationTo: 'product-item-cares',
    },
  ],
}
