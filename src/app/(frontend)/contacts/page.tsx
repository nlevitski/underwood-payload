import type { Metadata } from 'next'
import type { ComponentType } from 'react'
import Link from 'next/link'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import * as motion from 'motion/react-client'

import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Контакты | Underwood',
  description: 'Контакты питомника Underwood, карта, часы работы и форма обратной связи.',
}

export default function ContactsPage() {
  return (
    <>
      <section className="py-12 bg-cream-dark">
        <div className="container">
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Контакты</span>
          </nav>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Контакты</h1>
          <p className="mt-2 text-muted-foreground">Свяжитесь с нами или приезжайте в питомник</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div>
                <h2 className="mb-6 text-2xl font-bold text-foreground">Как с нами связаться</h2>
                <div className="space-y-6">
                  <ContactDetail
                    icon={Phone}
                    label="Телефон"
                    value="+375 29 343-00-06"
                    href="tel:+375293430006"
                    description="Звоните в рабочие часы"
                  />
                  <ContactDetail
                    icon={Mail}
                    label="Email"
                    value="info@underwood.by"
                    href="mailto:info@underwood.by"
                    description="Ответим в течение дня"
                  />
                  <ContactDetail
                    icon={MapPin}
                    label="Адрес"
                    value="Минская область, Минский район"
                    description="д. Лесная, ул. Садовая, 1"
                  />
                  <ContactDetail
                    icon={Clock}
                    label="Часы работы"
                    value="Пн-Пт: 9:00 - 18:00, Сб: 9:00 - 17:00"
                    description="Воскресенье - выходной"
                  />
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl bg-card shadow-soft aspect-video">
                <div className="absolute left-4 top-4 z-10 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
                  Питомник «Underwood»
                </div>
                <iframe
                  src="https://www.google.com/maps?q=53.819643,27.804170&z=16&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Карта расположения питомника"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

type ContactDetailProps = {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  href?: string
  description: string
}

function ContactDetail({ icon: Icon, label, value, href, description }: ContactDetailProps) {
  const content = (
    <div className="flex gap-4">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent">
        <Icon className="h-5 w-5 text-forest" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{label}</h3>
        {href ? (
          <a href={href} className="text-muted-foreground transition-colors hover:text-forest">
            {value}
          </a>
        ) : (
          <p className="text-muted-foreground">{value}</p>
        )}
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )

  return content
}
