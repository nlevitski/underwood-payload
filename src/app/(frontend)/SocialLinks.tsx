import { ArrowUpRight } from 'lucide-react'

import type { SocialLink } from '@/lib/social-links'

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function SocialIcon({
  platform,
  className,
}: {
  platform: SocialLink['platform']
  className?: string
}) {
  return platform === 'instagram' ? (
    <InstagramIcon className={className} />
  ) : (
    <TikTokIcon className={className} />
  )
}

export function SocialLinksBand({
  links,
  tone = 'forest',
}: {
  links: SocialLink[]
  tone?: 'forest' | 'plain'
}) {
  if (links.length === 0) return null

  const plain = tone === 'plain'

  return (
    <section
      className={plain ? 'bg-primary py-16' : 'pb-16'}
      aria-labelledby={`social-links-${tone}`}
    >
      <div className="container">
        <div
          className={
            plain
              ? 'text-center'
              : 'rounded-2xl bg-primary px-5 py-7 shadow-elevated sm:px-8 sm:py-9 lg:px-10'
          }
        >
          <div
            className={
              plain
                ? 'mx-auto max-w-4xl'
                : 'grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-center lg:gap-10'
            }
          >
            <div>
              <h2
                id={`social-links-${tone}`}
                className={`font-bold text-primary-foreground ${plain ? 'text-3xl md:text-4xl' : 'text-2xl sm:text-3xl'}`}
              >
                Мы в соцсетях
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
                Как питомник живёт по сезону — от посадки до урожая.
              </p>
            </div>
            <div className={`grid gap-3 text-left sm:grid-cols-2 ${plain ? 'mt-6' : ''}`}>
              {links.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Underwood в ${link.label}, открывается в новой вкладке`}
                  className="group flex items-center gap-4 rounded-xl border border-primary-foreground/25 bg-primary-foreground/10 p-4 outline-none transition-colors hover:bg-primary-foreground/15 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
                    <SocialIcon
                      platform={link.platform}
                      className="size-5 text-primary-foreground"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-primary-foreground">
                      {link.label}
                    </span>
                    <span className="block text-sm text-primary-foreground/60">
                      Фото и видео из питомника
                    </span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-primary-foreground/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function SocialLinksFooter({ links }: { links: SocialLink[] }) {
  if (links.length === 0) return null

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-3 pt-1">
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Underwood в ${link.label}, открывается в новой вкладке`}
          className="group inline-flex items-center gap-2 rounded-lg text-sm text-muted-foreground underline-offset-4 outline-none transition-colors hover:text-forest hover:underline focus-visible:text-forest focus-visible:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <SocialIcon
            platform={link.platform}
            className="size-4 text-forest transition-transform group-hover:scale-110"
          />
          {link.label}
        </a>
      ))}
    </div>
  )
}
