import type { CollectionConfig } from 'payload'
import { generateSlugHook } from './hooks/generate-slug.hook'
import { generateContentSummaryHook } from './hooks/generate-content-summary.hook'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import { statusOptions } from './constants'

// fields
// - tags (optional, relationship to tags)

// - created_at (auto-generated)
// - updated_at (auto-generated)

export const Articles: CollectionConfig = {
  slug: 'articles',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [generateSlugHook],
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'contentSummary',
      type: 'textarea',
      required: true,
      hooks: {
        beforeValidate: [generateContentSummaryHook],
      },
    },
    {
      name: 'readTimeInMins',
      type: 'number',
      defaultValue: 0,
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            // ensure that data is not stored in DB
            delete siblingData?.readTimeInMins
          },
        ],
        afterRead: [
          ({ data }) => {
            const text = convertLexicalToPlaintext({ data: data?.content })
            const wordsPerMinute = 200
            const words = text.trim().split(/\s+/).length
            return Math.max(1, Math.ceil(words / wordsPerMinute))
          },
        ],
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'article-authors',
      required: true,
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      defaultValue: 'Статья',
    },
    {
      name: 'status',
      type: 'select',
      options: Object.values(statusOptions),
      required: true,
      defaultValue: statusOptions.draft,
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      admin: {
        condition: (data) => data?.status === statusOptions.published,
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
}
