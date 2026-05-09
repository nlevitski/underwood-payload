import type { Payload } from 'payload'

type CareSeed = {
  type: 'watering' | 'light' | 'temperature' | 'size'
  description: string
}

type ItemCareSeed = {
  name: string
  id: number | null
  cares: CareSeed[]
}

const items: ItemCareSeed[] = [
  {
    name: 'Смарагд',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Поливайте регулярно в первые годы и в засуху.',
      },
      {
        type: 'light',
        description: 'Сажайте на солнце или в лёгкой полутени.',
      },
      {
        type: 'temperature',
        description: 'Молодые растения в первые зимы защищайте от весеннего солнца и сухого ветра.',
      },
      {
        type: 'size',
        description: 'Весной удаляйте сухие ветви и слегка подравнивайте крону.',
      },
    ],
  },
  {
    name: 'Брабант',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Поддерживайте равномерную влажность без застоя воды.',
      },
      {
        type: 'light',
        description: 'Выбирайте солнечное место с питательной почвой.',
      },
      {
        type: 'temperature',
        description:
          'Молодые посадки в первый год укрывайте от сильного ветра и ранневесеннего солнца.',
      },
      {
        type: 'size',
        description: 'Стригите 1-2 раза за сезон для плотной стены.',
      },
    ],
  },
  {
    name: 'Колумна',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Поливайте в жару и обязательно мульчируйте приствольный круг.',
      },
      {
        type: 'light',
        description: 'Сажайте на светлом участке с дренированной почвой.',
      },
      {
        type: 'temperature',
        description: 'Защищайте молодые растения от весенних ожогов.',
      },
      {
        type: 'size',
        description: 'Сохраняйте колонновидную форму лёгкой санитарной обрезкой.',
      },
    ],
  },
  {
    name: 'Корник',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Поливайте умеренно и не допускайте переувлажнения.',
      },
      {
        type: 'light',
        description: 'Лучше растёт на солнце или при лёгком притенении.',
      },
      {
        type: 'temperature',
        description: 'Весной удаляйте подмёрзшие и сухие побеги.',
      },
      {
        type: 'size',
        description: 'Формируйте крону только санитарной и лёгкой корректирующей обрезкой.',
      },
    ],
  },
  {
    name: 'Зебрина',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'В засуху поливайте чаще и мульчируйте основание.',
      },
      {
        type: 'light',
        description: 'Высаживайте на хорошо освещённом месте.',
      },
      {
        type: 'temperature',
        description: 'Не загущайте посадки и защищайте молодые растения от вымокания зимой.',
      },
      {
        type: 'size',
        description: 'Не загущайте посадки, чтобы сохранить яркую окраску.',
      },
    ],
  },
  {
    name: 'Даника',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Поддерживайте умеренную влажность почвы без застоя воды.',
      },
      {
        type: 'light',
        description: 'Сажайте на солнце или в полутени.',
      },
      {
        type: 'temperature',
        description: 'Зимой мульчируйте корневую зону, чтобы защитить поверхностные корни.',
      },
      {
        type: 'size',
        description: 'Весной удаляйте сухие участки и обновляйте мульчу.',
      },
    ],
  },
  {
    name: 'Хосери',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Поливайте в засушливые периоды, особенно у молодых растений.',
      },
      {
        type: 'light',
        description: 'Лучше развивается на светлых участках без палящего полуденного солнца.',
      },
      {
        type: 'temperature',
        description: 'Не допускайте переувлажнения и плотной тяжёлой почвы.',
      },
      {
        type: 'size',
        description: 'Оставляйте форму естественной, удаляя только сухие и повреждённые ветви.',
      },
    ],
  },
  {
    name: 'Рейнголд',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Следите за влажностью почвы в жаркие недели.',
      },
      {
        type: 'light',
        description: 'Высаживайте на открытом солнечном участке.',
      },
      {
        type: 'temperature',
        description: 'Молодые растения берегите от иссушающих зимних ветров и весенних ожогов.',
      },
      {
        type: 'size',
        description: 'Весной удаляйте сухие побеги и поддерживайте форму кроны.',
      },
    ],
  },
  {
    name: 'Блю Эрроу',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Поливайте умеренно и не допускайте застоя влаги.',
      },
      {
        type: 'light',
        description: 'Сажайте на полном солнце в лёгкую дренированную почву.',
      },
      {
        type: 'temperature',
        description: 'Хорошо переносит морозы, но молодые саженцы лучше защищать от выпревания.',
      },
      {
        type: 'size',
        description: 'Практически не требует формирующей обрезки.',
      },
    ],
  },
  {
    name: 'Вилтони',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Не заливайте растение, оно лучше переносит сухость, чем сырость.',
      },
      {
        type: 'light',
        description: 'Выбирайте солнечное место с бедной, но рыхлой почвой.',
      },
      {
        type: 'temperature',
        description: 'Зимой избегайте вымокания и уплотнения снега, это важнее, чем укрытие.',
      },
      {
        type: 'size',
        description: 'При необходимости слегка подрезайте края ковра.',
      },
    ],
  },
  {
    name: 'Принц Уэльский',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'После укоренения поливайте только в долгую засуху.',
      },
      {
        type: 'light',
        description: 'Сажайте на солнце или в лёгкой полутени.',
      },
      {
        type: 'temperature',
        description: 'Сорт зимостойкий, но в малоснежные зимы полезна мульча у корней.',
      },
      {
        type: 'size',
        description: 'Следите, чтобы вокруг не скапливались сорняки и мусор.',
      },
    ],
  },
  {
    name: 'Лайм Глоу',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Поливайте умеренно и не допускайте переувлажнения корней.',
      },
      {
        type: 'light',
        description: 'Высаживайте на полностью освещённом участке.',
      },
      {
        type: 'temperature',
        description:
          'Куст хорошо зимует, но лучше сохраняет цвет на сухих и проветриваемых местах.',
      },
      {
        type: 'size',
        description: 'Весной убирайте подсохшие побеги и обновляйте мульчу.',
      },
    ],
  },
  {
    name: 'Голден Карпет',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Поливайте только в сильную засуху и не допускайте сырости.',
      },
      {
        type: 'light',
        description: 'Лучше всего окраска проявляется на солнце.',
      },
      {
        type: 'temperature',
        description: 'Зимой избегайте застойной влаги и тяжёлого снега на побегах.',
      },
      {
        type: 'size',
        description: 'При необходимости слегка подрезайте слишком длинные побеги.',
      },
    ],
  },
  {
    name: 'Мугус',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Не перекармливайте и не переувлажняйте растение.',
      },
      {
        type: 'light',
        description: 'Сажайте на солнечном участке с хорошим дренажом.',
      },
      {
        type: 'temperature',
        description: 'Морозостоек, но плохо переносит зимнее выпревание и тяжёлую мокрую почву.',
      },
      {
        type: 'size',
        description: 'Удаляйте только сухие ветви, сильная обрезка не нужна.',
      },
    ],
  },
  {
    name: 'Пумилио',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Поливайте только при длительной засухе после укоренения.',
      },
      {
        type: 'light',
        description: 'Высаживайте на солнце в лёгкую, хорошо дренированную почву.',
      },
      {
        type: 'temperature',
        description: 'Избегайте тяжёлых удобрений и избыточного полива.',
      },
      {
        type: 'size',
        description: 'Оставляйте компактную форму, удаляя только сухие или выбивающиеся ветви.',
      },
    ],
  },
  {
    name: 'Рубифол',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Поливайте в период цветения и налива ягод.',
      },
      {
        type: 'light',
        description: 'Выбирайте солнечное место и рыхлую плодородную почву.',
      },
      {
        type: 'temperature',
        description: 'На зиму мульчируйте корни, чтобы побеги лучше переживали морозы.',
      },
      {
        type: 'size',
        description: 'Подвязывайте побеги и удаляйте отплодоносившие стебли.',
      },
    ],
  },
  {
    name: 'Натчез',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Поливайте регулярно в период роста и плодоношения.',
      },
      {
        type: 'light',
        description: 'Сажайте на солнечном месте с опорой для побегов.',
      },
      {
        type: 'temperature',
        description: 'На зиму укрывайте побеги в регионах с сильными морозами.',
      },
      {
        type: 'size',
        description: 'Обрезайте старые побеги и подвязывайте молодые к опоре.',
      },
    ],
  },
  {
    name: 'Стивенс',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Поддерживайте регулярный полив и толстый слой мульчи.',
      },
      {
        type: 'light',
        description: 'Сажайте только в кислый влажный субстрат.',
      },
      {
        type: 'temperature',
        description: 'Следите, чтобы почва не пересыхала в жаркую погоду.',
      },
      {
        type: 'size',
        description: 'После сбора ягод можно слегка подрезать побеги и убрать сухие листья.',
      },
    ],
  },
  {
    name: 'Коралл',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Поливайте умеренно, не допуская ни пересыхания, ни застоя воды.',
      },
      {
        type: 'light',
        description: 'Высаживайте в кислую, лёгкую и хорошо увлажнённую почву.',
      },
      {
        type: 'temperature',
        description: 'Зимой полезен мульчирующий слой, но без тяжёлого укрытия.',
      },
      {
        type: 'size',
        description: 'После плодоношения можно слегка формировать куст.',
      },
    ],
  },
  {
    name: 'Блюкроп',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Поливайте регулярно, особенно в период цветения и налива ягод.',
      },
      {
        type: 'light',
        description: 'Высаживайте в кислую почву и используйте хвойную мульчу.',
      },
      {
        type: 'temperature',
        description: 'Не вносите щелочные удобрения и не пересушивайте грунт.',
      },
      {
        type: 'size',
        description: 'Весной вырезайте старые и загущающие ветви.',
      },
    ],
  },
  {
    name: 'Дюк',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Поддерживайте равномерную влажность и слой мульчи.',
      },
      {
        type: 'light',
        description: 'Сажайте на солнечном участке с кислой почвой.',
      },
      {
        type: 'temperature',
        description: 'Избегайте пересушивания корней и защищайте кусты от зимнего иссушения.',
      },
      {
        type: 'size',
        description: 'Регулярно обновляйте посадки обрезкой старых ветвей.',
      },
    ],
  },
  {
    name: 'Лаванда',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Не переувлажняйте и обеспечьте хороший дренаж.',
      },
      {
        type: 'light',
        description: 'Сажайте только на полном солнце.',
      },
      {
        type: 'temperature',
        description: 'Зимой держите куст в сухом месте и не допускайте выпревания.',
      },
      {
        type: 'size',
        description: 'После цветения слегка подрезайте побеги для компактности.',
      },
    ],
  },
  {
    name: 'Дубравный',
    id: null,
    cares: [
      {
        type: 'watering',
        description: 'Поливайте умеренно и не допускайте застоя воды.',
      },
      {
        type: 'light',
        description: 'Высаживайте на солнце или в лёгкой полутени.',
      },
      {
        type: 'temperature',
        description: 'Осенью укройте основание куста слоем мульчи, чтобы сохранить корни.',
      },
      {
        type: 'size',
        description: 'После цветения обрежьте цветоносы для повторного роста.',
      },
    ],
  },
]

