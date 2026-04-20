'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { Product, AgeType, SizeType, AgePostfix, SizePostfix } from '../../catalog/products'
import { StaticImageData } from 'next/image'
import { useState } from 'react'
import Link from 'next/link'

const valueMap = {
  size: 'Размер',
  age: 'Возраст',
}

type VariantWithValue = {
  id: number
  price: number
  inStock: boolean
  value: AgeType | SizeType
  postfix: AgePostfix | SizePostfix
}

export function PlantCard(props: Product & { image: StaticImageData }) {
  // Selected (clicked) values
  const [potId, setPotId] = useState<number>(props.pots[0].id)
  const [variantId, setVariantId] = useState(props.pots[0].variants[0].id)

  // Hover states
  const [hoveredPotId, setHoveredPotId] = useState<number | null>(null)
  const [hoveredVariantId, setHoveredVariantId] = useState<number | null>(null)

  // Use hovered values if hovering, otherwise use selected values
  const displayPotId = hoveredPotId ?? potId
  const displayVariantId = hoveredVariantId ?? variantId

  const currentPot = props.pots.find((p) => p.id === displayPotId)!
  const curVariant = currentPot.variants.find((v) => v.id === displayVariantId)!

  const togglePot = (id: number) => {
    const newCurrentPot = props.pots.find((p) => p.id === id)!
    const newCurVariantId = newCurrentPot.variants[0].id
    setPotId(newCurrentPot.id)
    setVariantId(newCurVariantId)
    setHoveredPotId(null)
    setHoveredVariantId(null)
  }

  const handlePotHover = (id: number) => {
    setHoveredPotId(id)
    const hoveredPot = props.pots.find((p) => p.id === id)!
    setHoveredVariantId(hoveredPot.variants[0].id)
  }

  const handlePotLeave = () => {
    setHoveredPotId(null)
    setHoveredVariantId(null)
  }

  const handleVariantHover = (id: number) => {
    setHoveredVariantId(id)
  }

  const handleVariantLeave = () => {
    setHoveredVariantId(null)
  }
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-soft transition-all duration-300 hover:shadow-card">
      {/* <Link
        href={`/catalog/${props.id}`}
        className="group block overflow-hidden rounded-xl bg-card shadow-soft hover:shadow-card transition-all duration-300"
      > */}
      <div className="aspect-square overflow-hidden relative">
        <Image
          src={props.image}
          alt={props.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-3 space-y-2.5">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {props.category}
        </span>
        <h3 className="text-base font-semibold text-foreground group-hover:text-forest transition-colors">
          {props.name}
        </h3>

        {/* Pot selection */}
        <div>
          <p className="text-xs text-muted-foreground mb-1.5 block">Горшок</p>
          <div className="flex flex-wrap gap-1.5">
            {props.pots.map((pot) => (
              <button
                key={pot.name}
                type="button"
                onClick={() => {
                  togglePot(pot.id)
                }}
                onMouseEnter={() => handlePotHover(pot.id)}
                onMouseLeave={handlePotLeave}
                aria-label={pot.name}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  pot.id === potId
                    ? 'bg-forest text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {pot.name}
              </button>
            ))}
          </div>
        </div>

        {/* Value selection (age/size) - only if not 'none' */}
        {props.valueType !== 'none' && (
          <div>
            <p className="text-xs text-muted-foreground mb-1.5 block">{`${valueMap[props.valueType]}`}</p>
            <div className="flex flex-wrap gap-1.5">
              {(currentPot.variants as VariantWithValue[]).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setVariantId(v.id)
                    setHoveredVariantId(null)
                  }}
                  onMouseEnter={() => handleVariantHover(v.id)}
                  onMouseLeave={handleVariantLeave}
                  aria-label={`${v.value} ${v.postfix}`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    v.id === variantId
                      ? 'bg-forest text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {`${v.value} ${v.postfix}`}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-bold text-foreground">{curVariant.price} BYN</span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              curVariant.inStock
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {curVariant.inStock ? 'В наличии' : 'Под заказ'}
          </span>
        </div>
        <Link href={`/catalog/${props.id}`}>
          <div className="flex items-center gap-1 text-sm text-forest font-medium pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Подробнее</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </div>
      {/* </Link> */}
    </div>
  )
}
