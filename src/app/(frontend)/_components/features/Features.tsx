import { Award, Leaf, TreePine } from 'lucide-react'
import * as motion from 'motion/react-client'

const features = [
  {
    icon: TreePine,
    title: 'Собственное производство',
    description: 'Все растения выращены в нашем питомнике в Беларуси',
  },
  {
    icon: Leaf,
    title: 'Адаптированные сорта',
    description: 'Растения полностью приспособлены к местному климату',
  },
  {
    icon: Award,
    title: '10+ лет опыта',
    description: 'Профессиональный подход к выращиванию с 2016 года',
  },
]
export function Features() {
  return (
    <section className="py-16 bg-cream-dark">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-forest" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground mb-1">{feature.title}</h2>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
