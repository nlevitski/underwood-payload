export const ArticleAuthorRoleOptions = {
  staffWriter: 'Staff writer',
  guestWriter: 'Guest writer',
  editor: 'Editor',
} as const
export type ArticleAuthorRoleOptions = keyof typeof ArticleAuthorRoleOptions
