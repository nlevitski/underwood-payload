import type { CollectionBeforeOperationHook } from 'payload'

import { createMediaImageSizes } from '../image-sizes'

type MediaOperationArgs = {
  collection: {
    config: {
      upload?: false | Record<string, unknown>
      [key: string]: unknown
    }
    [key: string]: unknown
  }
  data?: {
    cropToSquare?: unknown
  }
  duplicateFromID?: number | string
  id?: number | string
}

const getCropPreference = async ({
  args,
  operation,
  req,
}: {
  args: MediaOperationArgs
  operation: 'create' | 'update'
  req: Parameters<CollectionBeforeOperationHook<'media'>>[0]['req']
}): Promise<boolean> => {
  if (typeof args.data?.cropToSquare === 'boolean') {
    return args.data.cropToSquare
  }

  const sourceID = operation === 'update' ? args.id : args.duplicateFromID

  if (sourceID !== undefined) {
    const existingMedia = await req.payload.findByID({
      collection: 'media',
      id: sourceID,
      depth: 0,
      overrideAccess: false,
      req,
      select: { cropToSquare: true },
    })

    return existingMedia.cropToSquare !== false
  }

  // Старые записи без поля и новые загрузки сохраняют прежнее поведение.
  return true
}

export const configureMediaImageSizesHook = (async ({
  args: incomingArgs,
  operation,
  req,
}: Parameters<CollectionBeforeOperationHook<'media'>>[0]) => {
  if (operation !== 'create' && operation !== 'update') return

  const args = incomingArgs as unknown as MediaOperationArgs
  const upload = args.collection.config.upload

  if (!upload) return

  const cropToSquare = await getCropPreference({ args, operation, req })

  return {
    ...incomingArgs,
    collection: {
      ...incomingArgs.collection,
      config: {
        ...incomingArgs.collection.config,
        upload: {
          ...upload,
          imageSizes: createMediaImageSizes(cropToSquare),
        },
      },
    },
  }
}) as CollectionBeforeOperationHook<'media'>
