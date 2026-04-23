import 'dotenv/config'
import { seedAdmin } from './seeders/admin.seeder'
import { getPayloadClient } from '@/lib/payload/client'
import { seedArticleAuthor } from './seeders/article-author.seeder'
import { seedArticles } from './seeders/article.seeder'
import { resetSeedData } from './lib/reset-seed-data'
import { seedProductGroups } from './seeders/product-groups.seeder'
import { seedProductCategories } from './seeders/product-categories.seeder'
import { seedPots } from './seeders/pots.seeder'
import { seedProductAttributes } from './seeders/product-attributes.seeder'
import { seedProductAges } from './seeders/product-ages.seeder'
import { seedProductSizes } from './seeders/product-sizes.seeder'
import { seedProductItems } from './seeders/product-items.seeder'
import { seedProductVariantTypes } from './seeders/product-variant-types.seeder'
import { seedProductVariants } from './seeders/product-variants.seeder'
import { seedProductItemAttributes } from './seeders/product-item-attributes.seeder'

process.env.PAYLOAD_MIGRATING ??= process.env.SEED_DISABLE_SCHEMA_PUSH === 'true' ? 'true' : 'false'
if (process.env.NODE_ENV !== 'production') {
  process.env.PAYLOAD_DROP_DATABASE ??=
    process.env.SEED_DROP_DATABASE === 'false' ? 'false' : 'true'
}

async function main() {
  const payload = await getPayloadClient()
  try {
    await resetSeedData(payload)
    await seedAdmin(payload)
    const author = await seedArticleAuthor(payload)
    if (!author) {
      throw new Error('Seed failed: article author was not created')
    }
    if (typeof author.id !== 'number') {
      throw new Error(`Seed failed: expected numeric author id, got ${typeof author.id}`)
    }
    await seedArticles(payload, author.id)
    await seedProductGroups(payload)
    await seedProductCategories(payload)
    await seedProductAttributes(payload)
    await Promise.all([
      seedProductAges(payload),
      seedProductSizes(payload),
      seedProductVariantTypes(payload),
      seedPots(payload),
    ])

    await seedProductItems(payload)
    await seedProductItemAttributes(payload)
    await seedProductVariants(payload)
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

void main()
