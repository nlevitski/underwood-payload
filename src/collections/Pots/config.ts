import type { CollectionConfig } from 'payload'
import { generateDisplayNameHook } from './hooks/generate-display-name.hook'
import { preventDefaultPotDeleteHook } from './hooks/prevent-default-pot-delete.hook'

export const Pots: CollectionConfig = {
  slug: 'pots',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: [
      'displayName',
      'code',
      'volumeLiters',
      'diameterMinCm',
      'diameterMaxCm',
      'heightMinCm',
      'heightMaxCm',
    ],
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeValidate: [generateDisplayNameHook],
      },
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'volumeLiters',
      type: 'number',
      required: true,
      index: true,
    },
    {
      name: 'diameterMinCm',
      type: 'number',
      required: true,
    },
    {
      name: 'diameterMaxCm',
      type: 'number',
      required: true,
    },
    {
      name: 'heightMinCm',
      type: 'number',
      required: true,
    },
    {
      name: 'heightMaxCm',
      type: 'number',
      required: true,
    },
  ],
  hooks: {
    beforeDelete: [preventDefaultPotDeleteHook],
  },
}
