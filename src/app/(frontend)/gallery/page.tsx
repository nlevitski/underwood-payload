import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import * as motion from 'motion/react-client'

import { getGalleryImages } from '@/collections/GalleryImages/fetchers'
import { getPayloadClient } from '@/lib/payload/client'

export const metadata: Metadata = {
  title: 'Фото питомника | Underwood',
  description: 'Галерея питомника Underwood: поля, контейнерные растения и отдельные культуры.',
}

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  const payload = await getPayloadClient()
  const images = await getGalleryImages(payload)

  return (
    <>
      <section className="bg-cream-dark py-12">
        <div className="container">
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Фото питомника</span>
          </nav>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Фото питомника</h1>
          <p className="mt-2 text-muted-foreground">Реальные фотографии наших полей и растений</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          {images.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
                  className={`overflow-hidden rounded-xl shadow-card ${
                    index === 0 ? 'aspect-[2.05/1] sm:col-span-2 lg:col-span-2' : 'aspect-square'
                  }`}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      placeholder={image.blurDataUrl ? 'blur' : 'empty'}
                      blurDataURL={image.blurDataUrl}
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes={
                        index === 0
                          ? '(max-width: 1024px) 100vw, 66vw'
                          : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      }
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-muted-foreground">Фотографии скоро появятся.</p>
          )}
        </div>
      </section>
    </>
  )
}
