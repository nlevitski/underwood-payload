import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface PopularCardProps {
  id: string
  name: string
  category: string
  image: string
  price: number
  pot: string
  age?: string
  size?: string
  inStock: boolean
}

export function PopularCard(props: PopularCardProps) {
  return (
    <div>
      <Link
        href={`/catalog/${props.id}`}
        className="group block overflow-hidden rounded-xl bg-card shadow-soft hover:shadow-card transition-all duration-300"
      >
        <div className="aspect-square overflow-hidden">
          <img
            src={props.image}
            alt={props.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4 space-y-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {props.category}
          </span>
          <h3 className="font-semibold text-foreground group-hover:text-forest transition-colors">
            {props.name}
          </h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Badge variant={'secondary'}>{props.pot}</Badge>
            {props?.age && <Badge variant={'outline'}>{props.age}</Badge>}
            {props?.size && <Badge variant={'outline'}>{props.size}</Badge>}
          </div>
          <div></div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-foreground">{props.price} BYN</span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                props.inStock
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {props.inStock ? 'В наличии' : 'Под заказ'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-forest font-medium pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Подробнее</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </div>
  )
}
