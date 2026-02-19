import Link from 'next/link'

export default async function GalleryPage() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Gallery Page</h1>
      <Link href="/">Главная</Link>
    </>
  )
}
