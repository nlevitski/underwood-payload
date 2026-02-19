import { maxContentSummaryLength } from '@/collections/Articles/constants'
import { faker } from '@faker-js/faker'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { Payload } from 'payload'
import { createMediaFromImageUrl } from '../lib/create-media-from-image-url'
import { slugify } from 'payload/shared'
import { statusOptions } from '@/collections/Articles/constants'

const articlesCount = 5
const articleSeedConcurrency = 3

export async function seedArticles(payload: Payload, authorID: number) {
  const editorConfig = await editorConfigFactory.default({ config: payload.config })

  const seedOneArticle = async () => {
    try {
      const imageURL = faker.image.urlPicsumPhotos()
      const image = await createMediaFromImageUrl(payload, imageURL)
      if (!image) {
        console.warn('Stopped seeding article because no image was created')
        return false
      }
      const title = faker.lorem.sentence(5)
      const content = faker.lorem.paragraphs(3)
      const contentLexical = convertMarkdownToLexical({
        markdown: content,
        editorConfig,
      })
      const status = faker.datatype.boolean()
        ? statusOptions.published
        : statusOptions.draft
      await payload.create({
        collection: 'articles',
        data: {
          title,
          content: contentLexical,
          contentSummary: content.slice(0, maxContentSummaryLength),
          author: authorID,
          coverImage: image.id,
          slug: slugify(title),
          status,
          ...(status === statusOptions.published
            ? { publishedAt: faker.date.recent().toISOString() }
            : {}),
        },
        draft: true,
      })
      return true
    } catch (error) {
      console.warn(`Failed to seed article: ${error}`)
      return false
    }
  }

  const tasks = Array.from({ length: articlesCount }, () => seedOneArticle)
  const results: boolean[] = []

  for (let i = 0; i < tasks.length; i += articleSeedConcurrency) {
    const batch = tasks.slice(i, i + articleSeedConcurrency)
    const batchResults = await Promise.all(batch.map((task) => task()))
    results.push(...batchResults)
  }

  return results.filter(Boolean).length
}
