import type { CollectionBeforeChangeHook } from 'payload'

export const syncAvailabilityHook: CollectionBeforeChangeHook = ({ data, operation, originalDoc }) => {
  const stockFromData = data?.stockQty
  const stockFromDoc = operation === 'update' ? originalDoc?.stockQty : undefined
  const stockQty = typeof stockFromData === 'number' ? stockFromData : (stockFromDoc ?? 0)

  return {
    ...data,
    isAvailable: stockQty > 0,
  }
}
