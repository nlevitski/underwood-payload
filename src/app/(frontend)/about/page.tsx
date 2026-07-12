import type { Metadata } from 'next'

import { AboutCTA } from '../_components/aboutPage/AboutCTA'
import { AboutHero } from '../_components/aboutPage/AboutHero'
import { AboutStats } from '../_components/aboutPage/AboutStats'
import { AboutStory } from '../_components/aboutPage/AboutStory'
import { AboutValues } from '../_components/aboutPage/AboutValues'
import { getPageGlobal, getSiteSettings } from '@/globals/fetchers'
import { buildMetadata, resolveMediaPath } from '@/lib/seo/metadata'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPageGlobal('about-page'), getSiteSettings()])

  return buildMetadata({
    meta: page.meta,
    settings,
    path: '/about',
    fallbackTitle: page.heading,
    fallbackDescription: page.description,
    fallbackImage: page.heroImage,
  })
}

export default async function AboutPage() {
  const page = await getPageGlobal('about-page')

  return (
    <>
      <AboutHero
        heading={page.heading}
        description={page.description}
        imageSrc={resolveMediaPath(page.heroImage)}
      />
      <AboutStats />
      <AboutStory />
      <AboutValues />
      <AboutCTA />
    </>
  )
}
