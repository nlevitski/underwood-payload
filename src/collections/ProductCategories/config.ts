import type { CollectionConfig } from 'payload'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  admin: {
    useAsTitle: 'nameRu',
    defaultColumns: ['nameRu', 'name', 'slug', 'group'],
  },
  fields: [
    {
      name: 'group',
      type: 'relationship',
      relationTo: 'product-groups',
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
  ],
}
