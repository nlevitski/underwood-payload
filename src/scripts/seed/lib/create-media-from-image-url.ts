import { faker } from '@faker-js/faker'
import { Payload } from 'payload'

export async function createMediaFromImageUrl(payload: Payload, imageURL: string) {
  try {
    const imageURL = faker.image.personPortrait({ size: 256 })
    const res = await fetch(imageURL)
    const arrBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrBuffer)

    const mimetype = res.headers.get('content-type') || 'image/jpeg'
    const filesize = buffer.length
    const filename = res.url.split('/').pop()?.split('?')[0]

    if (!filename) {
      throw new Error('Failed to extract filename')
    }
    const media = await payload.create({
      collection: 'media',
      draft: true,
      data: { alt: faker.lorem.words(3) },
      file: {
        data: buffer,
        name: filename,
        mimetype,
        size: filesize,
      },
    })
    return media
  } catch (error) {
    console.warn(`Failed to seed media file: ${error}`)
  }
}
