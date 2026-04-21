import { Leaf, TreePine, Users } from 'lucide-react'
import * as motion from 'motion/react-client'

const values = [
  {
    icon: TreePine,
    title: 'Качество',
    description: 'Все растения проходят строгий отбор и выращиваются по проверенным технологиям.',
  },
  {
    icon: Leaf,
    title: 'Адаптация',
    description: 'Саженцы полностью приспособлены к белорусскому климату и почвам.',
  },
  // {
  //   icon: Award,
  //   title: 'Гарантия',
  //   description: 'Сортосоответствие',
  // },
  {
    icon: Users,
    title: 'Команда',
    description: 'Готовы помочь с выбором и ответить на вопросы.',
  },
]

export function AboutValues() {
  return (
    <section className="py-20 bg-cream-dark">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Наши принципы</h2>
        </motion.div>
        <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-background rounded-xl p-6 shadow-soft text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
                <value.icon className="h-6 w-6 text-forest" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
