import type { CollectionConfig } from 'payload'
import decode from 'heic-decode'
import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

import { configureMediaImageSizesHook } from './hooks/configure-image-sizes.hook'
import { createMediaImageSizes } from './image-sizes'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },

  upload: {
    crop: true,
    imageSizes: createMediaImageSizes(true),
  },

  fields: [
    { name: 'alt', type: 'text', required: true },
    {
      name: 'cropToSquare',
      type: 'checkbox',
      defaultValue: true,
      label: 'Кадрировать до 1:1',
      admin: {
        description:
          'Включайте для карточек товаров. Если выключить, версии фото сохранят пропорции исходника.',
        position: 'sidebar',
      },
    },
  ],

  hooks: {
    beforeOperation: [
      configureMediaImageSizesHook,
      async ({ req, operation }) => {
        if (operation !== 'create' && operation !== 'update') return
        if (!req.file?.data || !req.file?.mimetype) return

        const isHeic = req.file.mimetype.includes('heic') || req.file.mimetype.includes('heif')

        if (!isHeic) return

        try {
          // Декодируем HEIC в сырые пиксели (быстро — без энкодинга)
          const { width, height, data } = await decode({ buffer: req.file.data })

          // Кодируем сразу в webp нативным энкодером sharp
          const webpBuffer = await sharp(Buffer.from(data), {
            raw: { width, height, channels: 4 },
          })
            .webp({ quality: 90 })
            .toBuffer()

          req.file.data = webpBuffer
          req.file.mimetype = 'image/webp'
          req.file.name = req.file.name.replace(/\.(heic|heif)$/i, '.webp')
          req.file.size = webpBuffer.byteLength
        } catch (e) {
          console.error('HEIC conversion failed:', e)
          throw new Error('Не удалось обработать HEIC-файл')
        }
      },
    ],

    afterChange: [
      async ({ collection, doc, previousDoc, req, operation, context }) => {
        // Пропускаем если хук уже запущен нами (защита от бесконечного цикла)
        if (context.skipMediaRegen) return

        // Пересоздаём версии, если изменилась фокальная точка или режим кадрирования.
        if (operation !== 'update') return
        const focalPointChanged =
          doc.focalX !== previousDoc?.focalX || doc.focalY !== previousDoc?.focalY
        const cropModeChanged =
          (doc.cropToSquare !== false) !== (previousDoc?.cropToSquare !== false)

        if (!focalPointChanged && !cropModeChanged) return

        // Если в этом же запросе уже был загружен новый файл — Payload и так
        // пересоздал размеры, повторно не нужно
        if (req.file?.data) return

        const filename = doc.filename as string | undefined
        if (!filename) return

        try {
          // Читаем оригинальный файл с диска
          const uploadDir =
            collection.upload &&
            typeof collection.upload === 'object' &&
            collection.upload.staticDir
              ? collection.upload.staticDir
              : path.resolve(process.cwd(), 'media')
          const filePath = path.join(uploadDir, filename)
          const fileBuffer = await fs.readFile(filePath)

          // Определяем mimetype по расширению файла
          const ext = path.extname(filename).toLowerCase()
          const mimeMap: Record<string, string> = {
            '.webp': 'image/webp',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.avif': 'image/avif',
          }
          const mimetype = mimeMap[ext] ?? 'application/octet-stream'

          // Пересоздаём размеры через payload.update с файлом в req
          // Используем overrideAccess: true — это серверная операция
          const regeneratedMedia = await req.payload.update({
            collection: 'media',
            id: doc.id,
            data: { cropToSquare: doc.cropToSquare !== false },
            file: {
              data: fileBuffer,
              mimetype,
              name: filename,
              size: fileBuffer.byteLength,
            },
            context: { ...context, skipMediaRegen: true },
            overrideAccess: true,
            req,
          })

          return regeneratedMedia
        } catch (e) {
          console.error('Media size regeneration failed:', e)
        }
      },
    ],
  },
}
