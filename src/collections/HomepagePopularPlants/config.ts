import type { CollectionConfig } from 'payload'

import { resolveRelationId } from '@/hooks/resolve-relation-id'

import { validateProductSelection } from './hooks/validate-product-selection.hook'

export const HomepagePopularPlants: CollectionConfig = {
  slug: 'homepage-popular-plants',
  labels: {
    singular: 'Востребованное растение',
    plural: 'Востребованные растения',
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'product',
    defaultColumns: ['group', 'category', 'product', 'defaultVariant', 'sortOrder'],
    description:
      'Товары раздела «Востребованные растения» на главной. Выбранная вариация будет показана первой, остальные останутся доступны в карточке.',
  },
  defaultSort: 'sortOrder',
  hooks: {
    beforeValidate: [validateProductSelection],
  },
  fields: [
    {
      name: 'group',
      label: 'Группа растений',
      type: 'relationship',
      relationTo: 'product-groups',
      index: true,
      validate: (value: unknown) =>
        resolveRelationId(value) !== null || 'Выберите группу растений.',
      admin: {
        description: 'Обязательное поле. Сначала выберите группу растений.',
      },
    },
    {
      name: 'category',
      label: 'Категория',
      type: 'relationship',
      relationTo: 'product-categories',
      index: true,
      validate: (value: unknown) => resolveRelationId(value) !== null || 'Выберите категорию.',
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
        description: 'Обязательное поле. Доступны только категории из выбранной группы.',
      },
    },
    {
      name: 'product',
      label: 'Товар',
      type: 'relationship',
      relationTo: 'product-items',
      required: true,
      unique: true,
      index: true,
      filterOptions: ({ data }) => {
        const categoryId = resolveRelationId(data?.category)

        if (!categoryId) {
          return false
        }

        return {
          category: {
            equals: categoryId,
          },
        }
      },
      admin: {
        description: 'Доступны только товары из выбранной категории.',
      },
    },
    {
      name: 'defaultVariant',
      label: 'Вариация по умолчанию',
      type: 'relationship',
      relationTo: 'product-variants',
      required: true,
      filterOptions: ({ data }) => {
        const productId = resolveRelationId(data?.product)

        if (!productId) {
          return false
        }

        return {
          item: {
            equals: productId,
          },
        }
      },
      admin: {
        description:
          'Список станет доступен после выбора товара и покажет только его вариации. Вариация определяет начальные размер/возраст, горшок, цену и изображение.',
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
