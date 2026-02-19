import { APIError, type CollectionBeforeDeleteHook } from 'payload'
import { DEFAULT_POT_CODE } from '../constants'

export const preventDefaultPotDeleteHook: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const pot = await req.payload.findByID({
    collection: 'pots',
    id,
    depth: 0,
    req,
  })

  if (pot.code === DEFAULT_POT_CODE) {
    throw new APIError('Default pot cannot be deleted', 400)
  }
}
