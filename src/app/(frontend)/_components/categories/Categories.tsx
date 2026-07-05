import { CategoryCard } from '../categoryCard/CategoryCard'
import * as motion from 'motion/react-client'

import conifersImage from '@/assets/catalog-conifers-smaragd.png'
import berriesImage from '@/assets/catalog-berries-blueberry-v4.png'
import foliageImage from '@/assets/catalog-foliage.png'
import perennialsImage from '@/assets/catalog-perennials.png'

const categories = [
  {
    title: 'Хвойные',
    description: 'Туи, ели, сосны и можжевельники',
    image: conifersImage.src,
    href: '/catalog?category=conifers',
    category: 'conifers' as const,
    chips: ['Туи', 'Сосны', 'Можжевельники'],
  },
  {
    title: 'Ягодные',
    description: 'Голубика, малина, клюква и брусника',
    image: berriesImage.src,
    href: '/catalog?category=berries',
    category: 'berries' as const,
    chips: ['Голубика', 'Малина', 'Ежевика', 'Брусника'],
  },
  {
    title: 'Лиственные',
    description: 'Декоративные кустарники и деревья',
    image: foliageImage.src,
    href: '/catalog?category=foliage',
    category: 'foliage' as const,
    chips: ['Пузыреплодник', 'Спирея', 'Дерен'],
  },
  {
    title: 'Многолетние',
    description: 'Пионы, хосты, астильбы и другие садовые многолетники',
    image: perennialsImage.src,
    href: '/catalog?category=perennials',
    category: 'perennials' as const,
    chips: ['Хосты', 'Пионы', 'Лилейники'],
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

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
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
