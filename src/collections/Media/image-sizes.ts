import type { ImageSize } from 'payload'

const MEDIA_IMAGE_WIDTHS = [
  { name: 'xs', width: 320 },
  { name: 's', width: 640 },
  { name: 'm', width: 960 },
  { name: 'l', width: 1600 },
  { name: 'xl', width: 2400 },
  { name: 'xxl', width: 3024 },
] as const

export const createMediaImageSizes = (cropToSquare: boolean): ImageSize[] =>
  MEDIA_IMAGE_WIDTHS.map(({ name, width }) => ({
    name,
    width,
    ...(cropToSquare ? { height: width } : {}),
    formatOptions: { format: 'webp', options: { quality: 85 } },
  }))
