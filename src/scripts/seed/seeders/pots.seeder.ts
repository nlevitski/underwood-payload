import type { Payload } from 'payload'
import { DEFAULT_POT_CODE } from '@/collections/Pots/constants'

type PotSeed = {
  code: string
  volumeLiters: number
  diameterMinCm: number
  diameterMaxCm: number
  heightMinCm: number
  heightMaxCm: number
}

const pots: PotSeed[] = [
  {
    code: DEFAULT_POT_CODE,
    volumeLiters: 0,
    diameterMinCm: 0,
    diameterMaxCm: 0,
    heightMinCm: 0,
    heightMaxCm: 0,
  },
  {
    code: 'P9',
    volumeLiters: 0.5,
    diameterMinCm: 8.5,
    diameterMaxCm: 9.5,
    heightMinCm: 8.5,
    heightMaxCm: 10,
  },
  {
    code: 'C1',
    volumeLiters: 1,
    diameterMinCm: 10,
    diameterMaxCm: 14,
    heightMinCm: 10,
    heightMaxCm: 14,
  },
  {
    code: 'C2',
    volumeLiters: 2,
    diameterMinCm: 13,
    diameterMaxCm: 17,
    heightMinCm: 12,
    heightMaxCm: 17,
  },
  {
    code: 'C3',
    volumeLiters: 3,
    diameterMinCm: 15,
    diameterMaxCm: 19,
    heightMinCm: 14,
    heightMaxCm: 20,
  },
  {
    code: 'C5',
    volumeLiters: 5,
    diameterMinCm: 18,
    diameterMaxCm: 23,
    heightMinCm: 17,
    heightMaxCm: 24,
  },
  {
    code: 'C7',
    volumeLiters: 7,
    diameterMinCm: 20,
    diameterMaxCm: 25,
    heightMinCm: 19,
    heightMaxCm: 27,
  },
  {
    code: 'C10',
    volumeLiters: 10,
    diameterMinCm: 23,
    diameterMaxCm: 28,
    heightMinCm: 22,
    heightMaxCm: 30,
  },
  {
    code: 'C15',
    volumeLiters: 15,
    diameterMinCm: 26,
    diameterMaxCm: 33,
    heightMinCm: 24,
    heightMaxCm: 34,
  },
  {
    code: 'C20',
    volumeLiters: 20,
    diameterMinCm: 30,
    diameterMaxCm: 36,
    heightMinCm: 28,
    heightMaxCm: 38,
  },
  {
    code: 'C25',
    volumeLiters: 25,
    diameterMinCm: 32,
    diameterMaxCm: 40,
    heightMinCm: 30,
    heightMaxCm: 42,
  },
  {
    code: 'C35',
    volumeLiters: 35,
    diameterMinCm: 36,
    diameterMaxCm: 46,
    heightMinCm: 34,
    heightMaxCm: 48,
  },
]

export async function seedPots(payload: Payload) {
  for (const pot of pots) {
    const existing = await payload.find({
      collection: 'pots',
      where: {
        code: {
          equals: pot.code,
        },
      },
      depth: 0,
      limit: 1,
      pagination: false,
    })

    const existingPot = existing.docs[0]
    if (existingPot && typeof existingPot.id === 'number') {
      await payload.update({
        collection: 'pots',
        id: existingPot.id,
        data: pot,
      })
      continue
    }

    await payload.create({
      collection: 'pots',
      draft: false,
      data: pot,
    })
  }
}
