import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import sharp from 'sharp'

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  try {
    const { user } = await payload.auth({ headers: req.headers })

    if (!user || user.collection !== 'users') {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'missing id' }, { status: 400 })
    }

    const media = await payload.findByID({
      collection: 'media',
      id,
      overrideAccess: false,
      user,
    })

    if (!media?.url) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }

    const res = await fetch(media.url)
    const buffer = Buffer.from(await res.arrayBuffer())

    const sizes = [
      { name: 'xs', size: 320 },
      { name: 's', size: 640 },
      { name: 'm', size: 960 },
      { name: 'l', size: 1600 },
      { name: 'xl', size: 2400 },
    ]

    await Promise.all(
      sizes.map(async (s) => {
        const out = await sharp(buffer)
          .resize({
            width: s.size,
            height: s.size,
            fit: 'cover',
            position: 'centre',
          })
          .webp({ quality: 85 })
          .toBuffer()

        return out
      }),
    )

    return NextResponse.json({ ok: true })
  } catch (e) {
    payload.logger.error({ err: e, msg: 'Media rebuild failed' })

    return NextResponse.json({ error: 'rebuild failed' }, { status: 500 })
  }
}
