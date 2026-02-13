export const maxContentSummaryLength = 160
export const statusOptions = {
  draft: 'Draft',
  published: 'Published',
} as const
export type StatusOptions = keyof typeof statusOptions
