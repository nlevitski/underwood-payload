import type { GlobalConfig } from 'payload'

import { createGlobalRevalidator } from '@/hooks/revalidate-frontend.hook'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки сайта',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    group: 'Настройки',
  },
  hooks: {
    afterChange: [
      createGlobalRevalidator(['/', '/about', '/catalog', '/blog', '/gallery', '/contacts']),
    ],
  },
  fields: [
    {
      name: 'siteName',
      label: 'Название сайта',
      type: 'text',
      required: true,
      defaultValue: 'Underwood',
    },
    {
      name: 'defaultDescription',
      label: 'Описание сайта по умолчанию',
      type: 'textarea',
      required: true,
      defaultValue:
        'Питомник растений Underwood в Беларуси. Хвойные, ягодные и декоративные растения, адаптированные к местному климату.',
    },
    {
      name: 'defaultSocialImage',
      label: 'Изображение для социальных сетей по умолчанию',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'phone',
      label: 'Телефон',
      type: 'text',
      required: true,
      defaultValue: '+375 29 343-00-06',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      defaultValue: 'info@underwood.by',
    },
    {
      name: 'addressLocality',
      label: 'Населённый пункт',
      type: 'text',
      required: true,
      defaultValue: 'д. Обчак',
    },
    {
      name: 'addressRegion',
      label: 'Область и район',
      type: 'text',
      required: true,
      defaultValue: 'Минская область, Минский район',
    },
    {
      name: 'streetAddress',
      label: 'Улица',
      type: 'text',
      required: true,
      defaultValue: 'ул. Западная',
    },
    {
      name: 'workingHours',
      label: 'Часы работы',
      type: 'text',
      required: true,
      defaultValue: 'Пн-Пт: 9:00 - 18:00, Сб: 9:00 - 17:00',
    },
    {
      name: 'socialLinks',
      label: 'Социальные сети',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: 'Название',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
