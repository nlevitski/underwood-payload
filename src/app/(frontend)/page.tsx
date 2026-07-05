import { About } from './_components/about/About'
import { BlogPreview } from './_components/blogPreview/BlogPreview'
import { Categories } from './_components/categories/Categories'
import { CTA } from './_components/cTA/CTA'
import { Features } from './_components/features/Features'
import { Hero } from './_components/hero/Hero'
import { NurseryPhotos } from './_components/nurseryPhotos/NurseryPhotos'
import { PopularPlants } from './_components/popularPlants/PopularPlants'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  return (
    <>
      <Hero />
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
