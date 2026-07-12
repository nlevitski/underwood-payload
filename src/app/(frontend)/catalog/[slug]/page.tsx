import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ProductClient } from './ProductClient'
import { CareGuideSection } from './CareGuideSection'
import { PlantCard } from '../../_components/plantCard/PlantCard'
import { getPayloadClient } from '@/lib/payload/client'
import { getDbProducts } from '../dbProducts'
import { getSiteSettings } from '@/globals/fetchers'
import { absoluteURL, buildMetadata, resolveMediaURL } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/JsonLd'

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

const getProduct = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const products = await getDbProducts(payload)

  return {
    product: products.find((entry) => entry.slug === slug),
    products,
  }
})

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const products = await getDbProducts(payload)

  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const [{ product }, settings] = await Promise.all([getProduct(slug), getSiteSettings()])

  if (!product) {
    return {
      title: `Растение не найдено | ${settings.siteName}`,
      robots: { index: false, follow: false },
    }
  }

  const productImage = product.variants
    .flatMap((variant) => variant.pots)
    .flatMap((pot) => pot.images)
    .find((image) => image.url)?.url

  return buildMetadata({
    meta: product.meta,
    settings,
    path: `/catalog/${product.slug}`,
    fallbackTitle: product.name,
    fallbackDescription: product.description,
    fallbackImage: productImage ?? product.image,
  })
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const [{ product, products }, settings] = await Promise.all([getProduct(slug), getSiteSettings()])

  if (!product) {
    notFound()
  }

  const pots = product.variants.flatMap((variant) => variant.pots)
  const prices = pots.map((pot) => pot.price)
  const firstImage = pots.flatMap((pot) => pot.images).find((image) => image.url)?.url
  const productImage = firstImage
    ? absoluteURL(firstImage)
    : resolveMediaURL(settings.defaultSocialImage)
  const productURL = absoluteURL(`/catalog/${product.slug}`)
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.category,
    url: productURL,
    ...(productImage ? { image: productImage } : {}),
    brand: {
      '@type': 'Brand',
      name: settings.siteName,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'BYN',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: prices.length,
      url: productURL,
      seller: {
        '@type': 'Organization',
        name: settings.siteName,
      },
      availability: pots.some((pot) => pot.inStock)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
    },
  }
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: absoluteURL('/') },
      { '@type': 'ListItem', position: 2, name: 'Каталог', item: absoluteURL('/catalog') },
      { '@type': 'ListItem', position: 3, name: product.name, item: productURL },
    ],
  }

  // Get similar products from the same category (max 4, excluding current product)
  const similarProducts = products
    .filter((p) => p.categoryKey === product.categoryKey && p.slug !== product.slug)
    .slice(0, 4)

  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <section className="py-6 border-b border-border">
        <div className="container">
          <nav className="text-sm text-muted-foreground flex items-center gap-2">
            <Link href="/" className="hover:text-foreground transition-colors">
              Главная
            </Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-foreground transition-colors">
              Каталог
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <Button variant="ghost" asChild className="mb-6 -ml-3">
            <Link href="/catalog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад в каталог
            </Link>
          </Button>

          <ProductClient product={product} phone={settings.phone} />
        </div>
      </section>

      <CareGuideSection product={product} />

      {similarProducts.length > 0 && (
        <section className="py-12 bg-background">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Похожие растения
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <PlantCard key={similarProduct.slug} {...similarProduct} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
