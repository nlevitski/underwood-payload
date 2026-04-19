import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface CategoryCardProps {
  title: string
  description: string
  image: string
  href: string
}

export function CategoryCard({ title, description, image, href }: CategoryCardProps) {
  return (
    <div>
      <Link
        href={href}
        className="group relative block overflow-hidden rounded-2xl aspect-[4/3] shadow-card hover:shadow-elevated transition-all duration-300"
      >
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="text-xl md:text-2xl font-bold text-primary-foreground mb-1">{title}</h3>
          <p className="text-sm text-primary-foreground/80 mb-3">{description}</p>
          <div className="flex items-center gap-1 text-sm text-primary-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Смотреть каталог</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </div>
  )
}
