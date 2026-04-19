import * as motion from 'motion/react-client'

import nurseryRowsImage from '@/assets/nursery-rows.jpg'

export function AboutStory() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Питомник Underwood
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                вырос из простой любви к растениям. Всё началось с туй, высаженных у собственного
                дома в качестве живой изгороди, затем появились кусты голубики — и это увлечение
                переросло в настоящее дело.
              </p>
              <p>
                Сегодня Underwood — это люди, влюблённые в своё дело. В десяти минутах от Минской
                кольцевой дороги мы выращиваем широкий ассортимент хвойных, декоративных и ягодных
                культур. Каждый саженец прошёл полный цикл выращивания в белорусских условиях — это
                значит, что растения уже адаптированы к местному климату и хорошо приживаются на
                новом месте.
              </p>
              <p>
                Мы не просто продаём саженцы — помогаем выбрать растения для вашего участка, даём
                консультацию по посадке и уходу. Для больших объёмов — индивидуальные условия.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={nurseryRowsImage.src}
              alt="Ряды растений"
              className="rounded-2xl shadow-elevated"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
