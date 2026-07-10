import thujaImage from '@/assets/plant-thuja.jpg'
import type { Article, ArticleAuthor, Media } from '@/payload-types'

import { getArticleBySlug, getArticles } from '@/collections/Articles/fetchers'

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
  category: string
  author: string
  readTime: string
  content?: Article['content']
}

type Relation<T> = number | null | undefined | T

function isObjectRelation<T extends { id: number }>(relation: Relation<T>): relation is T {
  return typeof relation === 'object' && relation !== null
}

function formatDate(value: string | null | undefined) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatReadTime(minutes: number | null | undefined) {
  return `${Math.max(1, Math.round(minutes ?? 1))} мин`
}

function resolveMediaUrl(media: Relation<Media>, fallback: string) {
  if (!isObjectRelation<Media>(media)) {
    return fallback
  }

  return (
    media.url ??
    media.sizes?.l?.url ??
    media.sizes?.m?.url ??
    media.sizes?.s?.url ??
    media.sizes?.xs?.url ??
    fallback
  )
}

function resolveAuthorName(author: Relation<ArticleAuthor>) {
  if (!isObjectRelation<ArticleAuthor>(author)) {
    return 'Редакция Underwood'
  }

  return author.name
}

function getNodeText(node: unknown): string {
  if (!node || typeof node !== 'object') {
    return ''
  }

  const maybeNode = node as { children?: unknown[]; text?: unknown }

  if (typeof maybeNode.text === 'string') {
    return maybeNode.text
  }

  return maybeNode.children?.map(getNodeText).join('') ?? ''
}

function removeLeadingTitleHeading(content: Article['content'], title: string): Article['content'] {
  const [firstNode, ...remainingNodes] = content.root.children

  if (
    firstNode?.type === 'heading' &&
    'tag' in firstNode &&
    firstNode.tag === 'h1' &&
    getNodeText(firstNode).trim() === title.trim()
  ) {
    return {
      ...content,
      root: {
        ...content.root,
        children: remainingNodes,
      },
    }
  }

  return content
}

function removeLeadingTitleFromSummary(summary: string, title: string) {
  const normalizedTitle = title.trim()
  const normalizedSummary = summary.trim()

  if (!normalizedSummary.startsWith(normalizedTitle)) {
    return normalizedSummary
  }

  return normalizedSummary.slice(normalizedTitle.length).trim() || normalizedSummary
}

function normalizeArticleCard(article: Article): BlogPost {
  return {
    id: article.slug,
    title: article.title,
    excerpt: removeLeadingTitleFromSummary(article.contentSummary, article.title),
    image: resolveMediaUrl(article.coverImage, thujaImage.src),
    date: formatDate(article.publishedAt ?? article.createdAt),
    category: article.category,
    author: resolveAuthorName(article.author),
    readTime: formatReadTime(article.readTimeInMins),
  }
}

function normalizeArticlePage(article: Article): BlogPost {
  return {
    ...normalizeArticleCard(article),
    content: removeLeadingTitleHeading(article.content, article.title),
  }
}

export async function getBlogPosts() {
  const articles = await getArticles()

  return articles.map(normalizeArticleCard)
}

export async function getBlogPost(id: string) {
  const article = await getArticleBySlug(id)

  if (!article) {
    return undefined
  }

  return normalizeArticlePage(article)
}

export async function getRelatedPosts(currentId: string, limit = 3) {
  const posts = await getBlogPosts()

  return posts.filter((post) => post.id !== currentId).slice(0, limit)
}

export async function getBlogPostSlugs() {
  const posts = await getBlogPosts()

  return posts.map(({ id }) => ({ slug: id }))
}
