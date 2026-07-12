import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
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
import { HomepagePopularPlants } from './collections/HomepagePopularPlants/config'
import { backfillHomepagePopularPlantHierarchy } from './collections/HomepagePopularPlants/backfill-hierarchy'
import { SiteSettings } from './globals/SiteSettings'
import {
  AboutPage,
  BlogPage,
  CatalogPage,
  ContactsPage,
  GalleryPage,
  Homepage,
} from './globals/pageGlobals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const emailEnv = getEmailEnvIfConfigured()
const siteURL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://underwood.by').replace(/\/$/, '')

const globalPaths: Record<string, string> = {
  homepage: '/',
  'about-page': '/about',
  'catalog-page': '/catalog',
  'blog-page': '/blog',
  'gallery-page': '/gallery',
  'contacts-page': '/contacts',
}

export default buildConfig({
  onInit: backfillHomepagePopularPlantHierarchy,
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
    HomepagePopularPlants,
    Articles,
    ArticleAuthors,
  ],
  globals: [SiteSettings, Homepage, AboutPage, CatalogPage, BlogPage, GalleryPage, ContactsPage],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
  }),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    // The project deploys a verified SQLite snapshot. Automatic dev pushes can race
    // across Next.js workers and attempt to recreate existing indexes.
    push: false,
    client: {
      url: env.DATABASE_URL,
    },
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['articles', 'product-items'],
      globals: [
        'homepage',
        'about-page',
        'catalog-page',
        'blog-page',
        'gallery-page',
        'contacts-page',
      ],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => {
        const title = doc?.title ?? doc?.nameRu ?? doc?.heading

        return title ? `${title} | Underwood` : 'Underwood'
      },
      generateDescription: ({ doc }) =>
        doc?.contentSummary ?? doc?.description ?? 'Питомник растений Underwood в Беларуси.',
      generateImage: ({ doc }) => {
        const image = doc?.coverImage ?? doc?.heroImage

        return typeof image === 'object' && image !== null ? image.id : (image ?? '')
      },
      generateURL: ({ collectionConfig, doc, globalConfig }) => {
        if (collectionConfig?.slug === 'articles') {
          return `${siteURL}/blog/${doc?.slug ?? ''}`
        }

        if (collectionConfig?.slug === 'product-items') {
          return `${siteURL}/catalog/${doc?.slug ?? ''}`
        }

        return `${siteURL}${globalPaths[globalConfig?.slug ?? ''] ?? '/'}`
      },
    }),
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
