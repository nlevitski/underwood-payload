import type { CollectionConfig } from 'payload'
import decode from 'heic-decode'
import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },

  upload: {
    crop: true,
    imageSizes: [
      { name: 'xs', width: 320, height: 320, formatOptions: { format: 'webp', options: { quality: 85 } } },
      { name: 's', width: 640, height: 640, formatOptions: { format: 'webp', options: { quality: 85 } } },
      { name: 'm', width: 960, height: 960, formatOptions: { format: 'webp', options: { quality: 85 } } },
      { name: 'l', width: 1600, height: 1600, formatOptions: { format: 'webp', options: { quality: 85 } } },
      { name: 'xl', width: 2400, height: 2400, formatOptions: { format: 'webp', options: { quality: 85 } } },
      { name: 'xxl', width: 3024, height: 3024, formatOptions: { format: 'webp', options: { quality: 85 } } },
    ],
  },

  fields: [{ name: 'alt', type: 'text', required: true }],

  hooks: {
    beforeOperation: [
      async ({ req, operation }) => {
        if (operation !== 'create' && operation !== 'update') return
        if (!req.file?.data || !req.file?.mimetype) return

        const isHeic =
          req.file.mimetype.includes('heic') || req.file.mimetype.includes('heif')

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
      async ({ doc, previousDoc, req, operation, context }) => {
        // Пропускаем если хук уже запущен нами (защита от бесконечного цикла)
        if (context.skipFocalRegen) return

        // Только при обновлении и только если фокальная точка изменилась
        if (operation !== 'update') return
        if (doc.focalX === previousDoc?.focalX && doc.focalY === previousDoc?.focalY) return

        // Если в этом же запросе уже был загружен новый файл — Payload и так
        // пересоздал размеры, повторно не нужно
        if (req.file?.data) return

        const filename = doc.filename as string | undefined
        if (!filename) return

        try {
          // Читаем оригинальный файл с диска
          const uploadDir = path.resolve(process.cwd(), 'media')
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
          await req.payload.update({
            collection: 'media',
            id: doc.id,
            data: {},
            file: {
              data: fileBuffer,
              mimetype,
              name: filename,
              size: fileBuffer.byteLength,
            },
            context: { skipFocalRegen: true },
            req,
          })
        } catch (e) {
          console.error('Focal point regeneration failed:', e)
        }
      },
    ],
  },
}