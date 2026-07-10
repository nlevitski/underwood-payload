import type { CollectionConfig } from 'payload'

export const GalleryImages: CollectionConfig = {
  slug: 'gallery-images',
  labels: {
    singular: 'Фото галереи',
    plural: 'Фото галереи',
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    defaultColumns: ['image', 'sortOrder', 'updatedAt'],
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'image',
      label: 'Фотография',
      type: 'upload',
      relationTo: 'media',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'sortOrder',
      label: 'Порядок отображения',
      type: 'number',
      required: true,
      defaultValue: 0,
      index: true,
      admin: {
        position: 'sidebar',
        step: 1,
      },
    },
  ],
}
