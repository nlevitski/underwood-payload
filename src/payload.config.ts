import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media/config'
import { ProductGroups } from './collections/ProductGroups'
import { ProductCategories } from './collections/ProductCategories'
import { ProductAttributes } from './collections/ProductAttributes'
import { ProductItems } from './collections/ProductItems'
import { ProductItemAttributes } from './collections/ProductItemAttributes'
import { Articles } from './collections/Articles/config'
import { env } from './lib/env'
import { ArticleAuthors } from './collections/ArticleAuthors'

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
    ProductItems,
    ProductItemAttributes,
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
