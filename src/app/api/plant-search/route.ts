import { getPayloadClient } from '@/lib/payload/client'
import { getDbProducts } from '@/app/(frontend)/catalog/dbProducts'
import { MAX_SEARCH_LENGTH, prepareSearchResults } from '@/app/(frontend)/search/searchResults'

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const query = params.get('q') ?? ''
  const limit = Number(params.get('limit') ?? 4)
  if (query.length > MAX_SEARCH_LENGTH || !Number.isInteger(limit) || limit < 1 || limit > 4) {
    return Response.json({ error: 'Некорректный запрос' }, { status: 400 })
  }
  if (!query.trim()) return Response.json(prepareSearchResults([], ''))
  try {
    const payload = await getPayloadClient()
    const products = await getDbProducts(payload, { searchPreview: true })
    return Response.json(prepareSearchResults(products, query, limit), {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('Plant search failed', error)
    return Response.json({ error: 'Не удалось загрузить растения' }, { status: 500 })
  }
}
