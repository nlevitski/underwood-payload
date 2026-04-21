import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import * as motion from 'motion/react-client'
import { cn } from '@/lib/utils'

import heroImage from '@/assets/hero-nursery.jpg'

type HeroProps = {
  title?: ReactNode
  subtitle?: ReactNode
  description?: ReactNode
  breadcrumb?: ReactNode
  actions?: ReactNode
  imageSrc?: string
  imageAlt?: string
  heightClassName?: string
  containerPaddingClassName?: string
  contentClassName?: string
  overlayClassName?: string
  titleClassName?: string
}

export function Hero({
  title = 'Underwood',
  subtitle = 'Питомник хвойных и ягодных растений',
  description = (
    <>
      Выращиваем хвойные и ягодные культуры с заботой и опытом. Все растения адаптированы к климату
      Беларуси.
    </>
  ),
  breadcrumb,
  actions,
  imageSrc = heroImage.src,
  imageAlt = 'Питомник Underwood',
  heightClassName = 'min-h-[85vh]',
  containerPaddingClassName = 'py-20',
  contentClassName = 'max-w-2xl',
  overlayClassName = 'bg-gradient-to-r from-foreground/70 via-foreground/50 to-transparent',
  titleClassName = 'text-4xl md:text-5xl lg:text-6xl',
}: HeroProps) {
  const defaultActions = (
    <>
      <Button variant="default" asChild>
        <Link href="/catalog">
          Смотреть каталог
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
      <Button
        variant="outline"
        asChild
        className="border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-foreground"
      >
        <Link href="/contacts">Связаться с нами</Link>
      </Button>
    </>
  )

  return (
    <section className={cn('relative flex items-center', heightClassName)}>
      <div className="absolute inset-0">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" priority />
        <div className={cn('absolute inset-0', overlayClassName)} />
      </div>
      <div className={cn('container relative z-10', containerPaddingClassName)}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={contentClassName}
        >
          {breadcrumb ? <div className="mb-4">{breadcrumb}</div> : null}
          <h1
            className={cn(titleClassName, 'font-bold text-primary-foreground mb-4 leading-tight')}
          >
            {title}
          </h1>
          {subtitle ? (
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-2">{subtitle}</p>
          ) : null}
          {description ? (
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg">{description}</p>
          ) : null}
          <div className="flex flex-wrap gap-4">
            {actions === undefined ? defaultActions : actions}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
