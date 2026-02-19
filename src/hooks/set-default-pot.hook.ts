import type { FieldHook } from 'payload'
import { getDefaultPotId } from './get-default-pot-id'

export const setDefaultPotHook: FieldHook = async ({ req, value }) => {
  if (value) {
    return value
  }

  if (!req) {
    return value
  }

  const defaultPotId = await getDefaultPotId(req)
  return defaultPotId ?? value
}
