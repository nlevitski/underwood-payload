import { maxContentSummaryLength } from '@/collections/Articles/constants'
import { faker } from '@faker-js/faker'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { Payload } from 'payload'
import { createMediaFromImageUrl } from '../lib/create-media-from-image-url'
import { slugify } from 'payload/shared'
import { statusOptions } from '@/collections/Articles/constants'

const articlesCount = 5

export async function seedArticles(payload: Payload) {
  let successCount = 0
  for (let i = 0; i < articlesCount; i++) {
    try {
      const imageURL = faker.image.urlPicsumPhotos()
      const image = await createMediaFromImageUrl(payload, imageURL)
      if (!image) {
        console.warn(`Stopped seeding article because no image was created`)
        return
      }
      const title = faker.lorem.sentence(5)
      const content = faker.lorem.paragraphs(3)
      const contentLexical = convertMarkdownToLexical({
        markdown: content,
        editorConfig: await editorConfigFactory.default({ config: payload.config }),
      })
      const status = faker.helpers.arrayElement(Object.values(statusOptions))
      await payload.create({
        collection: 'articles',
        data: {
          title,
          content: contentLexical,
          contentSummary: content.slice(0, maxContentSummaryLength),
          author: 1,
          coverImage: image.id,
          slug: slugify(title),
          status,
          ...(status === statusOptions.published
            ? { publishedAt: faker.date.recent().toISOString() }
            : {}),
        },
        draft: true,
      })
      successCount += 1
    } catch (error) {
      console.warn(`Failed to seed article: ${error}`)
    }
  }
  return successCount
}
