import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

type CategoryTone = 'conifers' | 'berries' | 'foliage' | 'perennials'

interface CategoryCardProps {
  title: string
  description: string
  image: string
  href: string
  category: CategoryTone
  chips: string[]
}

const toneMap: Record<CategoryTone, string> = {
  conifers: 'oklch(28% 0.06 154)',
  berries: 'oklch(45% 0.12 337)',
  foliage: 'oklch(45% 0.105 255)',
  perennials: 'oklch(54% 0.08 72)',
}

const titleMaxWidthMap: Record<CategoryTone, string> = {
  conifers: '8.5ch',
  berries: '8.5ch',
  foliage: '9ch',
  perennials: '10ch',
}

export function CategoryCard({ title, description, image, href, category, chips }: CategoryCardProps) {
  const tone = toneMap[category]

  return (
    <Link
      href={href}
      data-category={category}
      aria-label={`Открыть каталог: ${title}`}
      className={cn(
        'category-card group relative isolate grid aspect-[16/9] overflow-hidden rounded-[24px] border bg-[oklch(99%_0.002_92)] shadow-[0_18px_44px_oklch(26%_0.045_126_/_0.13)] outline-none transition-[border-color,box-shadow] duration-200 ease-out hover:shadow-[0_22px_50px_oklch(26%_0.045_126_/_0.18)] focus-visible:shadow-[0_22px_50px_oklch(26%_0.045_126_/_0.18),_0_0_0_4px_color-mix(in_oklch,var(--focus)_22%,transparent)] focus-visible:ring-0',
        'max-md:min-h-[238px] max-md:aspect-auto max-md:rounded-[20px]',
      )}
      style={
        {
          '--tone': tone,
          borderColor: `color-mix(in oklch, ${tone} 20%, var(--border))`,
        } as CSSProperties
      }
    >
      <div className="card-media absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover [filter:saturate(0.96)_contrast(1.02)] transition-transform duration-[420ms] ease-out group-hover:scale-[1.045] group-focus-visible:scale-[1.045]"
          sizes="(max-width: 760px) 100vw, 50vw"
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, transparent 42%, oklch(12% 0.025 135 / 0.42)), radial-gradient(circle at 18% 16%, color-mix(in oklch, var(--tone) 40%, transparent), transparent 34%)',
        }}
      />

      <span
        aria-hidden="true"
        className={cn(
          'absolute right-[18px] top-[18px] z-20 grid h-[42px] w-[42px] place-items-center rounded-full border opacity-70 transition-[opacity,background-color] duration-200 ease-out group-hover:opacity-100 group-focus-visible:opacity-100',
          'max-md:right-[14px] max-md:top-[14px] max-md:h-[38px] max-md:w-[38px]',
        )}
        style={
          {
            borderColor: `color-mix(in oklch, white 26%, ${tone})`,
            background: `color-mix(in oklch, oklch(16% 0.03 140 / 0.34) 72%, ${tone})`,
            color: 'oklch(98% 0.004 92)',
          } as CSSProperties
        }
      >
        <ArrowUpRight className="h-[18px] w-[18px]" />
      </span>

      <div className="card-content relative z-10 flex h-full min-h-full items-end p-[clamp(18px,2.4vw,30px)] text-[oklch(98%_0.004_92)] [text-shadow:0_1px_16px_oklch(10%_0.02_145_/_0.28)] max-md:p-[18px]">
        <div className="grid gap-3">
          <h3
            className={cn(
              'card-title font-sans text-[clamp(30px,4vw,58px)] font-bold leading-[0.98] tracking-[-0.03em] text-balance',
              'max-w-[7.5ch] max-md:max-w-[9ch] max-md:text-[clamp(30px,11vw,44px)]',
            )}
            style={{ maxWidth: titleMaxWidthMap[category] }}
          >
            {title}
          </h3>

          <div className="chip-row flex w-full flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="chip inline-flex min-h-[30px] items-center rounded-full border px-[11px] py-[7px] text-[13px] font-semibold leading-none tracking-[0.01em] backdrop-blur-[8px] max-md:min-h-[28px] max-md:px-[10px] max-md:text-xs"
                style={
                  {
                    borderColor: `color-mix(in oklch, white 44%, ${tone})`,
                    background: `color-mix(in oklch, oklch(16% 0.03 140 / 0.48) 72%, ${tone})`,
                    color: 'oklch(98% 0.004 92)',
                  } as CSSProperties
                }
              >
                {chip}
              </span>
            ))}
          </div>

          <p className="sr-only">{description}</p>
        </div>
      </div>
    </Link>
  )
}
