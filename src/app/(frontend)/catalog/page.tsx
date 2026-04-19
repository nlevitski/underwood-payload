'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import * as motion from 'motion/react-client'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlantCard } from '../_components/plantCard/PlantCard'
import { products, categories as categoriesMap } from './products'

const categoryQueryMap = {
  berry: 'berries',
  coniferous: 'conifers',
  deciduous: 'foliage',
} as const

const perPageOptions = [12, 24, 48] as const

export default function CatalogPage() {
  const searchParams = useSearchParams()

  // Calculate dynamic filter values from products
  const { categories, potVolumes, minPrice, maxPrice } = useMemo(() => {
    const categoryKeys = new Set<string>()
    const pots = new Set<string>()
    let min = Infinity
    let max = -Infinity

    products.forEach((product) => {
      categoryKeys.add(product.categoryKey)
      product.pots.forEach((pot) => {
        pots.add(pot.name)
        pot.variants.forEach((variant) => {
          if (variant.price < min) min = variant.price
          if (variant.price > max) max = variant.price
        })
      })
    })

    return {
      categories: Array.from(categoryKeys).map((key) => ({
        key,
        label: categoriesMap[key as keyof typeof categoriesMap],
      })),
      potVolumes: Array.from(pots).sort((left, right) => {
        const leftValue = Number(left.replace(/[^\d]/g, ''))
        const rightValue = Number(right.replace(/[^\d]/g, ''))

        if (Number.isNaN(leftValue) || Number.isNaN(rightValue)) {
          return left.localeCompare(right, 'ru')
        }

        return leftValue - rightValue || left.localeCompare(right, 'ru')
      }),
      minPrice: Number.isFinite(min) ? Math.floor(min) : 0,
      maxPrice: Number.isFinite(max) ? Math.ceil(max) : 0,
    }
  }, [])

  const initialCategories = useMemo(() => {
    const categoryParam = searchParams.get('category')
    if (!categoryParam) return []

    const mappedCategory = categoryQueryMap[categoryParam as keyof typeof categoryQueryMap]
    return mappedCategory ? [mappedCategory] : [categoryParam]
  }, [searchParams])

  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories)
  const [selectedPots, setSelectedPots] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [perPage, setPerPage] = useState<number>(12)
  const [page, setPage] = useState<number>(1)

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.categoryKey)) {
        return false
      }

      return product.pots.some((pot) => {
        if (selectedPots.length > 0 && !selectedPots.includes(pot.name)) {
          return false
        }

        return pot.variants.some((variant) => {
          if (variant.price < priceRange[0] || variant.price > priceRange[1]) {
            return false
          }

          if (inStockOnly && !variant.inStock) {
            return false
          }

          return true
        })
      })
    })
  }, [selectedCategories, selectedPots, priceRange, inStockOnly])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage))

  useEffect(() => {
    setPage(1)
  }, [selectedCategories, selectedPots, priceRange, inStockOnly, perPage])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * perPage
    return filteredProducts.slice(start, start + perPage)
  }, [filteredProducts, page, perPage])

  const pageItems: (number | 'ellipsis')[] = useMemo(() => {
    const items: (number | 'ellipsis')[] = []

    if (totalPages <= 7) {
      for (let index = 1; index <= totalPages; index += 1) {
        items.push(index)
      }
      return items
    }

    items.push(1)

    if (page > 3) items.push('ellipsis')

    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)

    for (let index = start; index <= end; index += 1) {
      items.push(index)
    }

    if (page < totalPages - 2) items.push('ellipsis')

    items.push(totalPages)
    return items
  }, [page, totalPages])

  const toggleCategory = (key: string) => {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key],
    )
  }

  const togglePot = (pot: string) => {
    setSelectedPots((prev) => (prev.includes(pot) ? prev.filter((p) => p !== pot) : [...prev, pot]))
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedPots([])
    setPriceRange([minPrice, maxPrice])
    setInStockOnly(false)
    setPage(1)
  }

  const goToPage = (nextPage: number) => {
    const clampedPage = Math.min(Math.max(1, nextPage), totalPages)
    setPage(clampedPage)

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedPots.length > 0 ||
    priceRange[0] > minPrice ||
    priceRange[1] < maxPrice ||
    inStockOnly

  return (
    <>
      <section className="py-12 bg-cream-dark">
        <div className="container">
          <nav className="text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Каталог</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Каталог растений</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                onClick={() => setShowFilters((prev) => !prev)}
                className="w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Фильтры
                </span>
                {hasActiveFilters && (
                  <span className="bg-forest text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    Активны
                  </span>
                )}
              </Button>
            </div>

            <aside className={`${showFilters ? 'block' : 'hidden'} lg:block mb-8 lg:mb-0`}>
              <div className="bg-card rounded-xl p-6 shadow-soft sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-foreground">Фильтры</h3>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      Сбросить
                    </button>
                  )}
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-3">Категория</p>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat.key} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.key)}
                          onChange={() => toggleCategory(cat.key)}
                          className="h-4 w-4 rounded border-border accent-forest"
                        />
                        <span className="text-sm text-muted-foreground">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-3">Объём горшка</p>
                  <div className="flex flex-wrap gap-2">
                    {potVolumes.map((pot) => (
                      <button
                        key={pot}
                        type="button"
                        onClick={() => togglePot(pot)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedPots.includes(pot)
                            ? 'bg-forest text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-accent'
                        }`}
                      >
                        {pot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-3">
                    Цена: {priceRange[0]} - {priceRange[1]} BYN
                  </p>
                  <Slider
                    value={priceRange}
                    onValueChange={(value) =>
                      setPriceRange([value[0] ?? minPrice, value[1] ?? maxPrice])
                    }
                    min={minPrice}
                    max={maxPrice}
                    step={1}
                    minStepsBetweenThumbs={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(event) => setInStockOnly(event.target.checked)}
                      className="h-4 w-4 rounded border-border accent-forest"
                    />
                    <span className="text-sm text-muted-foreground">Только в наличии</span>
                  </label>
                </div>
              </div>
            </aside>

            <div>
              {filteredProducts.length > 0 ? (
                <>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                    <p className="text-sm text-muted-foreground">
                      Показано {(page - 1) * perPage + 1}–
                      {Math.min(page * perPage, filteredProducts.length)} из{' '}
                      {filteredProducts.length}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground hidden sm:block">
                        На странице
                      </span>
                      <Select
                        value={String(perPage)}
                        onValueChange={(value: string) => setPerPage(Number(value))}
                      >
                        <SelectTrigger id="per-page" className="h-8 w-[72px] px-2 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {perPageOptions.map((option) => (
                            <SelectItem key={option} value={String(option)}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedProducts.map((product) => (
                      <PlantCard key={product.id} {...product} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <Pagination className="mt-10">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            disabled={page === 1}
                            onClick={() => goToPage(page - 1)}
                            className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>

                        {pageItems.map((item, index) =>
                          item === 'ellipsis' ? (
                            <PaginationItem key={`ellipsis-${index}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={item}>
                              <PaginationLink
                                isActive={item === page}
                                onClick={() => goToPage(item)}
                              >
                                {item}
                              </PaginationLink>
                            </PaginationItem>
                          ),
                        )}

                        <PaginationItem>
                          <PaginationNext
                            disabled={page === totalPages}
                            onClick={() => goToPage(page + 1)}
                            className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <p className="text-muted-foreground mb-4">
                    Растения не найдены по заданным фильтрам
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Сбросить фильтры
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
