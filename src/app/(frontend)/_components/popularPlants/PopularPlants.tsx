import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import * as motion from 'motion/react-client'

import thujaImage from '@/assets/plant-thuja.jpg'
import blueberryImage from '@/assets/plant-blueberry.jpg'
import raspberryImage from '@/assets/plant-raspberry.jpg'
import { PopularCard } from '../popularCard/PopularCard'

type PopularPlant = {
  id: string
  name: string
  category: string
  image: string
  price: number
  pot: string
  age?: string
  size?: string
  inStock: boolean
}

const popularPlants: PopularPlant[] = [
  {
    id: 'thuja-smaragd',
    name: 'Туя Смарагд',
    category: 'Хвойные',
    image: thujaImage.src,
    price: 10,
    pot: 'C2',
    size: '50-60 см',
    inStock: true,
  },
  {
    id: 'thuja-brabant',
    name: 'Туя Брабант',
    category: 'Хвойные',
    image: thujaImage.src,
    price: 10,
    pot: 'C2',
    size: '50-60 см',
    inStock: true,
  },
  {
    id: 'blueberry-bluecrop',
    name: 'Голубика Блюкроп',
    category: 'Ягодные',
    image: blueberryImage.src,
    price: 12,
    pot: 'C2',
    age: '3 года',
    inStock: true,
  },
  {
    id: 'raspberry-rubyfall',
    name: 'Малина Пумилио',
    category: 'Ягодные',
    image: raspberryImage.src,
    price: 10,
    pot: 'C2',
    age: '1 год',
    inStock: true,
  },
]

export function PopularPlants() {
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
            <PopularCard key={plant.id} {...plant} />
          ))}
        </div>
      </div>
    </section>
  )
}
