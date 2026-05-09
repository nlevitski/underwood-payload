import type { PayloadRequest } from 'payload'
import { DEFAULT_POT_CODE } from '@/collections/ProductPots/constants'

export async function getDefaultPotId(req: PayloadRequest): Promise<number | null> {
  const result = await req.payload.find({
    collection: 'product-pots',
    where: {
      code: {
        equals: DEFAULT_POT_CODE,
      },
    },
    depth: 0,
    limit: 1,
    pagination: false,
    req,
  })

  const pot = result.docs[0]
  if (!pot || typeof pot.id !== 'number') {
    return null
  }

  return pot.id
}
