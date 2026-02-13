import type { CollectionConfig } from 'payload'

export const ProductItemAttributes: CollectionConfig = {
  slug: 'product-item-attributes',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['item', 'attribute', 'valueText', 'valueNumber', 'valueBoolean'],
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
      name: 'attribute',
      type: 'relationship',
      relationTo: 'product-attributes',
      required: true,
      index: true,
    },
    {
      name: 'valueText',
      type: 'text',
    },
    {
      name: 'valueNumber',
      type: 'number',
    },
    {
      name: 'valueBoolean',
      type: 'checkbox',
    },
  ],
}
