import { Droplets, Sun, Thermometer, Ruler } from 'lucide-react'
import type { Care } from '../products'

const careMeta = {
  watering: {
    title: 'Полив',
    icon: Droplets,
  },
  light: {
    title: 'Освещение',
    icon: Sun,
  },
  temperature: {
    title: 'Температура',
    icon: Thermometer,
  },
  size: {
    title: 'Размер',
    icon: Ruler,
  },
} as const

type CareGuideSectionProps = {
  cares: Care[]
}

export function CareGuideSection({ cares }: CareGuideSectionProps) {
  if (cares.length === 0) return null

  return (
    <section className="py-12 bg-cream-dark">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Рекомендации по уходу
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {cares.map((care) => {
            const meta = careMeta[care.type]
            const Icon = meta.icon

            return (
              <div
                key={care.type}
                className="bg-background rounded-xl p-6 shadow-soft flex-none w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-forest" />
                  </div>
                  <h3 className="font-semibold text-foreground leading-tight">{meta.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{care.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
