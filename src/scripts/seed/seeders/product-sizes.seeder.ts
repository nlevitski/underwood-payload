import type { Payload } from 'payload'
import { sizeTypes } from '@/collections/ProductSizes/constants'

export async function seedProductSizes(payload: Payload) {
  await Promise.all(
    sizeTypes.map((label) =>
      payload.create({
        collection: 'product-sizes',
        data: {
          label,
        },
      }),
    ),
  )
}
