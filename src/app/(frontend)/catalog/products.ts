import thujaImage from '@/assets/plant-thuja.jpg'
import blueberryImage from '@/assets/plant-blueberry.jpg'
import spruceImage from '@/assets/plant-spruce.jpg'
import raspberryImage from '@/assets/plant-raspberry.jpg'
import { StaticImageData } from 'next/image'

export const categories = {
  conifers: 'Хвойные',
  berries: 'Ягодные',
  foliage: 'Лиственные',
  perennials: 'Многолетние',
} as const

export type CategoryKey = keyof typeof categories
export type CategoryName = (typeof categories)[CategoryKey]

export type Category<K extends CategoryKey = CategoryKey> = {
  categoryKey: K
  category: (typeof categories)[K]
  image: StaticImageData
}

export const potTypes = ['P9', 'C1', 'C2', 'C3', 'C5', 'C10'] as const
export type PotType = (typeof potTypes)[number]

export const valueTypes = ['none', 'age', 'size'] as const
export type ValueType = (typeof valueTypes)[number]

export const ageTypes = ['1', '2', '3', '4', '5'] as const
export type AgeType = (typeof ageTypes)[number]

export const sizeTypes = ['50-60', '60-70', '70-80', '80', '80-90', '90-120'] as const
export type SizeType = (typeof sizeTypes)[number]

export const agePostfixes = ['год', 'года', 'лет'] as const
export type AgePostfix = (typeof agePostfixes)[number]

export const sizePostfixes = ['см'] as const
export type SizePostfix = (typeof sizePostfixes)[number]

export type Care = {
  type: 'watering' | 'light' | 'temperature' | 'size'
  description: string
}

type BaseVariant = {
  id: number
  price: number
  inStock: boolean
}

type VariantByValueType = {
  none: BaseVariant
  age: BaseVariant & {
    value: AgeType
    postfix: AgePostfix
  }
  size: BaseVariant & {
    value: SizeType
    postfix: SizePostfix
  }
}

type Pot<V extends ValueType = ValueType> = {
  id: number
  name: PotType
  variants: VariantByValueType[V][]
}

export type Product<V extends ValueType = ValueType, K extends CategoryKey = CategoryKey> = {
  id: string
  name: string
  description: string
  cares: Care[]
  valueType: V
  pots: Pot<V>[]
} & Category<K>

