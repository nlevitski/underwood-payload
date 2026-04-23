import type { Payload } from 'payload'

export async function seedProductVariantTypes(payload: Payload) {
  await Promise.all(
    [{ type: 'none' }, { type: 'size' }, { type: 'age' }].map((type) =>
      payload.create({
        collection: 'product-variant-types',
        data: type,
      }),
    ),
  )
}
