import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import * as motion from 'motion/react-client'
import { BlogCard } from '../blogCard/BlogCard'

import thujaImage from '@/assets/plant-thuja.jpg'
import blueberryImage from '@/assets/plant-blueberry.jpg'

const blogPosts = [
  {
    id: 'thuja-care',
    title: 'Как ухаживать за туями: полное руководство',
    excerpt:
      'Разбираем основные правила полива, подкормки и обрезки туй в условиях белорусского климата.',
    image: thujaImage.src,
    date: '15 января 2026',
    category: 'Уход',
  },
  {
    id: 'blueberry-planting',
    title: 'Посадка голубики: пошаговая инструкция',
    excerpt:
      'Выбор места, подготовка почвы и правильная посадка саженцев голубики для богатого урожая.',
    image: blueberryImage.src,
    date: '10 января 2026',
    category: 'Посадка',
  },
]

export function BlogPreview() {
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
            <span className="text-sm font-medium text-forest uppercase tracking-wide">Блог</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Полезные статьи</h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/blog">
              Все статьи
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </section>
  )
}
