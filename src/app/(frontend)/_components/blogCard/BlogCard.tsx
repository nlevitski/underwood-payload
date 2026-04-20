import { ArrowRight, Calendar } from 'lucide-react'
import Link from 'next/link'

interface BlogCardProps {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
  category: string
}

export function BlogCard({ id, title, excerpt, image, date, category }: BlogCardProps) {
  return (
    <article className="h-full">
      <Link
        href={`/blog/${id}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-soft transition-all duration-300 hover:shadow-card"
      >
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex h-full flex-1 flex-col p-5">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-forest uppercase tracking-wide">{category}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{date}</span>
            </div>
          </div>
          <h3 className="mt-3 text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-forest">
            {title}
          </h3>
          <p className="mt-3 flex-1 text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-forest opacity-0 transition-opacity group-hover:opacity-100">
            <span>Читать</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </article>
  )
}
