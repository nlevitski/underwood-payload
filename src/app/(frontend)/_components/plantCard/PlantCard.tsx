'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import type { DBProduct } from '../../catalog/dbProducts'

const valueMap = {
  size: 'Размер',
  age: 'Возраст',
} as const

type VariantWithValue = {
  value: string
  postfix: string
}

type PlantCardProps = DBProduct & {
  initialVariantId?: number
  initialPotId?: number
}

function normalizePotCode(value: string) {
  return value.trim().toUpperCase()
}

export function PlantCard(props: PlantCardProps) {
  const initialVariant =
    props.variants.find((variant) => variant.id === props.initialVariantId) ?? props.variants[0]
  const initialPot =
    initialVariant?.pots.find((pot) => pot.id === props.initialPotId) ?? initialVariant?.pots[0]
  const hasVariantSelection = props.valueType !== 'none'
  const variantLabel = props.valueType === 'none' ? null : valueMap[props.valueType]
  const allPots = props.variants.flatMap((variant) => variant.pots)

  // Selected (clicked) values
  const [variantId, setVariantId] = useState<number>(initialVariant?.id ?? 0)
  const [potId, setPotId] = useState<number>(initialPot?.id ?? 0)

  // Hover states
  const [hoveredPotId, setHoveredPotId] = useState<number | null>(null)
  const [hoveredVariantId, setHoveredVariantId] = useState<number | null>(null)

  // Use hovered values if hovering, otherwise use selected values
  const displayPotId = hoveredPotId ?? potId
  const displayVariantId = hoveredVariantId ?? variantId

  const currentVariant =
    props.variants.find((variant) => variant.id === displayVariantId) ?? initialVariant
  const currentPot = hasVariantSelection
    ? (currentVariant?.pots.find((pot) => pot.id === displayPotId) ?? currentVariant?.pots[0])
    : (allPots.find((pot) => pot.id === displayPotId) ?? allPots[0])

  if (!currentVariant || !currentPot) {
    return null
  }

  const toggleVariant = (id: number) => {
    const nextVariant = props.variants.find((variant) => variant.id === id)
    if (!nextVariant) return

    const nextPot = nextVariant.pots[0]
    setVariantId(nextVariant.id)
    setPotId(nextPot?.id ?? 0)
    setHoveredPotId(null)
    setHoveredVariantId(null)
  }

  const handleVariantHover = (id: number) => {
    const hoveredVariant = props.variants.find((variant) => variant.id === id)
    if (!hoveredVariant) return

    setHoveredVariantId(id)
    setHoveredPotId(hoveredVariant.pots[0]?.id ?? null)
  }

  const clearHoverSelection = () => {
    setHoveredPotId(null)
    setHoveredVariantId(null)
  }

  const handlePotHover = (id: number) => {
    setHoveredPotId(id)
  }

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-soft transition-all duration-300 hover:shadow-card">
      <Link
        href={`/catalog/${props.slug}`}
        aria-label={`Открыть страницу товара ${props.name}`}
        className="absolute inset-0 z-10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
      />
      <div className="aspect-square overflow-hidden relative">
        <Image
          src={currentPot.images?.[0]?.url || props.image}
          alt={props.name}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
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

        <div className="relative z-20" onMouseLeave={clearHoverSelection}>
          {hasVariantSelection && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5 block">{variantLabel}</p>
              <div className="flex flex-wrap gap-1.5">
                {props.variants.map((variant) => {
                  const variantWithValue = variant as VariantWithValue

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => {
                        toggleVariant(variant.id)
                      }}
                      onMouseEnter={() => handleVariantHover(variant.id)}
                      aria-label={`${variantWithValue.value} ${variantWithValue.postfix}`}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        variant.id === variantId
                          ? 'bg-forest text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      {`${variantWithValue.value} ${variantWithValue.postfix}`}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1.5 block">Горшок</p>
            <div className="flex flex-wrap gap-1.5">
              {(hasVariantSelection ? currentVariant.pots : allPots).map((pot) => (
                <button
                  key={pot.id}
                  type="button"
                  onClick={() => {
                    setPotId(pot.id)
                    setHoveredPotId(null)
                  }}
                  onMouseEnter={() => handlePotHover(pot.id)}
                  aria-label={normalizePotCode(pot.name)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    hoveredPotId === pot.id
                      ? 'bg-accent text-accent-foreground'
                      : pot.id === potId
                        ? 'bg-forest text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {normalizePotCode(pot.name)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-bold text-foreground">{currentPot.price} BYN</span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              currentPot.inStock
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {currentPot.inStock ? 'В наличии' : 'Под заказ'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-forest font-medium pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Подробнее</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}
