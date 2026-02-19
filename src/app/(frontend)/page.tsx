import Link from 'next/link'

export default async function HomePage() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Link href="/articles">Articles</Link>
      <Link href="/catalog">Catalog</Link>
    </>
  )
}
