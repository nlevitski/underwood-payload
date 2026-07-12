'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DBProduct } from '../dbProducts'
import { ProductImageSlider } from '../../_components/productImageSlider/ProductImageSlider'

type VariantWithValue = {
  value: string
  postfix: string
}

const valueMap = {
  size: 'Размер',
  age: 'Возраст',
}

export function ProductClient({ product, phone }: { product: DBProduct; phone: string }) {
  const initialVariant = product.variants[0]
  const initialPot = initialVariant?.pots[0]
  const hasVariantSelection = product.valueType !== 'none'
  const variantLabel = product.valueType === 'none' ? null : valueMap[product.valueType]
  const allPots = product.variants.flatMap((variant) => variant.pots)

  const [variantId, setVariantId] = useState<number>(initialVariant?.id ?? 0)
  const [potId, setPotId] = useState<number>(initialPot?.id ?? 0)

  const currentVariant =
    product.variants.find((variant) => variant.id === variantId) ?? initialVariant
  const currentPot = hasVariantSelection
    ? (currentVariant?.pots.find((pot) => pot.id === potId) ?? currentVariant?.pots[0])
    : (allPots.find((pot) => pot.id === potId) ?? allPots[0])

  if (!currentVariant || !currentPot) {
    return null
  }

  const toggleVariant = (id: number) => {
    const nextVariant = product.variants.find((variant) => variant.id === id)
    if (!nextVariant) return

    setVariantId(nextVariant.id)
    setPotId(nextVariant.pots[0]?.id ?? 0)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Image */}
      <div>
        <div className="aspect-square rounded-2xl overflow-hidden shadow-elevated relative">
          <ProductImageSlider
            images={currentPot.images}
            fallbackImage={product.image}
            productName={product.name}
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </div>
      </div>

      {/* Info */}
      <div className="space-y-6">
        <div>
          <span className="text-sm font-medium text-forest uppercase tracking-wide">
            {product.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-1">{product.name}</h1>
        </div>

        <p className="text-muted-foreground leading-relaxed">{product.description}</p>

        <div>
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
                  }}
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
      </div>
    </div>
  )
}
