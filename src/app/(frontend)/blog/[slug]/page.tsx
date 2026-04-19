import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { getArticleBySlug, getArticleSlugs } from '@/collections/Articles/fetchers'

export async function generateStaticParams() {
  const articles = await getArticleSlugs()
  return articles.map(({ slug }) => ({ slug }))
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // const { 0: {} } = await getArticleBySlug(slug)
  return (
    <>
      <h1 className="text-3xl font-bold underline">Article Page {slug}</h1>
      <Card className="relative mx-auto w-full max-w-2xl pt-0 overflow-hidden">
        <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
        <img
          src="https://avatar.vercel.sh/shadcn1"
          alt="Event cover"
          className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
        />
        <CardHeader>
          <CardAction>
            <Badge variant="secondary">Article</Badge>
          </CardAction>
          <CardTitle>Design systems meetup</CardTitle>
          <CardDescription>
            A practical talk on component APIs, accessibility, and shipping faster.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full">
            <Link href="/articles">Back to Articles</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
