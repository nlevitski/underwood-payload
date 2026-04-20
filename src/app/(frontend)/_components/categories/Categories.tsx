import { CategoryCard } from '../categoryCard/CategoryCard'
import * as motion from 'motion/react-client'

import blueberryImage from '@/assets/plant-blueberry.jpg'
import raspberryImage from '@/assets/plant-raspberry.jpg'
import spruceImage from '@/assets/plant-spruce.jpg'
import nurseryRowsImage from '@/assets/nursery-rows.jpg'

const categories = [
  {
    title: 'Хвойные',
    description: 'Туи, ели, сосны и можжевельники',
    image: spruceImage.src,
    href: '/catalog?category=conifers',
  },
  {
    title: 'Ягодные',
    description: 'Голубика, малина, ежевика, облепиха',
    image: blueberryImage.src,
    href: '/catalog?category=berries',
  },
  {
    title: 'Лиственные',
    description: 'Декоративные кустарники и деревья',
    image: nurseryRowsImage.src,
    href: '/catalog?category=foliage',
  },
  {
    title: 'Многолетние',
    description: 'Долговечные декоративные и плодовые многолетники',
    image: raspberryImage.src,
    href: '/catalog?category=perennials',
  },
]

export function Categories() {
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
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </div>
    </section>
  )
}
