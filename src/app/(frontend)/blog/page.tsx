import type { Metadata } from 'next'
import Link from 'next/link'
import * as motion from 'motion/react-client'

import { BlogCard } from '../_components/blogCard/BlogCard'
import { getBlogPosts } from './data'
import { getPageGlobal, getSiteSettings } from '@/globals/fetchers'
import { buildMetadata } from '@/lib/seo/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPageGlobal('blog-page'), getSiteSettings()])

  return buildMetadata({
    meta: page.meta,
    settings,
    path: '/blog',
    fallbackTitle: page.heading,
    fallbackDescription: page.description,
  })
}

export const revalidate = 300

export default async function BlogPage() {
  const [blogPosts, page] = await Promise.all([getBlogPosts(), getPageGlobal('blog-page')])

  return (
    <>
      <section className="bg-cream-dark py-12">
        <div className="container">
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Блог</span>
          </nav>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">{page.heading}</h1>
          <p className="mt-2 text-muted-foreground">{page.description}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <BlogCard
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  image={post.image}
                  blurDataUrl={post.blurDataUrl}
                  date={post.date}
                  category={post.category}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
