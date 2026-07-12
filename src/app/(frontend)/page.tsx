import type { Metadata } from 'next'

import { About } from './_components/about/About'
import { BlogPreview } from './_components/blogPreview/BlogPreview'
import { Categories } from './_components/categories/Categories'
import { CTA } from './_components/cTA/CTA'
import { Features } from './_components/features/Features'
import { Hero } from './_components/hero/Hero'
import { NurseryPhotos } from './_components/nurseryPhotos/NurseryPhotos'
import { PopularPlants } from './_components/popularPlants/PopularPlants'
import { getPageGlobal, getSiteSettings } from '@/globals/fetchers'
import { buildMetadata, resolveMediaPath } from '@/lib/seo/metadata'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPageGlobal('homepage'), getSiteSettings()])

  return buildMetadata({
    meta: page.meta,
    settings,
    path: '/',
    fallbackTitle: page.heading,
    fallbackDescription: page.description,
    fallbackImage: page.heroImage,
  })
}

export default async function HomePage() {
  const page = await getPageGlobal('homepage')

  return (
    <>
      <Hero
        title={page.heading}
        subtitle={page.eyebrow}
        description={page.description}
        imageSrc={resolveMediaPath(page.heroImage)}
      />
      <Features />
      <About />
      <Categories />
      <PopularPlants />
      <NurseryPhotos />
      <BlogPreview />
      <CTA />
    </>
  )
}
