import fs from 'fs/promises'
import path from 'path'
import { getPayload } from 'payload'

import config from '@payload-config'
import { createBlurDataUrl } from '@/collections/Media/hooks/generate-blur-data-url.hook'

async function backfillMediaBlurDataUrls() {
  const payload = await getPayload({ config })
  const uploadDir = path.resolve(process.cwd(), 'media')
  let updated = 0
  let failed = 0

  const { docs } = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 10_000,
    pagination: false,
    sort: 'id',
    where: {
      blurDataUrl: { exists: false },
    },
  })

  for (const media of docs) {
    if (!media.filename || !media.mimeType?.startsWith('image/')) {
      continue
    }

    try {
      const image = await fs.readFile(path.join(uploadDir, media.filename))
      const blurDataUrl = await createBlurDataUrl(image)

      await payload.update({
        collection: 'media',
        id: media.id,
        data: { blurDataUrl },
        overrideAccess: true,
      })

      updated += 1
    } catch (error) {
      failed += 1
      payload.logger.error({ err: error, msg: `Failed to backfill media ${media.id}` })
    }
  }

  payload.logger.info(`Media blur backfill complete: ${updated} updated, ${failed} failed`)
}

await backfillMediaBlurDataUrls()
process.exit(0)
