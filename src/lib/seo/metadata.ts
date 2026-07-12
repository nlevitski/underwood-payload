import type { Metadata } from 'next'

import type { Media } from '@/payload-types'
import type { SeoMeta, SiteSettingsData } from '@/globals/fetchers'

export const siteURL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://underwood.by').replace(
  /\/$/,
  '',
)

export function absoluteURL(path = '/') {
  if (/^https?:\/\//i.test(path)) return path

  return `${siteURL}${path.startsWith('/') ? path : `/${path}`}`
}

export function resolveMediaURL(media: number | string | Media | null | undefined) {
  const path = resolveMediaPath(media)

  return path ? absoluteURL(path) : undefined
}

export function resolveMediaPath(media: number | string | Media | null | undefined) {
  if (!media || typeof media === 'number') return undefined
  if (typeof media === 'string') return media

  const url = media.url ?? media.sizes?.xl?.url ?? media.sizes?.l?.url
  return url ?? undefined
}

type BuildMetadataOptions = {
  meta?: SeoMeta | null
  settings: SiteSettingsData
  path: string
  fallbackTitle: string
  fallbackDescription?: string | null
  fallbackImage?: number | string | Media | null
  noIndex?: boolean
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
}

export function buildMetadata({
  meta,
  settings,
  path,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
  noIndex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
}: BuildMetadataOptions): Metadata {
  const canonical = absoluteURL(path)
  const title = meta?.title?.trim() || `${fallbackTitle} | ${settings.siteName}`
  const description =
    meta?.description?.trim() || fallbackDescription?.trim() || settings.defaultDescription
  const image =
    resolveMediaURL(meta?.image) ||
    resolveMediaURL(fallbackImage) ||
    resolveMediaURL(settings.defaultSocialImage)

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      type,
      locale: 'ru_BY',
      siteName: settings.siteName,
      url: canonical,
      title,
      description,
      images: image ? [{ url: image }] : [],
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  }
}
