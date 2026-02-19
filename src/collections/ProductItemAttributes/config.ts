import type { CollectionConfig } from 'payload'

export const ProductItemAttributes: CollectionConfig = {
  slug: 'product-item-attributes',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['item', 'label', 'value'],
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
      name: 'label',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'value',
      type: 'text',
      required: true,
    },
  ],
}
