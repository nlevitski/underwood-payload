'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as motion from 'motion/react-client'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product, ProductVariant } from '../products'

type VariantWithValue = Extract<ProductVariant, { value: string }>

const valueMap = {
  size: 'Размер',
  age: 'Возраст',
}

export function ProductClient({ product }: { product: Product }) {
  const initialVariant = product.variants[0]
  const initialPot = initialVariant?.pots[0]
  const hasVariantSelection = product.valueType !== 'none'
  const variantLabel = product.valueType === 'none' ? null : valueMap[product.valueType]
  const allPots = product.variants.flatMap((variant) => variant.pots)

  const [variantId, setVariantId] = useState<number>(initialVariant?.id ?? 0)
  const [potId, setPotId] = useState<number>(initialPot?.id ?? 0)

  // Hover states
  const [hoveredPotId, setHoveredPotId] = useState<number | null>(null)
  const [hoveredVariantId, setHoveredVariantId] = useState<number | null>(null)

  // Use hovered values if hovering, otherwise use selected values
  const displayPotId = hoveredPotId ?? potId
  const displayVariantId = hoveredVariantId ?? variantId

  const currentVariant =
    product.variants.find((variant) => variant.id === displayVariantId) ?? initialVariant
  const currentPot = hasVariantSelection
    ? currentVariant?.pots.find((pot) => pot.id === displayPotId) ?? currentVariant?.pots[0]
    : allPots.find((pot) => pot.id === displayPotId) ?? allPots[0]

  if (!currentVariant || !currentPot) {
    return null
  }

  const toggleVariant = (id: number) => {
    const nextVariant = product.variants.find((variant) => variant.id === id)
    if (!nextVariant) return

    setVariantId(nextVariant.id)
    setPotId(nextVariant.pots[0]?.id ?? 0)
    setHoveredPotId(null)
    setHoveredVariantId(null)
  }

  const handleVariantHover = (id: number) => {
    const hoveredVariant = product.variants.find((variant) => variant.id === id)
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
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Image */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="aspect-square rounded-2xl overflow-hidden shadow-elevated relative">
          <Image src={product.image} alt={product.name} fill className="object-cover" priority />
        </div>
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <span className="text-sm font-medium text-forest uppercase tracking-wide">
            {product.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-1">{product.name}</h1>
        </div>

        <p className="text-muted-foreground leading-relaxed">{product.description}</p>

        <div onMouseLeave={clearHoverSelection}>
          {hasVariantSelection && (
            <div>
              <span className="text-sm font-medium text-foreground mb-2 block">
                {variantLabel}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.variants.map((variant) => {
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
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
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

          <div className="mt-4">
            <span className="text-sm font-medium text-foreground mb-2 block">Горшок</span>
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
                  aria-label={pot.name}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    hoveredPotId === pot.id
                      ? 'bg-accent text-accent-foreground'
                      : pot.id === potId
                        ? 'bg-forest text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {pot.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center gap-6 pt-2">
          <span className="text-3xl font-bold text-foreground">{currentPot.price} BYN</span>
          <span
            className={`text-sm font-medium px-3 py-1.5 rounded-full ${
              currentPot.inStock
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {currentPot.inStock ? 'В наличии' : 'Под заказ'}
          </span>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-4 pt-4">
          <Button size="lg" asChild className="bg-forest hover:bg-forest/90">
            <Link href="/contacts">
              <Phone className="mr-2 h-4 w-4" />
              Уточнить наличие
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="tel:+375293430006">+375 29 343-00-06</a>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
