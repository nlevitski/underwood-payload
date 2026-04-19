import Link from 'next/link'
import * as motion from 'motion/react-client'

import { Button } from '@/components/ui/button'

export function AboutCTA() {
  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">Приезжайте к нам</h2>
          <p className="text-muted-foreground mb-8">
            Мы всегда рады показать наш питомник и помочь с выбором растений. Запишитесь на
            экскурсию или просто приезжайте в рабочие часы.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="default" size="lg" asChild>
              <Link href="/contacts">Контакты и карта</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/gallery">Фото питомника</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
