'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
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

const perPageOptions = [12, 24, 48] as const

type CatalogSearchParams = Record<string, string | string[] | undefined>

type CatalogClientProps = {
  initialSearchParams: CatalogSearchParams
}

type CatalogState = {
  selectedCategories: string[]
  selectedPots: string[]
  priceRange: [number, number]
  inStockOnly: boolean
  perPage: number
  page: number
}

function splitQueryValue(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function readListParam(value: string | string[] | undefined) {
  if (!value) {
    return []
  }

  const list = Array.isArray(value) ? value.flatMap(splitQueryValue) : splitQueryValue(value)
  return Array.from(new Set(list))
}

function readNumberParam(value: string | string[] | undefined, fallback: number) {
  const raw = Array.isArray(value) ? value[0] : value
  if (!raw) {
    return fallback
  }

  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : fallback
}

function readBooleanParam(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value
  return raw === '1' || raw === 'true'
}

function buildStateFromSearchParams(
  searchParams: CatalogSearchParams,
  minPrice: number,
  maxPrice: number,
  categoryKeys: string[],
  potVolumes: string[],
): CatalogState {
  const categorySet = new Set(categoryKeys)
  const potSet = new Set(potVolumes)

  const selectedCategories = readListParam(searchParams.category).filter((key) =>
    categorySet.has(key),
  )
  const selectedPots = readListParam(searchParams.pot).filter((pot) => potSet.has(pot))

  const rawMin = readNumberParam(searchParams.priceMin, minPrice)
  const rawMax = readNumberParam(searchParams.priceMax, maxPrice)
  const normalizedMin = Math.max(minPrice, Math.min(rawMin, maxPrice))
  const normalizedMax = Math.max(minPrice, Math.min(rawMax, maxPrice))
  const priceRange: [number, number] =
    normalizedMin <= normalizedMax ? [normalizedMin, normalizedMax] : [minPrice, maxPrice]

  const perPageValue = readNumberParam(searchParams.perPage, 12)
  const perPage = perPageOptions.includes(perPageValue as (typeof perPageOptions)[number])
    ? perPageValue
    : 12

  const pageValue = Math.max(1, Math.floor(readNumberParam(searchParams.page, 1)))

  return {
    selectedCategories,
    selectedPots,
    priceRange,
    inStockOnly: readBooleanParam(searchParams.stock),
    perPage,
    page: pageValue,
  }
}

function buildSearchParamsFromState(state: CatalogState, minPrice: number, maxPrice: number) {
  const params = new URLSearchParams()

  if (state.selectedCategories.length > 0) {
    params.set('category', state.selectedCategories.join(','))
  }

  if (state.selectedPots.length > 0) {
    params.set('pot', state.selectedPots.join(','))
  }

  if (state.priceRange[0] > minPrice) {
    params.set('priceMin', String(state.priceRange[0]))
  }

  if (state.priceRange[1] < maxPrice) {
    params.set('priceMax', String(state.priceRange[1]))
  }

  if (state.inStockOnly) {
    params.set('stock', '1')
  }

  if (state.perPage !== 12) {
    params.set('perPage', String(state.perPage))
  }

  if (state.page !== 1) {
    params.set('page', String(state.page))
  }

  return params.toString()
}

export function CatalogClient({ initialSearchParams }: CatalogClientProps) {
  const router = useRouter()
  const pathname = usePathname()

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

  const initialState = useMemo(
    () =>
      buildStateFromSearchParams(
        initialSearchParams,
        minPrice,
        maxPrice,
        categories.map((category) => category.key),
        potVolumes,
      ),
    [initialSearchParams, categories, maxPrice, minPrice, potVolumes],
  )

  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialState.selectedCategories,
  )
  const [selectedPots, setSelectedPots] = useState<string[]>(initialState.selectedPots)
  const [priceRange, setPriceRange] = useState<[number, number]>(initialState.priceRange)
  const [inStockOnly, setInStockOnly] = useState(initialState.inStockOnly)
  const [perPage, setPerPage] = useState<number>(initialState.perPage)
  const [page, setPage] = useState<number>(initialState.page)

  const initialQuery = useMemo(
    () =>
      buildSearchParamsFromState(
        {
          selectedCategories: initialState.selectedCategories,
          selectedPots: initialState.selectedPots,
          priceRange: initialState.priceRange,
          inStockOnly: initialState.inStockOnly,
          perPage: initialState.perPage,
          page: initialState.page,
        },
        minPrice,
        maxPrice,
      ),
    [initialState, maxPrice, minPrice],
  )
  const lastSyncedQueryRef = useRef(initialQuery)

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
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  useEffect(() => {
    const nextQuery = buildSearchParamsFromState(
      { selectedCategories, selectedPots, priceRange, inStockOnly, perPage, page },
      minPrice,
      maxPrice,
    )

    if (nextQuery === lastSyncedQueryRef.current) {
      return
    }

    lastSyncedQueryRef.current = nextQuery
    const href = nextQuery ? `${pathname}?${nextQuery}` : pathname
    router.replace(href, { scroll: false })
  }, [
    inStockOnly,
    maxPrice,
    minPrice,
    page,
    pathname,
    perPage,
    priceRange,
    router,
    selectedCategories,
    selectedPots,
  ])

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
    setPage(1)
  }

  const togglePot = (pot: string) => {
    setSelectedPots((prev) => (prev.includes(pot) ? prev.filter((p) => p !== pot) : [...prev, pot]))
    setPage(1)
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
      <section className="bg-cream-dark py-12">
        <div className="container">
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Каталог</span>
          </nav>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Каталог растений</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
            <div className="mb-6 lg:hidden">
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
                  <span className="bg-forest text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                    Активны
                  </span>
                )}
              </Button>
            </div>

            <aside className={`${showFilters ? 'block' : 'hidden'} mb-8 lg:mb-0 lg:block`}>
              <div className="bg-card shadow-soft sticky top-24 rounded-xl p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Фильтры</h3>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                      Сбросить
                    </button>
                  )}
                </div>

                <div className="mb-6">
                  <p className="mb-3 text-sm font-medium text-foreground">Категория</p>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat.key} className="flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.key)}
                          onChange={() => toggleCategory(cat.key)}
                          className="accent-forest h-4 w-4 rounded border-border"
                        />
                        <span className="text-sm text-muted-foreground">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="mb-3 text-sm font-medium text-foreground">Объём горшка</p>
                  <div className="flex flex-wrap gap-2">
                    {potVolumes.map((pot) => (
                      <button
                        key={pot}
                        type="button"
                        onClick={() => togglePot(pot)}
                        className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
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
                  <p className="mb-3 text-sm font-medium text-foreground">
                    Цена: {priceRange[0]} - {priceRange[1]} BYN
                  </p>
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => {
                      setPriceRange([value[0] ?? minPrice, value[1] ?? maxPrice])
                      setPage(1)
                    }}
                    min={minPrice}
                    max={maxPrice}
                    step={1}
                    minStepsBetweenThumbs={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(event) => {
                        setInStockOnly(event.target.checked)
                        setPage(1)
                      }}
                      className="accent-forest h-4 w-4 rounded border-border"
                    />
                    <span className="text-sm text-muted-foreground">Только в наличии</span>
                  </label>
                </div>
              </div>
            </aside>

            <div>
              {filteredProducts.length > 0 ? (
                <>
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-muted-foreground">
                      Показано {(page - 1) * perPage + 1}–
                      {Math.min(page * perPage, filteredProducts.length)} из{' '}
                      {filteredProducts.length}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="hidden text-sm text-muted-foreground sm:block">
                        На странице
                      </span>
                      <Select
                        value={String(perPage)}
                        onValueChange={(value: string) => {
                          setPerPage(Number(value))
                          setPage(1)
                        }}
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

                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
                  className="py-16 text-center"
                >
                  <p className="mb-4 text-muted-foreground">
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