export async function seedProductItemCares(payload: Payload) {
  const { docs: productItems } = await payload.find({
    collection: 'product-items',
    depth: 0,
    limit: 0,
    pagination: false,
  })

  for (const entry of items) {
    const matchedItem = productItems.find((doc) => {
      if (typeof doc.name === 'string' && doc.name === entry.name) {
        return true
      }

      if (typeof doc.nameRu === 'string' && doc.nameRu === entry.name) {
        return true
      }

      return false
    })

    if (!matchedItem || typeof matchedItem.id !== 'number') {
      throw new Error(`Product item not found for care seed: ${entry.name}`)
    }

    entry.id = matchedItem.id
  }

  for (const entry of items) {
    if (typeof entry.id !== 'number') {
      throw new Error(`Product item id was not resolved for care seed: ${entry.name}`)
    }

    const careData = entry.cares.reduce<
      Record<'watering' | 'light' | 'temperature' | 'size', string | undefined>
    >(
      (acc, care) => {
        acc[care.type] = care.description
        return acc
      },
      {
        watering: undefined,
        light: undefined,
        temperature: undefined,
        size: undefined,
      },
    )

    await payload.create({
      collection: 'product-item-cares',
      data: {
        item: entry.id,
        ...careData,
      },
    })
  }
}
