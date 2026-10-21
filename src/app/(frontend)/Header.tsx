'use client'

import { LogoIcon } from '@/components/icons/Logo'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { SearchPanel } from './search/SearchPanel'
import './search/search.css'

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/about', label: 'О питомнике' },
  { href: '/catalog', label: 'Каталог' },
  { href: '/blog', label: 'Блог' },
  { href: '/gallery', label: 'Фото' },
  { href: '/contacts', label: 'Контакты' },
]

export function Header({ siteName = 'Underwood' }: { siteName?: string }) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [initialQuery, setInitialQuery] = useState('')
  const [fieldGone, setFieldGone] = useState(false)
  const desktopField = useRef<HTMLButtonElement>(null)
  const touchField = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setIsSearchOpen(false)
    setIsMenuOpen(false)
  }, [pathname])
  useEffect(() => {
    const close = () => {
      setIsSearchOpen(false)
      setIsMenuOpen(false)
    }
    window.addEventListener('popstate', close)
    const measure = () => {
      const field = touchField.current?.getBoundingClientRect()
      const row = document.querySelector('.header-row')?.getBoundingClientRect()
      if (field && row) setFieldGone(field.bottom <= row.bottom)
    }
    const onResize = () => {
      measure()
      if (window.innerWidth >= 768) setIsMenuOpen(false)
    }
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('popstate', close)
    }
  }, [])
  const openSearch = (opener: HTMLElement) => {
    openerRef.current = opener
    setInitialQuery(
      window.location.pathname === '/catalog'
        ? (new URLSearchParams(window.location.search).get('q') ?? '')
        : '',
    )
    setIsMenuOpen(false)
    setIsSearchOpen(true)
  }
  const navigation = (mobile = false) => (
    <nav
      aria-label={mobile ? 'Мобильная навигация' : 'Основная навигация'}
      className={mobile ? 'container flex flex-col gap-1 py-4' : 'header-nav'}
    >
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setIsMenuOpen(false)}
          className={`${mobile ? 'px-4 py-3' : ''} rounded-lg text-sm font-medium transition-colors ${pathname === link.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )

  return (
    <>
      <header className="site-header">
        <div className="container header-row">
          <Link
            href="/"
            className="header-logo flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <LogoIcon />
            <span className="text-xl font-bold tracking-tight text-foreground">{siteName}</span>
          </Link>
          <button
            ref={desktopField}
            type="button"
            className="header-search header-search-desktop"
            aria-label="Поиск растений"
            aria-haspopup="dialog"
            onClick={(event) => openSearch(event.currentTarget)}
          >
            <Search size={20} />
            <span>Название растения</span>
          </button>
          <div className="header-actions">
            <button
              type="button"
              data-search-fallback
              className={`header-search-scrolled search-icon-button ${fieldGone ? 'is-visible' : ''}`}
              aria-label="Открыть поиск"
              aria-haspopup="dialog"
              tabIndex={fieldGone ? 0 : -1}
              onClick={(event) => openSearch(event.currentTarget)}
            >
              <Search size={20} />
            </button>
            {navigation()}
            <Button
              variant="ghost"
              size="icon"
              className="header-menu-button"
              aria-label="Меню"
              aria-expanded={isMenuOpen}
              onClick={() => {
                setIsSearchOpen(false)
                setIsMenuOpen(!isMenuOpen)
              }}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
        {isMenuOpen && navigation(true)}
      </header>
      <div className="header-search-row">
        <div className="container">
          <button
            type="button"
            ref={touchField}
            className="header-search"
            aria-label="Поиск растений"
            aria-haspopup="dialog"
            onClick={(event) => openSearch(event.currentTarget)}
          >
            <Search size={20} />
            <span>Поиск растений</span>
          </button>
        </div>
      </div>
      <SearchPanel
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        initialQuery={initialQuery}
        anchorRef={desktopField}
        openerRef={openerRef}
      />
    </>
  )
}
