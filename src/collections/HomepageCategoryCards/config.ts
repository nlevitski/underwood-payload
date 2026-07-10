import type { CollectionConfig } from 'payload'

import { resolveRelationId } from '@/hooks/resolve-relation-id'

import { validateCategoriesBelongToGroup } from './hooks/validate-categories-belong-to-group.hook'

export const HomepageCategoryCards: CollectionConfig = {
  slug: 'homepage-category-cards',
  labels: {
    singular: 'Категория растений на главной',
    plural: 'Категории растений на главной',
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'group', 'sortOrder', 'updatedAt'],
    description: 'Карточки раздела «Ассортимент — Категории растений» на главной странице.',
  },
  defaultSort: 'sortOrder',
  hooks: {
    beforeValidate: [validateCategoriesBelongToGroup],
  },
  fields: [
    {
      name: 'title',
      label: 'Заголовок',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'textarea',
      required: true,
    },
    {
      name: 'image',
      label: 'Изображение',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'group',
      label: 'Группа растений',
      type: 'relationship',
      relationTo: 'product-groups',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Определяет раздел каталога, который откроется по клику на карточку.',
      },
    },
    {
      name: 'categories',
      label: 'Роды растений (чипы)',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      filterOptions: ({ data }) => {
        const groupId = resolveRelationId(data?.group)

        if (!groupId) {
          return false
        }

        return {
          group: {
            equals: groupId,
          },
        }
      },
      admin: {
        description: 'Доступны только роды из выбранной выше группы. Их названия станут чипами.',
      },
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
