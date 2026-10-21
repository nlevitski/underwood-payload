'use client'

import { Dialog } from 'radix-ui'
import Link from 'next/link'
import { ArrowRight, ChevronDown, ChevronRight, Search, X } from 'lucide-react'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import { useRouter } from 'next/navigation'
import {
  catalogSearchHref,
  hasCatalogFilters,
  MAX_SEARCH_LENGTH,
  offerCount,
  plantCount,
  type SearchGroup,
  type SearchResults,
} from './searchResults'

type Anchor = { left: number; top: number; width: number; bottom: number }

function ResultGroup({
  group,
  expanded,
  toggle,
  onNavigate,
}: {
  group: SearchGroup
  expanded: boolean
  toggle: () => void
  onNavigate: () => void
}) {
  const primary = group.primary
  const label = group.valueType === 'size' ? 'Размер' : 'Возраст'
  return (
    <article
      className={`search-group ${expanded ? 'is-expanded' : ''}`}
      data-item-id={group.itemId}
    >
      <div className="search-group-summary">
        <Link href={primary.href} className="search-primary" onNavigate={onNavigate}>
          {/* The thumbnail belongs to this exact offer, with the catalog's category fallback. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={primary.image} alt="" width={64} height={64} />
          <div>
            <h3>{group.name}</h3>
            {expanded ? (
              <p>{offerCount(group.offers.length)}</p>
            ) : (
              <>
                <p>
                  {primary.value
                    ? `${primary.value} · горшок ${primary.pot}`
                    : `Горшок ${primary.pot}`}
                </p>
                <div className="search-price">
                  <strong>{primary.price} BYN</strong>
                  <small>{primary.inStock ? 'В наличии' : 'Под заказ'}</small>
                </div>
              </>
            )}
          </div>
        </Link>
        {group.offers.length > 1 && (
          <button
            type="button"
            className="search-expand"
            aria-expanded={expanded}
            aria-controls={`search-offers-${group.itemId}`}
            aria-label={`${expanded ? 'Свернуть' : `Ещё ${group.offers.length - 1}`} — ${group.name}`}
            onClick={toggle}
          >
            <span>{expanded ? 'Свернуть' : `Ещё ${group.offers.length - 1}`}</span>
            <ChevronDown size={18} />
          </button>
        )}
      </div>
      {expanded && (
        <div
          id={`search-offers-${group.itemId}`}
          className={`search-offers ${group.valueType === 'none' ? 'pots-only' : ''}`}
        >
          <div className="search-offer-head" aria-hidden="true">
            {group.valueType !== 'none' && <span>{label}</span>}
            <span>Горшок</span>
            <span>Цена</span>
            <span className="search-stock-heading">Наличие</span>
            <span />
          </div>
          {group.offers.map((offer) => (
            <Link key={offer.id} href={offer.href} className="search-offer" onNavigate={onNavigate}>
              {group.valueType !== 'none' && <span>{offer.value}</span>}
              <span>{offer.pot}</span>
              <strong>{offer.price} BYN</strong>
              <small className={offer.inStock ? '' : 'on-order'}>
                {offer.inStock ? 'В наличии' : 'Под заказ'}
              </small>
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}

export function SearchPanel({
  open,
  onOpenChange,
  initialQuery,
  anchorRef,
  openerRef,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialQuery: string
  anchorRef: RefObject<HTMLButtonElement | null>
  openerRef: RefObject<HTMLElement | null>
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const expansionAnchor = useRef<{ id: number; top: number } | null>(null)
  const [draftQuery, setDraftQuery] = useState(initialQuery)
  const [result, setResult] = useState<SearchResults | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [retry, setRetry] = useState(0)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [anchor, setAnchor] = useState<Anchor>({ left: 24, top: 22, width: 480, bottom: 58 })
  const [viewport, setViewport] = useState({ height: 0, top: 0 })
  const [filteredCatalog, setFilteredCatalog] = useState(false)

  useEffect(() => {
    if (!open) return
    setDraftQuery(initialQuery)
    setExpandedId(null)
    setResult(null)
    setStatus(initialQuery.trim() ? 'loading' : 'idle')
    setFilteredCatalog(hasCatalogFilters(window.location.pathname, window.location.search))
    const measure = () => {
      const rect = anchorRef.current?.getBoundingClientRect()
      if (rect)
        setAnchor({ left: rect.left, top: rect.top, width: rect.width, bottom: rect.bottom })
      setViewport({
        height: window.visualViewport?.height ?? window.innerHeight,
        top: window.visualViewport?.offsetTop ?? 0,
      })
    }
    measure()
    window.addEventListener('resize', measure)
    window.visualViewport?.addEventListener('resize', measure)
    window.visualViewport?.addEventListener('scroll', measure)
    return () => {
      window.removeEventListener('resize', measure)
      window.visualViewport?.removeEventListener('resize', measure)
      window.visualViewport?.removeEventListener('scroll', measure)
    }
  }, [open, initialQuery, anchorRef])

  useEffect(() => {
    if (!open || !draftQuery.trim()) {
      setStatus('idle')
      setResult(null)
      return
    }
    let current = true
    const controller = new AbortController()
    setStatus('loading')
    setResult(null)
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/plant-search?q=${encodeURIComponent(draftQuery.trim())}`,
          { signal: controller.signal },
        )
        if (!response.ok) throw new Error('Search failed')
        const data: SearchResults = await response.json()
        if (current) {
          setResult(data)
          setStatus('ready')
        }
      } catch {
        if (current) setStatus('error')
      }
    }, 150)
    return () => {
      current = false
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [draftQuery, open, retry])

  useLayoutEffect(() => {
    const saved = expansionAnchor.current
    const results = resultsRef.current
    if (!saved || !results) return
    const group = results.querySelector<HTMLElement>(`[data-item-id="${saved.id}"]`)
    if (group) results.scrollTop += group.getBoundingClientRect().top - saved.top
    expansionAnchor.current = null
  }, [expandedId])

  const submit = () => {
    const href = catalogSearchHref(window.location.pathname, window.location.search, draftQuery)
    onOpenChange(false)
    router.push(href)
  }
  const style = {
    '--search-left': `${anchor.left}px`,
    '--search-top': `${anchor.top}px`,
    '--search-width': `${anchor.width}px`,
    '--search-panel-top': `${anchor.bottom + 12}px`,
    '--search-panel-left': `${Math.min(anchor.left, Math.max(16, (typeof window === 'undefined' ? 1440 : window.innerWidth) - 736))}px`,
    '--search-viewport': viewport.height ? `${viewport.height}px` : '100dvh',
    '--search-viewport-top': `${viewport.top}px`,
  } as CSSProperties

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="search-overlay" />
        <Dialog.Content
          className="search-dialog"
          style={style}
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            inputRef.current?.focus({ preventScroll: true })
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            const opener = openerRef.current
            requestAnimationFrame(() => {
              const isVisible = (node: HTMLElement | null) =>
                Boolean(
                  node &&
                  node.getBoundingClientRect().bottom > 0 &&
                  node.getBoundingClientRect().width > 0 &&
                  getComputedStyle(node).visibility !== 'hidden',
                )
              const target = isVisible(opener)
                ? opener
                : Array.from(
                    document.querySelectorAll<HTMLElement>(
                      '[data-search-fallback], .header-search',
                    ),
                  ).find((node) => isVisible(node))
              target?.focus({ preventScroll: true })
            })
          }}
        >
          <div className="search-panel-heading">
            <Dialog.Title className="search-title">
              <span className="search-touch-title">Поиск растений</span>
              <span className="search-desktop-title">
                {draftQuery.trim() ? `По запросу «${draftQuery.trim()}»` : 'Поиск растений'}
              </span>
            </Dialog.Title>
            <Dialog.Close className="search-icon-button search-close" aria-label="Закрыть поиск">
              <X size={20} />
            </Dialog.Close>
          </div>
          <form
            className="search-form"
            role="search"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
            <label htmlFor="global-search-input" className="sr-only">
              Название растения
            </label>
            <Search className="search-field-icon" size={20} aria-hidden="true" />
            <input
              id="global-search-input"
              ref={inputRef}
              name="q"
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              placeholder="Название растения"
              maxLength={MAX_SEARCH_LENGTH}
              value={draftQuery}
              onChange={(event) => {
                setDraftQuery(event.target.value)
                setExpandedId(null)
              }}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' &&
                  (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)
                )
                  event.preventDefault()
              }}
            />
            {draftQuery && (
              <button
                type="button"
                className="search-icon-button"
                aria-label="Очистить запрос"
                onClick={() => {
                  setDraftQuery('')
                  inputRef.current?.focus()
                }}
              >
                <X size={18} />
              </button>
            )}
            <button type="submit" className="search-submit" aria-label="Искать в каталоге">
              <Search size={20} />
            </button>
          </form>
          <p className="search-status" role="status" aria-live="polite" aria-atomic="true">
            {status === 'loading'
              ? 'Ищем растения…'
              : status === 'ready' && result
                ? `${plantCount(result.plants)} · ${offerCount(result.offers)}`
                : ''}
          </p>
          <div ref={resultsRef} className="search-results" aria-busy={status === 'loading'}>
            {status === 'idle' && (
              <div className="search-message">
                <h3>Найдите растение по названию</h3>
                <p>Например, туя Смарагд или лаванда</p>
              </div>
            )}
            {status === 'error' && (
              <div className="search-message">
                <h3>Не удалось загрузить растения</h3>
                <p>Попробуйте ещё раз или перейдите в каталог.</p>
                <button
                  type="button"
                  className="search-retry"
                  onClick={() => setRetry((value) => value + 1)}
                >
                  Повторить
                </button>
              </div>
            )}
            {status === 'ready' && result?.plants === 0 && (
              <div className="search-message">
                <h3>Ничего не найдено</h3>
                <p>Попробуйте другое название растения.</p>
              </div>
            )}
            {status === 'ready' &&
              result?.groups.map((group) => (
                <ResultGroup
                  key={group.itemId}
                  group={group}
                  expanded={expandedId === group.itemId}
                  onNavigate={() => onOpenChange(false)}
                  toggle={() => {
                    const node = resultsRef.current?.querySelector<HTMLElement>(
                      `[data-item-id="${group.itemId}"]`,
                    )
                    if (node)
                      expansionAnchor.current = {
                        id: group.itemId,
                        top: node.getBoundingClientRect().top,
                      }
                    inputRef.current?.blur()
                    setExpandedId((value) => (value === group.itemId ? null : group.itemId))
                  }}
                />
              ))}
          </div>
          <div className="search-footer">
            {filteredCatalog && <p>С учётом фильтров каталога</p>}
            <button type="button" className="search-catalog" onClick={submit}>
              <span>
                {status === 'ready' && result && result.plants > 0
                  ? `${result.plants === 1 ? 'Показать' : 'Все'} ${plantCount(result.plants)} в каталоге`
                  : 'Перейти в каталог'}
              </span>
              <ArrowRight size={20} />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
