import type { CollectionBeforeChangeHook } from 'payload'
import sharp from 'sharp'

const BLUR_PREVIEW_WIDTH = 24

export async function createBlurDataUrl(image: Buffer) {
  const preview = await sharp(image)
    .rotate()
    .resize({
      width: BLUR_PREVIEW_WIDTH,
      withoutEnlargement: true,
    })
    .webp({ quality: 30 })
    .toBuffer()

  return `data:image/webp;base64,${preview.toString('base64')}`
}

export const generateBlurDataUrlHook: CollectionBeforeChangeHook = async ({ data, req }) => {
  const file = req.file

  if (!file?.data || !file.mimetype.startsWith('image/')) {
    return data
  }

  try {
    data.blurDataUrl = await createBlurDataUrl(file.data)
  } catch (error) {
    console.warn('Blur preview generation failed:', error)
  }

  return data
}
