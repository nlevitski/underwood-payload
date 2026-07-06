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
      label: 'Имя',
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
      label: 'Товарная позиция',
    },
    {
      name: 'type',
      type: 'text',
      label: 'Тип',
    },
    {
      name: 'notes',
      type: 'text',
      label: 'Примечания',
    },
    {
      name: 'description',
      type: 'text',
      label: 'Описание',
    },
    {
      name: 'ripeningTime',
      type: 'select',
      label: 'Срок созревания',
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
      label: 'Форма роста',
    },
    {
      name: 'color',
      type: 'text',
      label: 'Цвет кроны',
    },
  ],
  hooks: {
    beforeValidate: [populateItemAttributeDisplayNameHook],
    afterRead: [hydrateItemAttributeDisplayNameHook],
    afterChange: [syncItemAttributeLinkHook],
    beforeDelete: [clearItemAttributeLinkHook],
  },
}
