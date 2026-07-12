'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { A11y } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'

import 'swiper/css'
import './product-image-slider.css'

type SliderImage = {
  id: number
  url: string
  alt?: string
  blurDataUrl?: string
}

type ProductImageSliderProps = {
  images: SliderImage[]
  fallbackImage: string
  productName: string
  priority?: boolean
  imageLoading?: 'eager' | 'lazy'
  sizes: string
  compact?: boolean
  href?: string
}

export function ProductImageSlider({
  images,
  fallbackImage,
  productName,
  priority = false,
  imageLoading = 'lazy',
  sizes,
  compact = false,
  href,
}: ProductImageSliderProps) {
  const router = useRouter()
  const swiperRef = useRef<SwiperInstance | null>(null)
  const [lockedIndex, setLockedIndex] = useState(0)
  const [visibleIndex, setVisibleIndex] = useState(0)
  const slides = images.length > 0 ? images : [{ id: -1, url: fallbackImage, alt: productName }]
  const slideKey = slides.map((image) => image.id).join(':')

  useEffect(() => {
    setLockedIndex(0)
    setVisibleIndex(0)

    const swiper = swiperRef.current
    if (!swiper || swiper.destroyed) return

    requestAnimationFrame(() => {
      if (swiper.destroyed) return
      swiper.update()
      swiper.slideTo(0, 0, false)
    })
  }, [slideKey])

  const preview = (index: number) => {
    swiperRef.current?.slideTo(index)
    setVisibleIndex(index)
  }

  const lock = (index: number) => {
    setLockedIndex(index)
    preview(index)
  }

  const restoreLockedSlide = () => preview(lockedIndex)

  return (
    <div
      className="relative h-full w-full [overflow-anchor:none]"
      onMouseLeave={slides.length > 1 ? restoreLockedSlide : undefined}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) restoreLockedSlide()
      }}
      onClick={() => {
        if (href && swiperRef.current?.allowClick !== false) router.push(href)
      }}
    >
      <Swiper
        key={slideKey}
        modules={[A11y]}
        slidesPerView={1}
        resistanceRatio={0.65}
        grabCursor={slides.length > 1}
        allowTouchMove={slides.length > 1}
        observer
        observeParents
        observeSlideChildren
        resizeObserver
        onSwiper={(swiper) => {
          swiperRef.current = swiper
          requestAnimationFrame(() => swiper.update())
        }}
        onSlideChange={(swiper) => setVisibleIndex(swiper.activeIndex)}
        onTouchEnd={(swiper) => {
          requestAnimationFrame(() => setLockedIndex(swiper.activeIndex))
        }}
        a11y={{
          enabled: true,
          containerMessage: `Фотографии товара ${productName}`,
          slideLabelMessage: '{{index}} из {{slidesLength}}',
        }}
        className="h-full w-full"
      >
        {slides.map((image, index) => (
          <SwiperSlide key={image.id}>
            <Image
              src={image.url}
              alt={image.alt?.trim() || `${productName}, фото ${index + 1}`}
              fill
              priority={priority && index === 0}
              loading={priority && index === 0 ? undefined : imageLoading}
              placeholder={image.blurDataUrl ? 'blur' : 'empty'}
              blurDataURL={image.blurDataUrl || undefined}
              quality={compact ? 65 : 75}
              sizes={sizes}
              draggable={false}
              className="object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {slides.length > 1 && (
        <div
          className={`absolute inset-x-0 bottom-0 z-20 flex ${compact ? 'gap-1 px-2' : 'gap-1.5 px-3'}`}
          role="group"
          aria-label="Выбор фотографии"
        >
          {slides.map((image, index) => {
            const isVisible = visibleIndex === index
            const isLocked = lockedIndex === index

            return (
              <button
                key={image.id}
                type="button"
                aria-pressed={isLocked}
                aria-label={`Показать фото ${index + 1} из ${slides.length}`}
                onMouseEnter={() => preview(index)}
                onFocus={() => preview(index)}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  lock(index)
                }}
                className="group/indicator relative h-6 flex-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
              >
                <span
                  className={`absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full transition-colors duration-200 ${
                    isVisible ? 'bg-white' : 'bg-white/45 group-hover/indicator:bg-white/75'
                  }`}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
