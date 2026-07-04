import type { CollectionConfig } from 'payload'
import {
  hydrateItemAttributeDisplayNameHook,
  populateItemAttributeDisplayNameHook,
} from './hooks/populate-display-name.hook'
import { clearItemAttributeLinkHook, syncItemAttributeLinkHook } from './hooks/sync-item-link.hook'

export const ProductItemAttributes: CollectionConfig = {
  slug: 'product-item-attributes',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: [
      'displayName',
      'item',
      'type',
      'notes',
      'description',
      'ripeningTime',
      'growthForm',
      'color',
    ],
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'item',
      type: 'relationship',
      relationTo: 'product-items',
      required: true,
      index: true,
      unique: true,
    },
    {
      name: 'type',
      type: 'text',
    },
    {
      name: 'notes',
      type: 'text',
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'ripeningTime',
      type: 'select',
      label: 'Ripening Time',
      options: [
        {
          label: 'Ранний',
          value: 'early',
        },
        {
          label: 'Ранний–средний',
          value: 'earlyMid',
        },
        {
          label: 'Средний',
          value: 'midSeason',
        },
        {
          label: 'Средний–поздний',
          value: 'midLate',
        },
        {
          label: 'Поздний',
          value: 'late',
        },
      ],
    },
    {
      name: 'growthForm',
      type: 'text',
    },
    {
      name: 'color',
      type: 'text',
    },
  ],
  hooks: {
    beforeValidate: [populateItemAttributeDisplayNameHook],
    afterRead: [hydrateItemAttributeDisplayNameHook],
    afterChange: [syncItemAttributeLinkHook],
    beforeDelete: [clearItemAttributeLinkHook],
  },
}
