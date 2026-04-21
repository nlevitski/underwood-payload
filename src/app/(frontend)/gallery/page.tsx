import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import * as motion from 'motion/react-client'

import heroImage from '@/assets/hero-nursery.jpg'
import nurseryRowsImage from '@/assets/nursery-rows.jpg'
import thujaImage from '@/assets/plant-thuja.jpg'
import blueberryImage from '@/assets/plant-blueberry.jpg'
import spruceImage from '@/assets/plant-spruce.jpg'
import raspberryImage from '@/assets/plant-raspberry.jpg'

export const metadata: Metadata = {
  title: 'Фото питомника | Underwood',
  description: 'Галерея питомника Underwood: поля, контейнерные растения и отдельные культуры.',
}

const images = [
  { src: heroImage, alt: 'Панорама питомника' },
  { src: nurseryRowsImage, alt: 'Ряды растений' },
  { src: thujaImage, alt: 'Туи в контейнерах' },
  { src: spruceImage, alt: 'Голубые ели' },
  { src: blueberryImage, alt: 'Голубика' },
  { src: raspberryImage, alt: 'Малина' },
]

export default function GalleryPage() {
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
          <p className="mt-2 text-muted-foreground">
            Реальные фотографии наших полей и растений... скоро будут загружены
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <motion.div
                key={image.alt}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`overflow-hidden rounded-xl shadow-card ${
                  index === 0 ? 'aspect-[2.05/1] sm:col-span-2 lg:col-span-2' : 'aspect-square'
                }`}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
