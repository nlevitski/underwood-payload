import { CollectionConfig } from 'payload'
import { ArticleAuthorRoleOptions } from './constants'

export const ArticleAuthors: CollectionConfig = {
  slug: 'article-authors',
  admin: { useAsTitle: 'name' },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: Object.values(ArticleAuthorRoleOptions),
      defaultValue: ArticleAuthorRoleOptions.staffWriter,
      required: true,
    },
  ],
}
