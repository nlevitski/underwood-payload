import fs from 'fs/promises'
import path from 'path'

import type { Payload } from 'payload'

const cards = [
  {
    groupSlug: 'conifers',
    title: 'Хвойные',
    description: 'Туи, ели, сосны и можжевельники',
    image: 'catalog-conifers-smaragd.png',
    categorySlugs: ['thuja', 'pine', 'juniper'],
  },
  {
    groupSlug: 'berries',
    title: 'Ягодные',
    description: 'Голубика, малина, клюква и брусника',
    image: 'catalog-berries-blueberry-v4.png',
    categorySlugs: ['blueberry', 'raspberry', 'blackberry', 'lingonberry'],
  },
  {
    groupSlug: 'foliage',
    title: 'Лиственные',
    description: 'Декоративные кустарники и деревья',
    image: 'catalog-foliage.png',
    categorySlugs: ['ninebark', 'dogwood'],
  },
  {
    groupSlug: 'perennials',
    title: 'Многолетние',
    description: 'Пионы, хосты, астильбы и другие садовые многолетники',
    image: 'catalog-perennials.png',
    categorySlugs: [],
  },
] as const

async function createCardImage(payload: Payload, filename: string, alt: string) {
  const filePath = path.resolve(process.cwd(), 'src', 'assets', filename)
  const data = await fs.readFile(filePath)

  return payload.create({
    collection: 'media',
    data: {
      alt,
      cropToSquare: false,
    },
    file: {
      data,
      name: filename,
      mimetype: 'image/png',
      size: data.byteLength,
    },
  })
}

export async function seedHomepageCategoryCards(payload: Payload) {
  const [{ docs: groups }, { docs: categories }] = await Promise.all([
    payload.find({
      collection: 'product-groups',
      depth: 0,
      limit: 0,
      pagination: false,
    }),
    payload.find({
      collection: 'product-categories',
      depth: 0,
      limit: 0,
      pagination: false,
    }),
  ])

  for (const [sortOrder, card] of cards.entries()) {
    const group = groups.find(({ slug }) => slug === card.groupSlug)
    if (!group) {
      throw new Error(`Cannot seed homepage card: group "${card.groupSlug}" was not found`)
    }

    const selectedCategories = card.categorySlugs.map((slug) => {
      const category = categories.find(
        (candidate) => candidate.slug === slug && candidate.group === group.id,
      )

      if (!category) {
        throw new Error(
          `Cannot seed homepage card: category "${slug}" was not found in group "${card.groupSlug}"`,
        )
      }

      return category.id
    })

    const image = await createCardImage(payload, card.image, card.title)

    await payload.create({
      collection: 'homepage-category-cards',
      data: {
        title: card.title,
        description: card.description,
        image: image.id,
        group: group.id,
        categories: selectedCategories,
        sortOrder,
      },
    })
  }
}
