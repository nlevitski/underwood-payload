import type { Payload } from 'payload'

import type { Media } from '@/payload-types'

export type GalleryImageViewModel = {
  id: number
  src: string
  alt: string
  width: number
  height: number
}

function isMedia(value: number | Media): value is Media {
  return typeof value === 'object' && value !== null
}

export async function getGalleryImages(payload: Payload): Promise<GalleryImageViewModel[]> {
  const { docs } = await payload.find({
    collection: 'gallery-images',
    depth: 1,
    limit: 100,
    pagination: false,
    sort: 'sortOrder',
  })

  return docs.flatMap(({ id, image }) => {
    if (!isMedia(image) || !image.url || !image.width || !image.height) {
      return []
    }

    return [
      {
        id,
        src: image.url,
        alt: image.alt,
        width: image.width,
        height: image.height,
      },
    ]
  })
}
