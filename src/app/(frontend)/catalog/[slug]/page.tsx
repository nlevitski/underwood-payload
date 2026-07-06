import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ProductClient } from './ProductClient'
import { CareGuideSection } from './CareGuideSection'
import { PlantCard } from '../../_components/plantCard/PlantCard'
import { getPayloadClient } from '@/lib/payload/client'
import { getDbProducts } from '../dbProducts'

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const products = await getDbProducts(payload)

  return products.map((product) => ({ slug: product.slug }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const products = await getDbProducts(payload)
  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return (
      <section className="py-16">
        <div className="container text-center">
          <h1 className="text-3xl font-bold mb-4">Растение не найдено</h1>
          <Button asChild>
            <Link href="/catalog">Вернуться в каталог</Link>
          </Button>
        </div>
      </section>
    )
  }

  // Get similar products from the same category (max 4, excluding current product)
  const similarProducts = products
    .filter((p) => p.categoryKey === product.categoryKey && p.slug !== product.slug)
    .slice(0, 4)

  return (
    <>
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

          <ProductClient product={product} />
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
