import { APIError, type CollectionBeforeChangeHook } from 'payload'

type EditorRow = {
  attribute?: unknown
  label?: string
  value?: string
}

function hasValue(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

export const validateItemAttributesEditorHook: CollectionBeforeChangeHook = ({ data }) => {
  const rows = (data as { itemAttributes?: unknown } | undefined)?.itemAttributes
  if (!Array.isArray(rows)) {
    return data
  }

  rows.forEach((rawRow, index) => {
    const row = rawRow as EditorRow
    if (!row.attribute) {
      throw new APIError(`Row ${index + 1} requires attribute.`, 400)
    }

    if (!hasValue(row.value)) {
      throw new APIError(`Row ${index + 1} requires value.`, 400)
    }
  })

  return data
}
