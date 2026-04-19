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
    <article>
      <Link
        href={`/blog/${id}`}
        className="group block overflow-hidden rounded-xl bg-card shadow-soft hover:shadow-card transition-all duration-300"
      >
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-forest uppercase tracking-wide">{category}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{date}</span>
            </div>
          </div>
          <h3 className="font-semibold text-lg text-foreground leading-tight group-hover:text-forest transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
          <div className="flex items-center gap-1 text-sm text-forest font-medium pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Читать</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </article>
  )
}
