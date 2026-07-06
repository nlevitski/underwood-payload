import {
  CalendarDays,
  Droplets,
  Palette,
  PlayCircle,
  Ruler,
  Sparkles,
  Sprout,
  Sun,
  Tag,
  Thermometer,
  Video,
} from 'lucide-react'

import type { DBProduct } from '../dbProducts'

const careMeta = {
  watering: {
    title: 'Полив',
    icon: Droplets,
  },
  light: {
    title: 'Освещение',
    icon: Sun,
  },
  soil: {
    title: 'Почва',
    icon: Sprout,
  },
  temperature: {
    title: 'Зимовка',
    icon: Thermometer,
  },
  size: {
    title: 'Обрезка',
    icon: Ruler,
  },
} as const

const botanicalMeta = [
  {
    key: 'type',
    title: 'Тип растения',
    icon: Tag,
  },
  {
    key: 'growthForm',
    title: 'Форма роста',
    icon: Sprout,
  },
  {
    key: 'color',
    title: 'Окрас',
    icon: Palette,
  },
  {
    key: 'ripeningTime',
    title: 'Срок созревания',
    icon: CalendarDays,
  },
] as const

type CareGuideSectionProps = {
  product: Pick<DBProduct, 'name' | 'attributes' | 'cares' | 'videos'>
}

function splitParagraphs(value: string) {
  return value
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

function getVideoReviews(productName: string, videos: DBProduct['videos']) {
  if (videos?.length) {
    return videos.map((video, index) => ({
      id: `${video.type}-${index}`,
      title: video.title,
      platform: video.type === 'instagram' ? 'Instagram' : 'YouTube',
      description: 'Видео будет доступно после добавления ссылки в CMS.',
    }))
  }

  return [
    {
      id: 'overview',
      title: `Видеообзор: ${productName}`,
      platform: 'YouTube',
      description: 'Короткий обзор внешнего вида, размера и вариантов посадки.',
    },
    {
      id: 'planting',
      title: 'Посадка и уход после покупки',
      platform: 'Instagram',
      description: 'Практические рекомендации для первых недель после высадки.',
    },
  ]
}

export function CareGuideSection({ product }: CareGuideSectionProps) {
  const attributes = product.attributes
  const botanicalItems = botanicalMeta.flatMap((item) => {
    const value = attributes?.[item.key]?.trim()

    return value ? [{ ...item, value }] : []
  })
  const notes = attributes?.notes?.trim()
  const videos = getVideoReviews(product.name, product.videos)
  const hasBotanicalContent = botanicalItems.length > 0 || Boolean(notes)
  const hasCareContent = product.cares.length > 0
  const hasLeftColumn = hasBotanicalContent || videos.length > 0

  if (!hasLeftColumn && !hasCareContent) return null

  return (
    <section className="py-14 md:py-16 bg-cream-dark border-y border-border/80">
      <div className="container">
        <div className="max-w-3xl mb-9">
          <span className="text-xs font-semibold text-forest uppercase tracking-widest">
            О растении
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 text-balance">
            Характеристики и уход
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed text-pretty">
            Ключевые ботанические особенности и практические рекомендации по выращиванию в условиях
            Беларуси.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          {hasLeftColumn && (
            <div
              className={`${hasCareContent ? 'lg:col-span-2' : 'lg:col-span-3'} contents lg:block lg:space-y-6`}
            >
              {hasBotanicalContent && (
                <div className="order-1 bg-background rounded-2xl border border-border/70 shadow-soft overflow-hidden">
                  <div className="px-5 sm:px-6 py-4 border-b border-border/70 flex items-center gap-2.5">
                    <Sprout className="h-4 w-4 text-forest" />
                    <h3 className="font-semibold text-foreground">Ботанические характеристики</h3>
                  </div>

                  {botanicalItems.length > 0 && (
                    <dl className="divide-y divide-border/70">
                      {botanicalItems.map(({ key, title, icon: Icon, value }) => (
                        <div
                          key={key}
                          className="grid gap-2 px-5 sm:px-6 py-4 sm:grid-cols-[minmax(160px,220px)_1fr] sm:gap-6"
                        >
                          <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Icon className="h-4 w-4 text-forest/75 shrink-0" />
                            {title}
                          </dt>
                          <dd className="text-sm sm:text-base text-foreground leading-relaxed">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {notes && (
                    <div className="px-5 sm:px-6 py-5 bg-accent/45 border-t border-border/70 flex gap-3">
                      <Sparkles className="h-4 w-4 text-forest mt-1 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-forest uppercase tracking-wide mb-2">
                          Особенности сорта
                        </div>
                        <div className="space-y-3">
                          {splitParagraphs(notes).map((paragraph) => (
                            <p
                              key={paragraph}
                              className="text-sm text-foreground leading-relaxed text-pretty"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {videos.length > 0 && (
                <div className="order-3 bg-background rounded-2xl border border-border/70 shadow-soft overflow-hidden">
                  <div className="px-5 sm:px-6 py-4 border-b border-border/70 flex items-center gap-2.5">
                    <Video className="h-4 w-4 text-forest" />
                    <h3 className="font-semibold text-foreground">Видеообзоры</h3>
                  </div>
                  <div className="p-5 sm:p-6 grid gap-4 sm:grid-cols-2">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className="rounded-xl border border-border/70 bg-muted/60 overflow-hidden"
                      >
                        <div className="aspect-video bg-accent/50 flex items-center justify-center">
                          <div className="h-12 w-12 rounded-full bg-background/95 shadow-soft flex items-center justify-center">
                            <PlayCircle className="h-6 w-6 text-forest" />
                          </div>
                        </div>
                        <div className="px-4 py-3 bg-background border-t border-border/70">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-foreground truncate">
                              {video.title}
                            </p>
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground shrink-0">
                              {video.platform}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {hasCareContent && (
            <aside
              className={`order-2 bg-background rounded-2xl border border-border/70 shadow-soft overflow-hidden ${
                hasLeftColumn ? 'lg:sticky lg:top-24' : 'lg:col-span-3'
              }`}
            >
              <div className="px-5 sm:px-6 py-4 border-b border-border/70 flex items-center gap-2.5">
                <Droplets className="h-4 w-4 text-forest" />
                <h3 className="font-semibold text-foreground">Условия выращивания</h3>
              </div>
              <ul className="divide-y divide-border/70">
                {product.cares.map((care) => {
                  const meta = careMeta[care.type]
                  const Icon = meta.icon

                  return (
                    <li key={care.type} className="px-5 sm:px-6 py-4 flex gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-forest" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {meta.title}
                        </div>
                        <p className="text-sm text-foreground leading-relaxed mt-0.5 text-pretty">
                          {care.description}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </section>
  )
}
