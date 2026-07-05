import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
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
import { ProductItems } from './collections/ProductItems/config'
import { ProductVariants } from './collections/ProductVariants/config'
import { ProductItemAttributes } from './collections/ProductItemAttributes/config'
import { ProductAges } from './collections/ProductAges/config'
import { ProductSizes } from './collections/ProductSizes/config'
import { ProductVariantTypes } from './collections/ProductVariantTypes/config'
import { Articles } from './collections/Articles/config'
import { env } from './lib/env'
import { ArticleAuthors } from './collections/ArticleAuthors/config'
import { ProductPots } from './collections/ProductPots/config'
import { ProductItemCares } from './collections/ProductItemCares/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromAddress: env.SMTP_FROM_EMAIL,
    defaultFromName: 'Underwood',
    transportOptions: {
      host: env.SMTP_HOST,
      port: env.SMTP_EMAIL_PORT,
      secure: env.SMTP_EMAIL_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_API_KEY,
      },
    },
  }),
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
    ProductItemCares,
    ProductItemAttributes,
    ProductSizes,
    ProductAges,
    ProductPots,
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
      defaultToEmail: env.SMTP_TARGET_EMAIL,
    }),
  ],
})
