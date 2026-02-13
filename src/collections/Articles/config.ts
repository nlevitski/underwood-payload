import type { CollectionConfig } from 'payload'
import { generateSlugHook } from './hooks/generate-slug.hook'
import { generateContentSummaryHook } from './hooks/generate-content-summary.hook'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

// fields
// - tags (optional, relationship to tags)
// - status (draft, published)
// - published_at (only visible when status is published)

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
      name: 'status',
      type: 'select',
      options: ['Draft', 'Published'],
      required: true,
      defaultValue: 'Draft',
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      admin: {
        condition: (data) => data?.status === 'Published',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
}
