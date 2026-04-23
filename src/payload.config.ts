import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
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
import { ProductSizes } from './collections/ProductSizes/config'
import { ProductVariantTypes } from './collections/ProductVariantTypes/config'
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
    ProductItems,
    ProductAttributes,
    ProductItemAttributes,
    ProductSizes,
    ProductAges,
    Pots,
    ProductVariantTypes,
    ProductVariants,
    Articles,
    ArticleAuthors,
    {
      slug: 'pages',
      fields: [],
    },
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
  plugins: [
    formBuilderPlugin({
      fields: {
        text: true,
        textarea: true,
        select: true,
        radio: true,
        email: true,
        state: true,
        country: true,
        checkbox: true,
        number: true,
        message: true,
        date: false,
        payment: false,
      },
      defaultToEmail: 'info@underwood.by',
    }),
  ],
})
