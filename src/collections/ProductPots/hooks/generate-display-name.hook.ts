import type { FieldHook } from 'payload'

export const generateDisplayNameHook: FieldHook = ({ data, value }) => {
  const code = data?.code
  const volumeLiters = data?.volumeLiters
  const diameterMinCm = data?.diameterMinCm
  const diameterMaxCm = data?.diameterMaxCm
  const heightMinCm = data?.heightMinCm
  const heightMaxCm = data?.heightMaxCm

  if (
    !code ||
    typeof volumeLiters !== 'number' ||
    typeof diameterMinCm !== 'number' ||
    typeof diameterMaxCm !== 'number' ||
    typeof heightMinCm !== 'number' ||
    typeof heightMaxCm !== 'number'
  ) {
    return value
  }

  return `${code} (${volumeLiters}L, ${diameterMinCm}-${diameterMaxCm}x${heightMinCm}-${heightMaxCm} cm)`
}
