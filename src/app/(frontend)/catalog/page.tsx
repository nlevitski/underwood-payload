import { CatalogClient } from './CatalogClient'

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

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>
}) {
  const resolvedSearchParams = await searchParams
  const queryKey = serializeSearchParams(resolvedSearchParams) || 'catalog'

  return <CatalogClient key={queryKey} initialSearchParams={resolvedSearchParams} />
}
