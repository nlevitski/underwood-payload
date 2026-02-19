import type { Payload } from 'payload'

type ProductAgeSeed = {
  label: string
  months: number
}

const ages: ProductAgeSeed[] = [
  { label: '3 месяца', months: 3 },
  { label: '6 месяцев', months: 6 },
  { label: '9 месяцев', months: 9 },
  { label: '1 год', months: 12 },
  { label: '2 года', months: 24 },
  { label: '3 года', months: 36 },
  { label: '4 года', months: 48 },
  { label: '5 лет', months: 60 },
  { label: '6 лет', months: 72 },
  { label: '7 лет', months: 84 },
  { label: '8 лет', months: 96 },
  { label: '9 лет', months: 108 },
  { label: '10 лет', months: 120 },
]

export async function seedProductAges(payload: Payload) {
  await Promise.all(
    ages.map((age) =>
      payload.create({
        collection: 'product-ages',
        data: age,
      }),
    ),
  )
}
