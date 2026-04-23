import type { CollectionConfig } from 'payload'
import { sizeTypes } from './constants'

export const ProductSizes: CollectionConfig = {
  slug: 'product-sizes',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label'],
  },
  fields: [
    {
      name: 'label',
      type: 'select',
      required: true,
      unique: true,
      index: true,
      options: [...sizeTypes],
    },
  ],
}
