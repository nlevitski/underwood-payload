import Link from 'next/link'
import { Hero } from '../hero/Hero'

export function AboutHero() {
  return (
    <Hero
      title="О питомнике Underwood"
      subtitle={null}
      description="Питомник с 10-летним опытом выращивания хвойных и ягодных культур в Беларуси"
      heightClassName="py-20 md:py-32"
      containerPaddingClassName=""
      titleClassName="text-4xl md:text-5xl"
      breadcrumb={
        <nav className="text-sm text-primary-foreground/70">
          <Link href="/" className="hover:text-primary-foreground transition-colors">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <span>О питомнике</span>
        </nav>
      }
      actions={null}
      overlayClassName="bg-foreground/60"
    />
  )
}
