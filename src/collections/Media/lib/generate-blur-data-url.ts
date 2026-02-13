import type { Buffer } from 'node:buffer'
import { getPlaiceholder } from 'plaiceholder'

export function isEligibleForBlurDataURL(mime?: string | null) {
  return mime?.startsWith('image/') && mime !== 'image/svg+xml'
}

export async function generateBlurDataURL(buffer?: Buffer): Promise<string | null> {
  if (!buffer) {
    console.warn('Failed generate blur data URL: missing buffer')
    return null
  }

  const { base64 } = await getPlaiceholder(buffer)
  return base64
}
