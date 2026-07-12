import Link from 'next/link'
import { Hero } from '../hero/Hero'

type AboutHeroProps = {
  heading: string
  description: string
  imageSrc?: string
}

export function AboutHero({ heading, description, imageSrc }: AboutHeroProps) {
  return (
    <Hero
      title={heading}
      subtitle={null}
      description={description}
      imageSrc={imageSrc}
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
