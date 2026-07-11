import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import * as motion from 'motion/react-client'

import { getGalleryImages } from '@/collections/GalleryImages/fetchers'
import { getPayloadClient } from '@/lib/payload/client'

export async function NurseryPhotos() {
  const payload = await getPayloadClient()
  const [previewImage] = await getGalleryImages(payload)

  return (
    <section className="py-20 bg-cream-dark">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-forest uppercase tracking-wide">
            Наш питомник
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Фото с полей</h2>
        </motion.div>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/gallery" className="block relative group overflow-hidden rounded-2xl">
              <div className="relative aspect-[21/9] w-full overflow-hidden">
                <Image
                  src={previewImage.src}
                  alt={previewImage.alt}
                  fill
                  placeholder={previewImage.blurDataUrl ? 'blur' : 'empty'}
                  blurDataURL={previewImage.blurDataUrl}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="100vw"
                />
              </div>
              <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background/90 backdrop-blur px-6 py-3 rounded-lg font-medium text-foreground shadow-card group-hover:bg-background transition-colors">
                  Смотреть галерею
                  <ArrowRight className="inline-block ml-2 h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
