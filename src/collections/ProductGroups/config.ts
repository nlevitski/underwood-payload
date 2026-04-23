import type { CollectionConfig } from 'payload'
import { generateSlugHook } from './hooks/generate-slug.hook'

export const ProductGroups: CollectionConfig = {
  slug: 'product-groups',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'nameRu',
      label: 'Название',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [generateSlugHook],
      },
    },
  ],
}
