import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getArticles } from '@/collections/Articles/fetchers'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Media } from '@/payload-types'

function isObjectRelation<T>(relation: number | T): relation is T {
  return typeof relation !== 'number'
}

export default async function ArticlesPage() {
  const articles = await getArticles()
  console.log('articles', articles)
  return (
    <>
      {/* <h1 className="text-3xl font-bold underline">Articles Page</h1>
      <h2>
        <Link href="/">Главная</Link>
      </h2>
      <div className="grid grid-cols-3 gap-4 w-full">
        {articles.map(
          ({
            id,
            title,
            contentSummary,
            slug,
            readTimeInMins,
            publishedAt,
            coverImage,
            author,
          }) => {
            if (!isObjectRelation(coverImage)) return null
            if (!isObjectRelation(author) || !isObjectRelation(author.avatar)) return null
            return (
              <Card key={id} className="relative mx-auto w-full max-w-sm pt-0 overflow-hidden">
                <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
                <img
                  src={coverImage?.url ?? ''}
                  alt={coverImage?.alt ?? 'Article cover'}
                  className="relative z-20 aspect-video w-full object-cover"
                />
                <Link href={`/articles/${slug}`} className="flex flex-col h-full">
                  <CardHeader>
                    <CardAction>
                      <Badge variant="secondary">Article</Badge>
                    </CardAction>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="col-span-2">{contentSummary}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <div className="flex w-fit items-center gap-4">
                      <Avatar>
                        <AvatarImage src={author?.avatar?.url ?? ''} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>

                      <div className="grid gap-1">
                        <p className="text-sm font-medium">{author?.name ?? 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{author?.role ?? 'Author'}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end ml-auto">
                      <p className="text-xs">
                        {publishedAt &&
                          new Date(publishedAt).toLocaleDateString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                      </p>
                      <Badge variant="outline">{`${readTimeInMins} min`}</Badge>
                    </div>
                  </CardFooter>
                </Link>
              </Card>
            )
          },
        )}
      </div> */}
    </>
  )
}
