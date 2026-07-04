import { NextResponse } from 'next/server'
import sharp from 'sharp'
import payload from 'payload'

export async function POST(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'missing id' }, { status: 400 })
    }

    const media = await payload.findByID({
      collection: 'media',
      id,
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
      })
    )

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)

    return NextResponse.json(
      { error: 'rebuild failed' },
      { status: 500 }
    )
  }
}