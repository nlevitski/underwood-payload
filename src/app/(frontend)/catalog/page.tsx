import Link from 'next/link'

export default async function CatalogPage() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Catalog Page</h1>
      <Link href="/">Главная</Link>
    </>
  )
}
