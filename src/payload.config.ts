import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media/config'
import { ProductGroups } from './collections/ProductGroups/config'
import { ProductCategories } from './collections/ProductCategories/config'
import { ProductAttributes } from './collections/ProductAttributes/config'
import { ProductItems } from './collections/ProductItems/config'
import { ProductVariants } from './collections/ProductVariants/config'
import { ProductItemAttributes } from './collections/ProductItemAttributes/config'
import { ProductAges } from './collections/ProductAges/config'
import { Articles } from './collections/Articles/config'
import { env } from './lib/env'
import { ArticleAuthors } from './collections/ArticleAuthors/config'
import { Pots } from './collections/Pots/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    autoLogin: {
      email: env.CMS_SEED_ADMIN_EMAIL,
      password: env.CMS_SEED_ADMIN_PASSWORD,
    },
  },
  collections: [
    Users,
    Media,
    ProductGroups,
    ProductCategories,
    ProductAttributes,
    ProductAges,
    ProductItems,
    ProductVariants,
    ProductItemAttributes,
    Pots,
    Articles,
    ArticleAuthors,
  ],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
  }),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: env.DATABASE_URL,
    },
  }),
  sharp,
  plugins: [],
})
