'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import * as motion from 'motion/react-client'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DBProduct } from '../dbProducts'
import { ProductImageSlider } from '../../_components/productImageSlider/ProductImageSlider'
import {
  productSelectionParams,
  resolveProductSelection,
  type ProductSelection,
} from '../productSelection'

type VariantWithValue = {
  value: string
  postfix: string
}

const valueMap = {
  size: 'Размер',
  age: 'Возраст',
}

export function ProductClient({
  product,
  phone,
  initialSelection,
  selectionQuery,
}: {
  product: DBProduct
  phone: string
  initialSelection: ProductSelection | null
  selectionQuery: string
}) {
  const initialVariant = product.variants[0]
  const initialPot = initialVariant?.pots[0]
  const hasVariantSelection = product.valueType !== 'none'
  const variantLabel = product.valueType === 'none' ? null : valueMap[product.valueType]
  const allPots = product.variants.flatMap((variant) => variant.pots)

  const [variantId, setVariantId] = useState<number>(
    initialSelection?.variantId ?? initialVariant?.id ?? 0,
  )
  const [potId, setPotId] = useState<number>(initialSelection?.potId ?? initialPot?.id ?? 0)

  // Hover states
  const [hoveredPotId, setHoveredPotId] = useState<number | null>(null)
  const [hoveredVariantId, setHoveredVariantId] = useState<number | null>(null)

  useEffect(() => {
    const syncFromURL = () => {
      const url = new URL(window.location.href)
      const selection = resolveProductSelection(product, url.searchParams)
      if (!selection) return

      setVariantId(selection.variantId)
      setPotId(selection.potId)
      setHoveredPotId(null)
      setHoveredVariantId(null)

      if (['size', 'age', 'pot'].some((key) => url.searchParams.has(key))) {
        const normalized = productSelectionParams(product, selection, url.searchParams)
        if (normalized.toString() !== url.searchParams.toString()) {
          window.history.replaceState(null, '', `${url.pathname}?${normalized}${url.hash}`)
        }
      }
    }

    syncFromURL()
    window.addEventListener('popstate', syncFromURL)
    return () => window.removeEventListener('popstate', syncFromURL)
  }, [product, selectionQuery])

  // Use hovered values if hovering, otherwise use selected values
  const displayPotId = hoveredPotId ?? potId
  const displayVariantId = hoveredVariantId ?? variantId

  const currentVariant =
    product.variants.find((variant) => variant.id === displayVariantId) ?? initialVariant
  const currentPot = hasVariantSelection
    ? (currentVariant?.pots.find((pot) => pot.id === displayPotId) ?? currentVariant?.pots[0])
    : (allPots.find((pot) => pot.id === displayPotId) ?? allPots[0])

  if (!currentVariant || !currentPot) {
    return null
  }

  const selectCombination = (selection: ProductSelection) => {
    setVariantId(selection.variantId)
    setPotId(selection.potId)
    setHoveredPotId(null)
    setHoveredVariantId(null)

    const url = new URL(window.location.href)
    const params = productSelectionParams(product, selection, url.searchParams)
    window.history.replaceState(null, '', `${url.pathname}?${params}${url.hash}`)
  }

  const toggleVariant = (id: number) => {
    const nextVariant = product.variants.find((variant) => variant.id === id)
    if (!nextVariant) return

    const nextPot = nextVariant.pots.find((pot) => pot.id === potId) ?? nextVariant.pots[0]
    if (nextPot) selectCombination({ variantId: nextVariant.id, potId: nextPot.id })
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
        className="w-full min-w-0"
      >
        <div className="relative w-full min-w-0 aspect-square overflow-hidden rounded-2xl shadow-elevated">
          <ProductImageSlider
            images={currentPot.images}
            fallbackImage={product.image}
            productName={product.name}
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
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
              <span className="text-sm font-medium text-foreground mb-2 block">{variantLabel}</span>
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
                      aria-pressed={variant.id === variantId}
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
                    const owner = hasVariantSelection
                      ? currentVariant
                      : product.variants.find((variant) =>
                          variant.pots.some((entry) => entry.id === pot.id),
                        )
                    if (owner) selectCombination({ variantId: owner.id, potId: pot.id })
                  }}
                  onMouseEnter={() => handlePotHover(pot.id)}
                  aria-label={pot.name}
                  aria-pressed={pot.id === potId}
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
            <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
