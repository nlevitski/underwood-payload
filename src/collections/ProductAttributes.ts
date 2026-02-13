import type { CollectionConfig } from 'payload'

export const ProductAttributes: CollectionConfig = {
  slug: 'product-attributes',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'key', 'dataType', 'category'],
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
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'key',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'dataType',
      type: 'select',
      required: true,
      options: ['text', 'number', 'boolean'],
      defaultValue: 'text',
    },
  ],
}
