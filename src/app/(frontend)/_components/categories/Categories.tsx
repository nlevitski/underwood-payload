import { CategoryCard } from '../categoryCard/CategoryCard'
import * as motion from 'motion/react-client'

import { getHomepageCategoryCards } from '@/collections/HomepageCategoryCards/fetchers'
import { getPayloadClient } from '@/lib/payload/client'

export async function Categories() {
  const payload = await getPayloadClient()
  const categories = await getHomepageCategoryCards(payload)

  if (categories.length === 0) {
    return null
  }

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
            Ассортимент
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Категории растений
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.52, ease: 'easeOut', delay: index * 0.06 }}
            >
              <CategoryCard {...category} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
