import type { CollectionConfig } from 'payload'
import {
  hydrateItemCareDisplayNameHook,
  populateItemCareDisplayNameHook,
} from './hooks/populate-display-name.hook'
import { clearItemCareLinkHook, syncItemCareLinkHook } from './hooks/sync-item-link.hook'

export const ProductItemCares: CollectionConfig = {
  slug: 'product-item-cares',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'item', 'watering', 'light', 'soil', 'temperature', 'size'],
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
      name: 'watering',
      type: 'text',
    },
    {
      name: 'light',
      type: 'text',
    },
    {
      name: 'soil',
      type: 'text',
    },
    {
      name: 'temperature',
      type: 'text',
    },
    {
      name: 'size',
      type: 'text',
    },
  ],
  hooks: {
    beforeValidate: [populateItemCareDisplayNameHook],
    afterRead: [hydrateItemCareDisplayNameHook],
    afterChange: [syncItemCareLinkHook],
    beforeDelete: [clearItemCareLinkHook],
  },
}
