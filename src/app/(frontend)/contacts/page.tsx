import Link from 'next/link'

export default async function ContactsPage() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Contacts Page</h1>
      <Link href="/">Главная</Link>
    </>
  )
}
