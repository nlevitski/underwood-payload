import { CollectionConfig } from 'payload'

export const ArticleAuthors: CollectionConfig = {
  slug: 'article-authors',
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
      options: ['Staff writer', 'Guest writer', 'Editor'],
      defaultValue: 'Staff writer',
      required: true,
    },
  ],
}
