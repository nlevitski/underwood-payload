import { cache } from 'react'

import type { Media } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/client'

export type SeoMeta = {
  title?: string | null
  description?: string | null
  image?: number | Media | null
}

export type PageGlobalSlug =
  'homepage' | 'about-page' | 'catalog-page' | 'blog-page' | 'gallery-page' | 'contacts-page'

export type PageGlobalData = {
  heading: string
  description: string
  eyebrow?: string | null
  heroImage?: number | Media | null
  meta?: SeoMeta | null
}

export type SiteSettingsData = {
  siteName: string
  defaultDescription: string
  defaultSocialImage?: number | Media | null
  phone: string
  email: string
  addressLocality: string
  addressRegion: string
  streetAddress: string
  workingHours: string
  socialLinks?: Array<{ label: string; url: string; id?: string | null }> | null
}

const pageDefaults: Record<PageGlobalSlug, PageGlobalData> = {
  homepage: {
    heading: 'Underwood',
    eyebrow: 'Питомник хвойных и ягодных растений',
    description:
      'Выращиваем хвойные и ягодные культуры с заботой и опытом. Все растения адаптированы к климату Беларуси.',
  },
  'about-page': {
    heading: 'О питомнике Underwood',
    description: 'Питомник с 10-летним опытом выращивания хвойных и ягодных культур в Беларуси',
  },
  'catalog-page': {
    heading: 'Каталог растений',
    description:
      'Хвойные, ягодные, лиственные и многолетние растения, выращенные в питомнике Underwood.',
  },
  'blog-page': {
    heading: 'Блог питомника',
    description: 'Полезные статьи по уходу за растениями и агротехнике.',
  },
  'gallery-page': {
    heading: 'Фото питомника',
    description: 'Реальные фотографии наших полей и растений.',
  },
  'contacts-page': {
    heading: 'Контакты',
    description: 'Свяжитесь с нами или приезжайте в питомник.',
  },
}

const siteDefaults: SiteSettingsData = {
  siteName: 'Underwood',
  defaultDescription:
    'Питомник растений Underwood в Беларуси. Хвойные, ягодные и декоративные растения, адаптированные к местному климату.',
  phone: '+375 29 343-00-06',
  email: 'info@underwood.by',
  addressLocality: 'д. Обчак',
  addressRegion: 'Минская область, Минский район',
  streetAddress: 'ул. Западная',
  workingHours: 'Пн-Пт: 9:00 - 18:00, Сб: 9:00 - 17:00',
}

export const getPageGlobal = cache(async (slug: PageGlobalSlug): Promise<PageGlobalData> => {
  try {
    const payload = await getPayloadClient()
    const page = (await payload.findGlobal({
      slug: slug as never,
      depth: 1,
    })) as unknown as Partial<PageGlobalData>

    return {
      ...pageDefaults[slug],
      ...page,
      heading: page.heading?.trim() || pageDefaults[slug].heading,
      description: page.description?.trim() || pageDefaults[slug].description,
    }
  } catch (error) {
    console.error(`Error fetching ${slug} global:`, error)
    return pageDefaults[slug]
  }
})

export const getSiteSettings = cache(async (): Promise<SiteSettingsData> => {
  try {
    const payload = await getPayloadClient()
    const settings = (await payload.findGlobal({
      slug: 'site-settings' as never,
      depth: 1,
    })) as unknown as Partial<SiteSettingsData>

    return {
      ...siteDefaults,
      ...settings,
      siteName: settings.siteName?.trim() || siteDefaults.siteName,
      defaultDescription: settings.defaultDescription?.trim() || siteDefaults.defaultDescription,
      phone: settings.phone?.trim() || siteDefaults.phone,
      email: settings.email?.trim() || siteDefaults.email,
      addressLocality: settings.addressLocality?.trim() || siteDefaults.addressLocality,
      addressRegion: settings.addressRegion?.trim() || siteDefaults.addressRegion,
      streetAddress: settings.streetAddress?.trim() || siteDefaults.streetAddress,
      workingHours: settings.workingHours?.trim() || siteDefaults.workingHours,
    }
  } catch (error) {
    console.error('Error fetching site settings global:', error)
    return siteDefaults
  }
})
