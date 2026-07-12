import type { Metadata } from 'next'

import { getPayloadClient } from '@/lib/payload/client'
import { CatalogClient } from './CatalogClient'
import { getDbProducts } from './dbProducts'
import { getPageGlobal, getSiteSettings } from '@/globals/fetchers'
import { buildMetadata } from '@/lib/seo/metadata'

type CatalogSearchParams = Record<string, string | string[] | undefined>

function serializeSearchParams(searchParams: CatalogSearchParams) {
  const params = new URLSearchParams()

  Object.entries(searchParams)
    .filter(([, value]) => typeof value !== 'undefined')
    .sort(([left], [right]) => left.localeCompare(right))
    .forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((entry) => params.append(key, entry))
        return
      }

      if (typeof value !== 'string') {
        return
      }

      params.set(key, value)
    })

  return params.toString()
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const [page, settings] = await Promise.all([getPageGlobal('catalog-page'), getSiteSettings()])

  return buildMetadata({
    meta: page.meta,
    settings,
    path: '/catalog',
    fallbackTitle: page.heading,
    fallbackDescription: page.description,
    noIndex: serializeSearchParams(resolvedSearchParams).length > 0,
  })
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>
}) {
  const resolvedSearchParams = await searchParams
  const payload = await getPayloadClient()
  const [dbProducts, page] = await Promise.all([
    getDbProducts(payload),
    getPageGlobal('catalog-page'),
  ])

  const queryKey = serializeSearchParams(resolvedSearchParams) || 'catalog'

  return (
    <CatalogClient
      key={queryKey}
      initialSearchParams={resolvedSearchParams}
      products={dbProducts}
      heading={page.heading}
      description={page.description}
    />
  )
}
