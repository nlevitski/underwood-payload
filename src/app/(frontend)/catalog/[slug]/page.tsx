// import Link from 'next/link'
// import { getProductSlugs } from '@/collections/Products/fetchers'

// export async function generateStaticParams() {
//   const products = await getProductSlugs()
//   return products.map((product) => ({ slug: product.slug }))
// }

// export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = await params
//   const product = await getProductBySlug(slug)

//   return (
//     <>
//       <h1 className="text-3xl font-bold underline">Product Page</h1>
//       <Link href="/">Главная</Link>
//       <Link href="/catalog">Каталог</Link>
//       <Link href="/articles">Статьи</Link>
//     </>
//   )
// }
