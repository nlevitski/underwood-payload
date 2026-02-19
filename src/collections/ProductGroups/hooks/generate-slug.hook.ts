import { FieldHook } from 'payload'
import { slugify } from 'payload/shared'
import { ProductGroup } from '@/payload-types'

export const generateSlugHook: FieldHook<ProductGroup, string> = ({ value, data }) => {
  if (value) return slugify(value.trim()) || ''
  return slugify(data?.name?.trim() || '') || ''
}