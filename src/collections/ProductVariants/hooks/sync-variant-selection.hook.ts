import { APIError, type CollectionBeforeValidateHook } from 'payload'
import { resolveRelationId } from '@/hooks/resolve-relation-id'

type VariantType = 'none' | 'size' | 'age'

function getVariantType(data: Record<string, unknown> | undefined, originalDoc: Record<string, unknown> | undefined, operation: 'create' | 'update'): VariantType {
  const value = data?.variantType ?? (operation === 'update' ? originalDoc?.variantType : undefined)

  if (value === 'size' || value === 'age') {
    return value
  }

  return 'none'
}

export const syncVariantSelectionHook: CollectionBeforeValidateHook = async ({
  data,
  operation,
  originalDoc,
}) => {
  const variantType = getVariantType(data as Record<string, unknown> | undefined, originalDoc as Record<string, unknown> | undefined, operation)
  const ageId = resolveRelationId(data?.age) ?? (operation === 'update' ? resolveRelationId(originalDoc?.age) : null)
  const sizeId = resolveRelationId(data?.size) ?? (operation === 'update' ? resolveRelationId(originalDoc?.size) : null)

  if (variantType === 'none') {
    return {
      ...data,
      age: null,
      size: null,
    }
  }

  if (variantType === 'age') {
    if (!ageId) {
      throw new APIError('Age is required for age variants', 400)
    }

    return {
      ...data,
      size: null,
    }
  }

  if (!sizeId) {
    throw new APIError('Size is required for size variants', 400)
  }

  return {
    ...data,
    age: null,
  }
}
