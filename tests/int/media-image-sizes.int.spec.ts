import sharp from 'sharp'
import { describe, expect, it } from 'vitest'

import { createMediaImageSizes } from '@/collections/Media/image-sizes'

const createLandscapeImage = () =>
  sharp({
    create: {
      width: 1200,
      height: 600,
      channels: 3,
      background: '#6b8e23',
    },
  })
    .png()
    .toBuffer()

describe('Media image sizes', () => {
  it('creates square versions when cropping is enabled', async () => {
    const input = await createLandscapeImage()
    const [size] = createMediaImageSizes(true)
    const { info } = await sharp(input)
      .resize({ width: size.width, height: size.height })
      .toBuffer({ resolveWithObject: true })

    expect(info.width).toBe(320)
    expect(info.height).toBe(320)
  })

  it('preserves the original aspect ratio when cropping is disabled', async () => {
    const input = await createLandscapeImage()
    const [size] = createMediaImageSizes(false)
    const { info } = await sharp(input)
      .resize({ width: size.width, height: size.height })
      .toBuffer({ resolveWithObject: true })

    expect(info.width).toBe(320)
    expect(info.height).toBe(160)
  })
})
