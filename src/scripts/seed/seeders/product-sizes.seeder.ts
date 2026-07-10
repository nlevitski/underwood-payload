import type { Payload } from 'payload'
import { defaultProductSizes } from '@/collections/ProductSizes/constants'

export async function seedProductSizes(payload: Payload) {
  await Promise.all(
    defaultProductSizes.map((label) =>
      payload.create({
        collection: 'product-sizes',
        data: {
          label,
        },
      }),
    ),
  )
}
