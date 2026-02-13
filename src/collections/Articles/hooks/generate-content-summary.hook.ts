import { FieldHook } from 'payload'
import { Article } from '@/payload-types'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

const maxContentSummaryLength = 160
export const generateContentSummaryHook: FieldHook<Article, string> = ({ value, data }) => {
  if (value) {
    return value.trim()
  }
  if (!data?.content) return ''
  const text = convertLexicalToPlaintext({ data: data?.content }).trim()
  if (!text) return ''

  return text.length > maxContentSummaryLength
    ? `${text.slice(0, maxContentSummaryLength - 3)}...`
    : text
}
