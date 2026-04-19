import * as motion from 'motion/react-client'

const stats = [
  { label: 'Лет опыта', value: '10+' },
  // { label: 'Гектаров', value: '1+' },
  { label: 'Сортов растений', value: '100+' },
  { label: 'Довольных клиентов', value: '1000+' },
]

export function AboutStats() {
  return (
    <section className="py-12 bg-cream-dark">
      <div className="container">
        <div className="grid grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-bold text-forest">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
