import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import * as motion from 'motion/react-client'
import { BlogCard } from '../blogCard/BlogCard'
import { getBlogPosts } from '../../blog/data'

export async function BlogPreview() {
  const blogPosts = await getBlogPosts()

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
          {blogPosts.slice(0, 2).map((post) => (
            <BlogCard
              key={post.id}
              id={post.id}
              title={post.title}
              excerpt={post.excerpt}
              image={post.image}
              date={post.date}
              category={post.category}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
