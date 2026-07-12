import type { Field, GlobalConfig } from 'payload'

import { createGlobalRevalidator } from '@/hooks/revalidate-frontend.hook'

type GlobalUpdateArgs = Parameters<NonNullable<NonNullable<GlobalConfig['access']>['update']>>[0]

const authenticated = ({ req: { user } }: GlobalUpdateArgs) => Boolean(user)

type PageGlobalOptions = {
  slug: GlobalConfig['slug']
  label: string
  heading: string
  description: string
  extraFields?: Field[]
  paths: string[]
}

function createPageGlobal({
  slug,
  label,
  heading,
  description,
  extraFields = [],
  paths,
}: PageGlobalOptions): GlobalConfig {
  return {
    slug,
    label,
    access: {
      read: () => true,
      update: authenticated,
    },
    admin: {
      group: 'Страницы сайта',
    },
    versions: {
      drafts: true,
    },
    hooks: {
      afterChange: [createGlobalRevalidator(paths)],
    },
    fields: [
      {
        name: 'heading',
        label: 'Заголовок страницы',
        type: 'text',
        required: true,
        defaultValue: heading,
      },
      {
        name: 'description',
        label: 'Краткое описание',
        type: 'textarea',
        required: true,
        defaultValue: description,
      },
      ...extraFields,
    ],
  }
}

export const Homepage: GlobalConfig = createPageGlobal({
  slug: 'homepage',
  label: 'Главная страница',
  heading: 'Underwood',
  description:
    'Выращиваем хвойные и ягодные культуры с заботой и опытом. Все растения адаптированы к климату Беларуси.',
  paths: ['/'],
  extraFields: [
    {
      name: 'eyebrow',
      label: 'Подзаголовок',
      type: 'text',
      required: true,
      defaultValue: 'Питомник хвойных и ягодных растений',
    },
    {
      name: 'heroImage',
      label: 'Фоновое изображение',
      type: 'upload',
      relationTo: 'media',
    },
  ],
})

export const AboutPage: GlobalConfig = createPageGlobal({
  slug: 'about-page',
  label: 'Страница «О питомнике»',
  heading: 'О питомнике Underwood',
  description: 'Питомник с 10-летним опытом выращивания хвойных и ягодных культур в Беларуси',
  paths: ['/about'],
  extraFields: [
    {
      name: 'heroImage',
      label: 'Фоновое изображение',
      type: 'upload',
      relationTo: 'media',
    },
  ],
})

export const CatalogPage: GlobalConfig = createPageGlobal({
  slug: 'catalog-page',
  label: 'Страница каталога',
  heading: 'Каталог растений',
  description:
    'Хвойные, ягодные, лиственные и многолетние растения, выращенные в питомнике Underwood.',
  paths: ['/catalog'],
})

export const BlogPage: GlobalConfig = createPageGlobal({
  slug: 'blog-page',
  label: 'Страница блога',
  heading: 'Блог питомника',
  description: 'Полезные статьи по уходу за растениями и агротехнике.',
  paths: ['/blog'],
})

export const GalleryPage: GlobalConfig = createPageGlobal({
  slug: 'gallery-page',
  label: 'Страница фотогалереи',
  heading: 'Фото питомника',
  description: 'Реальные фотографии наших полей и растений.',
  paths: ['/gallery'],
})

export const ContactsPage: GlobalConfig = createPageGlobal({
  slug: 'contacts-page',
  label: 'Страница контактов',
  heading: 'Контакты',
  description: 'Свяжитесь с нами или приезжайте в питомник.',
  paths: ['/contacts'],
})