export const products: Product[] = [
  {
    id: 'thuja-smaragd',
    name: 'Туя Смарагд',
    description:
      'Плотная туя с узкой конической кроной и насыщенно-зелёной хвоей. Сохраняет аккуратную форму без частой стрижки и хорошо подходит для живых изгородей и солитерных посадок.',
    cares: [
      { type: 'light', description: 'Сажайте на солнце или в лёгкой полутени.' },
      { type: 'watering', description: 'Поливайте регулярно в первые годы и в засуху.' },
      { type: 'size', description: 'Весной удаляйте сухие ветви и слегка подравнивайте крону.' },
    ],
    valueType: 'size',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    pots: [
      {
        id: 1,
        name: 'C2',
        variants: [
          { id: 1, value: '50-60', postfix: 'см', price: 10, inStock: true },
          { id: 2, value: '60-70', postfix: 'см', price: 12, inStock: true },
        ],
      },
      {
        id: 2,
        name: 'C3',
        variants: [{ id: 3, value: '70-80', postfix: 'см', price: 15, inStock: true }],
      },
    ],
  },
  {
    id: 'thuja-brabant',
    name: 'Туя Брабант',
    description:
      'Быстрорастущая туя с плотной ярко-зелёной хвоей и выраженной вертикалью. Отлично подходит для высоких живых изгородей, быстро закрывает посадки и легко переносит формировку.',
    cares: [
      { type: 'light', description: 'Выбирайте солнечное место с питательной почвой.' },
      { type: 'watering', description: 'Поддерживайте равномерную влажность без застоя воды.' },
      { type: 'size', description: 'Стригите 1-2 раза за сезон для плотной стены.' },
    ],
    valueType: 'size',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    pots: [
      {
        id: 1,
        name: 'C2',
        variants: [
          { id: 1, value: '50-60', postfix: 'см', price: 10, inStock: true },
          { id: 2, value: '60-70', postfix: 'см', price: 15, inStock: true },
        ],
      },
      {
        id: 2,
        name: 'C3',
        variants: [{ id: 3, value: '80-90', postfix: 'см', price: 18, inStock: true }],
      },
    ],
  },
  {
    id: 'thuja-columna',
    name: 'Туя Колумна',
    description:
      'Колонновидная туя с компактной густой кроной и ровным силуэтом. Хорошо смотрится в рядовых посадках, у входа и в узких местах, где нужен строгий вертикальный акцент.',
    cares: [
      { type: 'light', description: 'Сажайте на светлом участке с дренированной почвой.' },
      { type: 'watering', description: 'Поливайте в жару и обязательно мульчируйте приствольный круг.' },
      { type: 'temperature', description: 'Защищайте молодые растения от весенних ожогов.' },
    ],
    valueType: 'size',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    pots: [
      {
        id: 1,
        name: 'C2',
        variants: [{ id: 1, value: '50-60', postfix: 'см', price: 15, inStock: true }],
      },
    ],
  },
  {
    id: 'thuja-kornik',
    name: 'Туя Корник',
    description:
      'Декоративная туя с плотной кроной и более мягким, выразительным оттенком хвои. Подходит для одиночных посадок и небольших групп, где нужен аккуратный, но заметный акцент.',
    cares: [
      { type: 'light', description: 'Лучше растёт на солнце или при лёгком притенении.' },
      { type: 'watering', description: 'Поливайте умеренно и не допускайте переувлажнения.' },
      { type: 'temperature', description: 'Весной удаляйте подмёрзшие и сухие побеги.' },
    ],
    valueType: 'size',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    pots: [
      {
        id: 1,
        name: 'C5',
        variants: [{ id: 1, value: '70-80', postfix: 'см', price: 35, inStock: true }],
      },
    ],
  },
  {
    id: 'thuja-zebrina',
    name: 'Туя Зебрина',
    description:
      'Яркая туя с пёстрой хвоей, где зелёные побеги сочетаются с золотистыми полосами. Сорт ценят за контрастный окрас и выразительный вид в смешанных композициях.',
    cares: [
      { type: 'light', description: 'Высаживайте на хорошо освещённом месте.' },
      { type: 'size', description: 'Не загущайте посадки, чтобы сохранить яркую окраску.' },
      { type: 'watering', description: 'В засуху поливайте чаще и мульчируйте основание.' },
    ],
    valueType: 'size',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    pots: [
      {
        id: 1,
        name: 'C2',
        variants: [{ id: 1, value: '50-60', postfix: 'см', price: 20, inStock: true }],
      },
    ],
  },
  {
    id: 'thuja-danica',
    name: 'Туя Даника',
    description:
      'Карликовая шаровидная туя с плотной симметричной кроной. Идеальна для бордюров, небольших композиций и посадок, где нужен аккуратный округлый силуэт.',
    cares: [
      { type: 'light', description: 'Сажайте на солнце или в полутени.' },
      { type: 'watering', description: 'Поддерживайте умеренную влажность почвы без застоя воды.' },
      { type: 'size', description: 'Весной удаляйте сухие участки и обновляйте мульчу.' },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    pots: [
      { id: 1, name: 'C2', variants: [{ id: 1, price: 12, inStock: true }] },
      { id: 2, name: 'C3', variants: [{ id: 2, price: 15, inStock: true }] },
      { id: 3, name: 'C5', variants: [{ id: 3, price: 35, inStock: true }] },
    ],
  },
  {
    id: 'thuja-hoseri',
    name: 'Туя Хосери',
    description:
      'Низкорослая шаровидная туя с плотной кроной и аккуратным медленным ростом. Хорошо подходит для переднего плана, каменистых садов и компактных декоративных групп.',
    cares: [
      {
        type: 'light',
        description: 'Лучше развивается на светлых участках без палящего полуденного солнца.',
      },
      { type: 'watering', description: 'Поливайте в засушливые периоды, особенно у молодых растений.' },
      { type: 'temperature', description: 'Не допускайте переувлажнения и плотной тяжёлой почвы.' },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    pots: [{ id: 1, name: 'C5', variants: [{ id: 1, price: 35, inStock: true }] }],
  },
  {
    id: 'thuja-rheingold',
    name: 'Туя Рейнгольд',
    description:
      'Декоративная туя с золотистой хвоей, которая особенно ярко выглядит на солнце. С возрастом крона становится плотной и аккуратной, хорошо работая как цветовой акцент в композиции.',
    cares: [
      { type: 'light', description: 'Высаживайте на открытом солнечном участке.' },
      { type: 'watering', description: 'Следите за влажностью почвы в жаркие недели.' },
      { type: 'size', description: 'Весной удаляйте сухие побеги и поддерживайте форму кроны.' },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    pots: [
      { id: 1, name: 'C2', variants: [{ id: 1, price: 15, inStock: true }] },
      { id: 2, name: 'C5', variants: [{ id: 2, price: 35, inStock: true }] },
    ],
  },
  {
    id: 'juniper-bluearrow',
    name: 'Можжевельник Блю Эроу',
    description:
      'Узкий колонновидный можжевельник с голубоватой хвоей и строгим силуэтом. Хорошо подходит для ритмичных посадок, узких участков и современных садовых композиций.',
    cares: [
      { type: 'light', description: 'Сажайте на полном солнце в лёгкую дренированную почву.' },
      { type: 'watering', description: 'Поливайте умеренно и не допускайте застоя влаги.' },
      { type: 'size', description: 'Практически не требует формирующей обрезки.' },
    ],
    valueType: 'size',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    pots: [
      {
        id: 1,
        name: 'C2',
        variants: [{ id: 1, value: '80', postfix: 'см', price: 25, inStock: true }],
      },
      {
        id: 2,
        name: 'C5',
        variants: [{ id: 2, value: '90-120', postfix: 'см', price: 35, inStock: true }],
      },
    ],
  },
  {
    id: 'juniper-wiltonii',
    name: 'Можжевельник Вилтони',
    description:
      'Стелющийся можжевельник с плотным голубовато-зелёным ковром. Быстро закрывает грунт, удерживает декоративность круглый сезон и хорошо работает как почвопокровное растение.',
    cares: [
      { type: 'light', description: 'Выбирайте солнечное место с бедной, но рыхлой почвой.' },
      { type: 'watering', description: 'Не заливайте растение, оно лучше переносит сухость, чем сырость.' },
      { type: 'size', description: 'При необходимости слегка подрезайте края ковра.' },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    pots: [{ id: 1, name: 'C5', variants: [{ id: 1, price: 45, inStock: true }] }],
  },
  {
    id: 'juniper-prince-of-wales',
    name: 'Можжевельник Принц Уэльский',
    description:
      'Низкий стелющийся можжевельник с плотной хвоей и хорошей зимостойкостью. Подходит для укрепления склонов, заполнения пространства и создания спокойного фонового покрытия.',
    cares: [
      { type: 'light', description: 'Сажайте на солнце или в лёгкой полутени.' },
      { type: 'watering', description: 'После укоренения поливайте только в долгую засуху.' },
      { type: 'size', description: 'Следите, чтобы вокруг не скапливались сорняки и мусор.' },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    pots: [{ id: 1, name: 'C5', variants: [{ id: 1, price: 45, inStock: true }] }],
  },
  {
    id: 'juniper-lime-glow',
    name: 'Можжевельник Лайм Глоу',
    description:
      'Яркий низкорослый можжевельник с лимонно-зелёной хвоей, которая особенно заметна на солнце. Используется как светлый акцент в композициях и хорошо сочетается с тёмными хвойными.',
    cares: [
      { type: 'light', description: 'Высаживайте на полностью освещённом участке.' },
      { type: 'watering', description: 'Поливайте умеренно и не допускайте переувлажнения корней.' },
      { type: 'size', description: 'Весной убирайте подсохшие побеги и обновляйте мульчу.' },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    pots: [{ id: 1, name: 'C5', variants: [{ id: 1, price: 45, inStock: true }] }],
  },
  {
    id: 'juniper-golden-carpet',
    name: 'Можжевельник Голден карпет',
    description:
      'Стелющийся сорт с яркой золотистой хвоей и плотным ковровым ростом. Хорошо закрывает грунт, подчёркивает края дорожек и сохраняет декоративность даже на бедных почвах.',
    cares: [
      { type: 'light', description: 'Лучше всего окраска проявляется на солнце.' },
      { type: 'watering', description: 'Поливайте только в сильную засуху и не допускайте сырости.' },
      { type: 'size', description: 'При необходимости слегка подрезайте слишком длинные побеги.' },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    pots: [{ id: 1, name: 'C5', variants: [{ id: 1, price: 50, inStock: true }] }],
  },
  {
    id: 'pine-mugo-mughus',
    name: 'Сосна горная Мугус',
    description:
      'Неприхотливая горная сосна с плотной широкой кроной и короткой хвоей. Подходит для каменистых садов, склонов и посадок, где важны устойчивость и выразительный природный вид.',
    cares: [
      { type: 'light', description: 'Сажайте на солнечном участке с хорошим дренажом.' },
      { type: 'watering', description: 'Не перекармливайте и не переувлажняйте растение.' },
      { type: 'size', description: 'Удаляйте только сухие ветви, сильная обрезка не нужна.' },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: spruceImage,
    pots: [
      { id: 1, name: 'C2', variants: [{ id: 1, price: 20, inStock: true }] },
      { id: 2, name: 'C5', variants: [{ id: 2, price: 40, inStock: true }] },
    ],
  },
  {
    id: 'pine-mugo-pumilio',
    name: 'Сосна горная Пумилио',
    description:
      'Компактная горная сосна с подушковидной кроной и густой тёмно-зелёной хвоей. Сорт медленно растёт, долго сохраняет аккуратный силуэт и хорошо подходит для переднего плана.',
    cares: [
      { type: 'light', description: 'Высаживайте на солнце в лёгкую, хорошо дренированную почву.' },
      { type: 'watering', description: 'Поливайте только при длительной засухе после укоренения.' },
      { type: 'temperature', description: 'Избегайте тяжёлых удобрений и избыточного полива.' },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: spruceImage,
    pots: [
      { id: 1, name: 'C2', variants: [{ id: 1, price: 20, inStock: true }] },
      { id: 2, name: 'C5', variants: [{ id: 2, price: 40, inStock: true }] },
    ],
  },
  {
    id: 'raspberry-rubyfall',
    name: 'Малина Рубифол',
    description:
      'Сорт малины с крупными сладкими ягодами и хорошей урожайностью. Подходит для любительского сада и даёт вкусный сбор при регулярном уходе и своевременной обрезке.',
    cares: [
      { type: 'light', description: 'Выбирайте солнечное место и рыхлую плодородную почву.' },
      { type: 'size', description: 'Подвязывайте побеги и удаляйте отплодоносившие стебли.' },
      { type: 'watering', description: 'Поливайте в период цветения и налива ягод.' },
    ],
    valueType: 'none',
    category: 'Ягодные',
    categoryKey: 'berries',
    image: raspberryImage,
    pots: [{ id: 1, name: 'C2', variants: [{ id: 1, price: 10, inStock: true }] }],
  },
  {
    id: 'blackberry-natchez',
    name: 'Ежевика Натчез',
    description:
      'Ранняя крупноплодная ежевика с вытянутыми сладкими ягодами и мощными побегами. Ценится за высокую товарность урожая и удобна для свежего потребления и заготовок.',
    cares: [
      { type: 'light', description: 'Сажайте на солнечном месте с опорой для побегов.' },
      { type: 'watering', description: 'Поливайте регулярно в период роста и плодоношения.' },
      { type: 'temperature', description: 'На зиму укрывайте побеги в регионах с сильными морозами.' },
    ],
    valueType: 'none',
    category: 'Ягодные',
    categoryKey: 'berries',
    image: raspberryImage,
    pots: [{ id: 1, name: 'C2', variants: [{ id: 1, price: 15, inStock: true }] }],
  },
  {
    id: 'cranberry-stevens',
    name: 'Клюква Стивенс',
    description:
      'Популярный урожайный сорт клюквы с крупными тёмно-красными ягодами. Хорошо подходит для участков с кислой почвой и ценится за стабильное плодоношение и долгий срок хранения.',
    cares: [
      { type: 'light', description: 'Сажайте только в кислый влажный субстрат.' },
      { type: 'watering', description: 'Поддерживайте регулярный полив и толстый слой мульчи.' },
      { type: 'temperature', description: 'Следите, чтобы почва не пересыхала в жаркую погоду.' },
    ],
    valueType: 'none',
    category: 'Ягодные',
    categoryKey: 'berries',
    image: raspberryImage,
    pots: [{ id: 1, name: 'P9', variants: [{ id: 1, price: 6, inStock: true }] }],
  },
  {
    id: 'lingonberry-koralle',
    name: 'Брусника Коралл',
    description:
      'Компактный декоративно-плодовый кустарник с блестящей листвой и яркими ягодами. Хорошо смотрится в ягодных садах и на кислых участках, где важно сочетание красоты и урожайности.',
    cares: [
      { type: 'light', description: 'Высаживайте в кислую, лёгкую и хорошо увлажнённую почву.' },
      { type: 'watering', description: 'Поливайте умеренно, не допуская ни пересыхания, ни застоя воды.' },
      { type: 'size', description: 'После плодоношения можно слегка формировать куст.' },
    ],
    valueType: 'none',
    category: 'Ягодные',
    categoryKey: 'berries',
    image: raspberryImage,
    pots: [{ id: 1, name: 'P9', variants: [{ id: 1, price: 10, inStock: true }] }],
  },
  {
    id: 'blueberry-bluecrop',
    name: 'Голубика Блюкроп',
    description:
      'Один из самых надёжных сортов голубики с крупными сладко-кислыми ягодами и стабильным урожаем. Подходит для частного сада и хорошо хранится после сбора.',
    cares: [
      { type: 'light', description: 'Высаживайте в кислую почву и используйте хвойную мульчу.' },
      { type: 'watering', description: 'Поливайте регулярно, особенно в период цветения и налива ягод.' },
      { type: 'temperature', description: 'Не вносите щелочные удобрения и не пересушивайте грунт.' },
    ],
    valueType: 'age',
    category: 'Ягодные',
    categoryKey: 'berries',
    image: blueberryImage,
    pots: [
      {
        id: 1,
        name: 'C2',
        variants: [
          { id: 1, value: '3', postfix: 'года', price: 12, inStock: true },
          { id: 2, value: '4', postfix: 'года', price: 15, inStock: true },
        ],
      },
      {
        id: 2,
        name: 'C5',
        variants: [{ id: 3, value: '5', postfix: 'лет', price: 25, inStock: true }],
      },
    ],
  },
  {
    id: 'blueberry-duke',
    name: 'Голубика Дюк',
    description:
      'Ранний сорт голубики с крупными плотными ягодами и дружным созреванием. Даёт хороший ранний урожай и подходит для свежего потребления, заморозки и десертов.',
    cares: [
      { type: 'light', description: 'Сажайте на солнечном участке с кислой почвой.' },
      { type: 'watering', description: 'Поддерживайте равномерную влажность и слой мульчи.' },
      { type: 'size', description: 'Регулярно обновляйте посадки обрезкой старых ветвей.' },
    ],
    valueType: 'age',
    category: 'Ягодные',
    categoryKey: 'berries',
    image: blueberryImage,
    pots: [
      {
        id: 1,
        name: 'C2',
        variants: [{ id: 1, value: '4', postfix: 'года', price: 15, inStock: true }],
      },
      {
        id: 2,
        name: 'C5',
        variants: [{ id: 2, value: '5', postfix: 'лет', price: 25, inStock: true }],
      },
    ],
  },
  {
    id: 'lavander',
    name: 'Лаванда',
    description:
      'Ароматный многолетник с серо-зелёной листвой и фиолетовыми соцветиями. Хорошо работает в бордюрах, ароматных садах и на солнечных участках с сухой почвой.',
    cares: [
      { type: 'light', description: 'Сажайте только на полном солнце.' },
      { type: 'watering', description: 'Не переувлажняйте и обеспечьте хороший дренаж.' },
      { type: 'size', description: 'После цветения слегка подрезайте побеги для компактности.' },
    ],
    valueType: 'none',
    category: 'Многолетние',
    categoryKey: 'perennials',
    image: blueberryImage,
    pots: [{ id: 1, name: 'P9', variants: [{ id: 1, price: 7, inStock: true }] }],
  },
  {
    id: 'sage-woodland',
    name: 'Шалфей дубравный',
    description:
      'Декоративный многолетник с ароматной листвой и лилово-фиолетовыми свечами цветков. Привлекает пчёл, долго цветёт и хорошо смотрится в природных и смешанных композициях.',
    cares: [
      { type: 'light', description: 'Высаживайте на солнце или в лёгкой полутени.' },
      { type: 'watering', description: 'Поливайте умеренно и не допускайте застоя воды.' },
      { type: 'size', description: 'После цветения обрежьте цветоносы для повторного роста.' },
    ],
    valueType: 'none',
    category: 'Многолетние',
    categoryKey: 'perennials',
    image: blueberryImage,
    pots: [{ id: 1, name: 'P9', variants: [{ id: 1, price: 10, inStock: true }] }],
  },
]
