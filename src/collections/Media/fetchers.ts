import type { Payload } from 'payload'

export type MediaImageViewModel = {
  src: string
  blurDataUrl?: string
}

export async function getMediaImageByFilename(
  payload: Payload,
  filename: string,
): Promise<MediaImageViewModel | null> {
  const { docs } = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      filename: { equals: filename },
    },
  })

  const [media] = docs

  if (!media?.url) {
    return null
  }

  return {
    src: media.url,
    blurDataUrl: media.blurDataUrl ?? undefined,
  }
}
