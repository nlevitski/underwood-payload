import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import * as motion from 'motion/react-client'

import { getPayloadClient } from '@/lib/payload/client'

import { getHomepagePopularPlants } from '@/collections/HomepagePopularPlants/fetchers'
import { PlantCard } from '../plantCard/PlantCard'

export async function PopularPlants() {
  const payload = await getPayloadClient()
  const popularPlants = await getHomepagePopularPlants(payload)

  if (popularPlants.length === 0) {
    return null
  }

  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-sm font-medium text-forest uppercase tracking-wide">
              Популярное
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Востребованные растения
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/catalog">
              Весь каталог
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularPlants.map((plant) => (
            <PlantCard key={plant.slug} {...plant} />
          ))}
        </div>
      </div>
    </section>
  )
}
