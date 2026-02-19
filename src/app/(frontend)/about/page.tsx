import Link from 'next/link'

export default async function AboutPage() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">About Page</h1>
      <Link href="/">Главная</Link>
    </>
  )
}
