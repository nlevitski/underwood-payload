import 'dotenv/config'
import { seedAdmin } from './seeders/admin.seeder'
import { getPayloadClient } from '@/lib/payload/client'
import { seedArticleAuthor } from './seeders/article-author.seeder'
import { seedArticles } from './seeders/article.seeder'

process.env.PAYLOAD_MIGRATING ??= 'true'

async function main() {
  const payload = await getPayloadClient()
  try {
    await seedAdmin(payload)
    await seedArticleAuthor(payload)
    await seedArticles(payload)
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

void main()
