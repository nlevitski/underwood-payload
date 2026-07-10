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
import { env, getEmailEnvIfConfigured } from './lib/env'
import { ArticleAuthors } from './collections/ArticleAuthors/config'
import { ProductPots } from './collections/ProductPots/config'
import { ProductItemCares } from './collections/ProductItemCares/config'
import { GalleryImages } from './collections/GalleryImages/config'
import { HomepageCategoryCards } from './collections/HomepageCategoryCards/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const emailEnv = getEmailEnvIfConfigured()

export default buildConfig({
  ...(emailEnv
    ? {
        email: nodemailerAdapter({
          defaultFromAddress: emailEnv.SMTP_FROM_EMAIL,
          defaultFromName: 'Underwood',
          transportOptions: {
            host: emailEnv.SMTP_HOST,
            port: emailEnv.SMTP_EMAIL_PORT,
            secure: emailEnv.SMTP_EMAIL_PORT === 465,
            auth: {
              user: emailEnv.SMTP_USER,
              pass: emailEnv.SMTP_API_KEY,
            },
          },
        }),
      }
    : {}),
  admin: {
    user: Users.slug,
    suppressHydrationWarning: true,
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
    GalleryImages,
    HomepageCategoryCards,
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
      defaultToEmail: emailEnv?.SMTP_TARGET_EMAIL ?? 'info@underwood.by',
    }),
  ],
})
