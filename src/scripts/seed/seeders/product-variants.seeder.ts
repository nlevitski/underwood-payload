import type { Payload } from 'payload'

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function sampleUnique<T>(items: T[], count: number): T[] {
  if (items.length <= count) {
    return [...items]
  }

  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = copy[i]
    copy[i] = copy[j]
    copy[j] = temp
  }

  return copy.slice(0, count)
}

export async function seedProductVariants(payload: Payload) {
  const [{ docs: items }, { docs: ages }, { docs: pots }] = await Promise.all([
    payload.find({
      collection: 'product-items',
      depth: 0,
      limit: 0,
      pagination: false,
    }),
    payload.find({
      collection: 'product-ages',
      depth: 0,
      limit: 0,
      pagination: false,
    }),
    payload.find({
      collection: 'pots',
      depth: 0,
      limit: 0,
      pagination: false,
    }),
  ])

  if (ages.length < 3) {
    throw new Error('Need at least 3 product ages to seed variants')
  }

  if (pots.length < 3) {
    throw new Error('Need at least 3 pots to seed variants')
  }

  for (const item of items) {
    if (typeof item.id !== 'number') {
      continue
    }

    const sampledAges = sampleUnique(ages, 3)
    const sampledPots = sampleUnique(pots, 3)

    for (const age of sampledAges) {
      if (typeof age.id !== 'number') {
        continue
      }

      for (const pot of sampledPots) {
        if (typeof pot.id !== 'number') {
          continue
        }

        await payload.create({
          collection: 'product-variants',
          draft: false,
          data: {
            item: item.id,
            age: age.id,
            pot: pot.id,
            price: randomInt(1, 99),
            stockQty: randomInt(0, 50),
            isAvailable: false,
          },
        })
      }
    }
  }
}
