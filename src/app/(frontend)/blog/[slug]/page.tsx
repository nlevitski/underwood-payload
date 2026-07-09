import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from 'lucide-react'
import Image from 'next/image'
import * as motion from 'motion/react-client'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { Button } from '@/components/ui/button'

import { BlogCard } from '../../_components/blogCard/BlogCard'
import { getBlogPost, getBlogPostSlugs, getRelatedPosts } from '../data'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return getBlogPostSlugs()
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Блог | Underwood',
    }
  }

  return {
    title: `${post.title} | Underwood`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    redirect('/blog')
  }

  const related = await getRelatedPosts(post.id, 3)

  return (
    <>
      <section className="border-b border-border/50 bg-cream-dark py-6">
        <div className="container">
          <nav className="text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="transition-colors hover:text-foreground">
              Блог
            </Link>
            <span className="mx-2">/</span>
            <span className="inline line-clamp-1 text-foreground">{post.title}</span>
          </nav>
        </div>
      </section>

      <article className="py-12">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <span className="mb-3 inline-block text-xs font-medium uppercase tracking-wide text-forest">
                {post.category}
              </span>
              <h1 className="mb-5 text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </motion.header>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-10 aspect-[16/9] overflow-hidden rounded-2xl shadow-card"
            >
              <div className="relative h-full w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-8"
            >
              {post.content ? (
                <RichText
                  className="blog-rich-text"
                  data={post.content}
                  disableIndent
                  disableTextAlign
                />
              ) : (
                <>
                  {post.intro ? (
                    <p className="text-lg font-medium leading-relaxed text-foreground/90">
                      {post.intro}
                    </p>
                  ) : null}

                  {post.sections?.map((section, idx) => (
                    <section key={idx} className="space-y-4">
                      {section.heading ? (
                        <h2 className="pt-2 text-2xl font-bold text-foreground">{section.heading}</h2>
                      ) : null}
                      {section.paragraphs?.map((paragraph, paragraphIndex) => (
                        <p key={paragraphIndex} className="text-base leading-relaxed text-foreground/80">
                          {paragraph}
                        </p>
                      ))}
                      {section.list ? (
                        <ul className="space-y-2 pl-1">
                          {section.list.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="flex gap-3 text-base leading-relaxed text-foreground/80"
                            >
                              <span className="mt-1.5 font-bold leading-none text-forest">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </section>
                  ))}
                </>
              )}
            </motion.div>

            <div className="mt-12 rounded-2xl border border-border/50 bg-cream-dark p-6 md:p-8">
              <h3 className="mb-2 text-xl font-bold text-foreground">Нужна консультация?</h3>
              <p className="mb-4 text-muted-foreground">
                Подскажем, какие растения подойдут именно вашему участку, и поможем с подбором.
              </p>
              <Button
                asChild
                className="bg-forest text-primary-foreground hover:bg-forest/90 shadow-soft hover:shadow-card"
              >
                <Link href="/contacts">Связаться с питомником</Link>
              </Button>
            </div>

            <div className="mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-forest hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Все статьи блога
              </Link>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-border/50 bg-cream-dark py-12">
          <div className="container">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">Другие статьи</h2>
              <Link
                href="/blog"
                className="hidden items-center gap-1 text-sm font-medium text-forest hover:underline sm:inline-flex"
              >
                Все статьи
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  excerpt={p.excerpt}
                  image={p.image}
                  date={p.date}
                  category={p.category}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
