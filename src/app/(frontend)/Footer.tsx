import { ClockIcon } from '@/components/icons/Clock'
import { LogoIcon } from '@/components/icons/Logo'
import { MapPinIcon } from '@/components/icons/MapPin'
import { PhoneIcon } from '@/components/icons/Phone'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-cream-dark">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <LogoIcon />
              <span className="text-xl font-bold tracking-tight text-foreground">Underwood</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Питомник растений в Беларуси. Выращиваем хвойные и ягодные культуры с заботой и
              опытом.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Навигация</h4>
            <nav className="flex flex-col gap-2">
              {[
                { href: '/catalog', label: 'Каталог растений' },
                { href: '/about', label: 'О питомнике' },
                { href: '/blog', label: 'Блог' },
                { href: '/gallery', label: 'Фото питомника' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Категории</h4>
            <nav className="flex flex-col gap-2">
              {[
                { href: '/catalog?category=conifers', label: 'Хвойные' },
                { href: '/catalog?category=berries', label: 'Ягодные' },
                { href: '/catalog?category=foliage', label: 'Лиственные' },
                { href: '/catalog?category=perennials', label: 'Многолетние' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Контакты</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <PhoneIcon className="h-5 w-5 shrink-0" />
                <span className="text-sm text-muted-foreground">+375 29 343-00-06</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Минская обл., Минский р-н, д. Обчак, ул. Западная
                </span>
              </div>
              <div className="flex items-start gap-3">
                <ClockIcon className="h-5 w-5 shrink-0" />
                <span className="text-sm text-muted-foreground">Пн-Пт: 9:00 - 18:00, Сб: 9:00 - 17:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Underwood
          </p>
        </div>
      </div>
    </footer>
  )
}
