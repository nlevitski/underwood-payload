import { Button } from '@/components/ui/button'
import Link from 'next/link'
import * as motion from 'motion/react-client'

export function CTA() {
  return (
    <section className="py-20 bg-primary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Готовы выбрать растения?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Свяжитесь с нами для уточнения наличия и консультации по выбору растений
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="secondary" size="lg">
              <Link href="/catalog">Смотреть каталог</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/contacts">Контакты</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
