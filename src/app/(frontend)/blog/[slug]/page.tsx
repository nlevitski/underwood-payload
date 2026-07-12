import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from 'lucide-react'
import Image from 'next/image'
import * as motion from 'motion/react-client'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { Button } from '@/components/ui/button'

import { BlogCard } from '../../_components/blogCard/BlogCard'
import { getBlogPost, getBlogPostSlugs, getRelatedPosts } from '../data'
import { getSiteSettings } from '@/globals/fetchers'
import { absoluteURL, buildMetadata } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/JsonLd'

export const revalidate = 300

export async function generateStaticParams() {
  return getBlogPostSlugs()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [post, settings] = await Promise.all([getBlogPost(slug), getSiteSettings()])

  if (!post) {
    return {
      title: `Статья не найдена | ${settings.siteName}`,
      robots: { index: false, follow: false },
    }
  }

  return buildMetadata({
    meta: post.meta,
    settings,
    path: `/blog/${slug}`,
    fallbackTitle: post.title,
    fallbackDescription: post.excerpt,
    fallbackImage: post.image,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, settings] = await Promise.all([getBlogPost(slug), getSiteSettings()])

  if (!post) {
    notFound()
  }

  const related = await getRelatedPosts(post.id, 3)
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.meta?.description || post.excerpt,
    image: absoluteURL(post.image),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: settings.siteName,
      logo: {
        '@type': 'ImageObject',
        url: absoluteURL('/android-chrome-512x512.png'),
      },
    },
    mainEntityOfPage: absoluteURL(`/blog/${slug}`),
  }
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: absoluteURL('/') },
      { '@type': 'ListItem', position: 2, name: 'Блог', item: absoluteURL('/blog') },
      { '@type': 'ListItem', position: 3, name: post.title, item: absoluteURL(`/blog/${slug}`) },
    ],
  }

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
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
                  placeholder={post.blurDataUrl ? 'blur' : 'empty'}
                  blurDataURL={post.blurDataUrl}
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
              ) : null}
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
                  blurDataUrl={p.blurDataUrl}
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
