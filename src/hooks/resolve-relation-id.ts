export function resolveRelationId(value: unknown): number | null {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isInteger(parsed) ? parsed : null
  }

  if (value && typeof value === 'object' && 'id' in value) {
    const relationId = (value as { id?: unknown }).id
    if (typeof relationId === 'number') {
      return relationId
    }

    if (typeof relationId === 'string') {
      const parsed = Number(relationId)
      return Number.isInteger(parsed) ? parsed : null
    }
  }

  return null
}
