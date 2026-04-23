import type { CollectionConfig } from 'payload'
import { hydrateItemAttributesEditorHook } from './hooks/hydrate-item-attributes-editor.hook'
import { syncItemAttributesEditorHook } from './hooks/sync-item-attributes-editor.hook'
import { validateItemAttributesEditorHook } from './hooks/validate-item-attributes-editor.hook'

export const ProductItems: CollectionConfig = {
  slug: 'product-items',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'nameRu', 'slug', 'category'],
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
      name: 'itemAttributes',
      label: 'Item Attributes',
      type: 'array',
      virtual: true,
      admin: {
        description:
          'Edit item attributes inline. Values are stored in Product Item Attributes collection.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'attribute',
          type: 'relationship',
          relationTo: 'product-attributes',
          required: true,
          filterOptions: ({ data }) => {
            if (!data?.category) {
              return false
            }

            return {
              category: {
                equals: data.category,
              },
            }
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: false,
          admin: {
            description: 'Optional. If empty, it will be set to Value on save.',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [validateItemAttributesEditorHook],
    afterRead: [hydrateItemAttributesEditorHook],
    afterChange: [syncItemAttributesEditorHook],
  },
}
