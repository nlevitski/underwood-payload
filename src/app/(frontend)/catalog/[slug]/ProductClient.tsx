'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as motion from 'motion/react-client'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product, AgeType, SizeType, AgePostfix, SizePostfix } from '../products'

type VariantWithValue = {
  id: number
  price: number
  inStock: boolean
  value: AgeType | SizeType
  postfix: AgePostfix | SizePostfix
}

const valueMap = {
  size: 'Размер',
  age: 'Возраст',
}

export function ProductClient({ product }: { product: Product }) {
  const [potId, setPotId] = useState<number>(product.pots[0].id)
  const [variantId, setVariantId] = useState(product.pots[0].variants[0].id)

  // Hover states
  const [hoveredPotId, setHoveredPotId] = useState<number | null>(null)
  const [hoveredVariantId, setHoveredVariantId] = useState<number | null>(null)

  // Use hovered values if hovering, otherwise use selected values
  const displayPotId = hoveredPotId ?? potId
  const displayVariantId = hoveredVariantId ?? variantId

  const currentPot = product.pots.find((p) => p.id === displayPotId)!
  const currentVariant = currentPot.variants.find((v) => v.id === displayVariantId)!

  const togglePot = (id: number) => {
    const newCurrentPot = product.pots.find((p) => p.id === id)!
    const newCurVariantId = newCurrentPot.variants[0].id
    setPotId(newCurrentPot.id)
    setVariantId(newCurVariantId)
    setHoveredPotId(null)
    setHoveredVariantId(null)
  }

  const handlePotHover = (id: number) => {
    setHoveredPotId(id)
    const hoveredPot = product.pots.find((p) => p.id === id)!
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

        {/* Pot selector */}
        <div>
          <span className="text-sm font-medium text-foreground mb-2 block">Объём горшка</span>
          <div className="flex flex-wrap gap-1.5">
            {product.pots.map((pot) => (
              <button
                key={pot.id}
                type="button"
                onClick={() => togglePot(pot.id)}
                onMouseEnter={() => handlePotHover(pot.id)}
                onMouseLeave={handlePotLeave}
                aria-label={pot.name}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
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

        {/* Value selector (age/size) - only if not 'none' */}
        {product.valueType !== 'none' && (
          <div>
            <span className="text-sm font-medium text-foreground mb-2 block">
              {valueMap[product.valueType]}
            </span>
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
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
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

        {/* Price & Stock */}
        <div className="flex items-center gap-6 pt-2">
          <span className="text-3xl font-bold text-foreground">{currentVariant.price} BYN</span>
          <span
            className={`text-sm font-medium px-3 py-1.5 rounded-full ${
              currentVariant.inStock
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {currentVariant.inStock ? 'В наличии' : 'Под заказ'}
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
