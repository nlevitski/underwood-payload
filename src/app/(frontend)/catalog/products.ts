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

export type SizeType = string

export const agePostfixes = ['год', 'года', 'лет'] as const
export type AgePostfix = (typeof agePostfixes)[number]

export const sizePostfixes = ['см'] as const
export type SizePostfix = (typeof sizePostfixes)[number]

export type Care = {
  type: 'watering' | 'light' | 'soil' | 'temperature' | 'size'
  description: string
}

export type ProductAttributes = {
  type?: string | null
  notes?: string | null
  description?: string | null
  ripeningTime?: string | null
  growthForm?: string | null
  color?: string | null
}

export type ProductVideo = {
  type: 'youtube' | 'instagram'
  title: string
}

type ProductPot = {
  id: number
  name: PotType
  price: number
  inStock: boolean
  images: ProductImage[]
}
type ProductImage = {
  id: number
  alt: string
  blurDataUrl: string
  updatedAt: string
  createdAt: string
  url: string
  thumbnailURL: string | null
  filename: string
  mimeType: string
  filesize: number
  width: number
  height: number
  focalX: number
  focalY: number
}

type ProductVariantBase = {
  id: number
  pots: ProductPot[]
}

type ProductVariantWithValue = ProductVariantBase & {
  value: AgeType | SizeType
  postfix: AgePostfix | SizePostfix
}

export type ProductVariant = ProductVariantBase | ProductVariantWithValue

export type Product = {
  id: string
  name: string
  description: string
  attributes?: ProductAttributes | null
  cares: Care[]
  videos?: ProductVideo[]
  valueType: ValueType
  variants: ProductVariant[]
} & Category<CategoryKey>

export const products: Product[] = [
  {
    id: 'thuja-smaragd',
    name: 'Туя Смарагд',
    description:
      'Плотная туя с узкой конической кроной и насыщенно-зелёной хвоей. Сохраняет аккуратную форму без частой стрижки и хорошо подходит для живых изгородей и солитерных посадок.',
    cares: [
      { type: 'watering', description: 'Поливайте регулярно в первые годы и в засуху.' },
      { type: 'light', description: 'Сажайте на солнце или в лёгкой полутени.' },
      {
        type: 'temperature',
        description: 'Молодые растения в первые зимы защищайте от весеннего солнца и сухого ветра.',
      },
      { type: 'size', description: 'Весной удаляйте сухие ветви и слегка подравнивайте крону.' },
    ],
    valueType: 'size',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    variants: [
      {
        id: 1,
        value: '25-40',
        postfix: 'см',
        pots: [
          {
            id: 1,
            name: 'P9',
            price: 5,
            inStock: true,
            images: [
              {
                id: 7,
                alt: 'P9-emerald',
                blurDataUrl:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAMUlEQVR4nGN49//GzLWzhWUZGKYtiOqe3cLAxcCQmJEbneviERLLkFpQFp0QP23uYgBMXg+RyXpwXgAAAABJRU5ErkJggg==',
                updatedAt: '2026-06-23T10:12:36.802Z',
                createdAt: '2026-06-23T10:12:36.802Z',
                url: '/api/media/file/P9-emerald-IMG_4346.webp',
                thumbnailURL: null,
                filename: 'P9-emerald-IMG_4346.webp',
                mimeType: 'image/webp',
                filesize: 1394282,
                width: 3024,
                height: 4032,
                focalX: 50,
                focalY: 50,
              },
            ],
          },
        ],
      },
      {
        id: 2,
        value: '50-60',
        postfix: 'см',
        pots: [
          {
            id: 2,
            name: 'C2',
            price: 10,
            inStock: true,
            images: [],
          },
        ],
      },
      {
        id: 3,
        value: '60-70',
        postfix: 'см',
        pots: [
          {
            id: 2,
            name: 'C2',
            price: 12,
            inStock: true,
            images: [],
          },
        ],
      },
      {
        id: 4,
        value: '70-80',
        postfix: 'см',
        pots: [
          {
            id: 3,
            name: 'C3',
            price: 15,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'thuja-brabant',
    name: 'Туя Брабант',
    description:
      'Быстрорастущая туя с плотной ярко-зелёной хвоей и выраженной вертикалью. Отлично подходит для высоких живых изгородей, быстро закрывает посадки и легко переносит формировку.',
    cares: [
      { type: 'watering', description: 'Поддерживайте равномерную влажность без застоя воды.' },
      { type: 'light', description: 'Выбирайте солнечное место с питательной почвой.' },
      {
        type: 'temperature',
        description:
          'Молодые посадки в первый год укрывайте от сильного ветра и ранневесеннего солнца.',
      },
      { type: 'size', description: 'Стригите 1-2 раза за сезон для плотной стены.' },
    ],
    valueType: 'size',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    variants: [
      {
        id: 1,
        value: '35-50',
        postfix: 'см',
        pots: [
          {
            id: 1,
            name: 'P9',
            price: 5,
            inStock: true,
            images: [],
          },
        ],
      },
      {
        id: 2,
        value: '50-60',
        postfix: 'см',
        pots: [
          {
            id: 2,
            name: 'C2',
            price: 10,
            inStock: true,
            images: [],
          },
        ],
      },
      {
        id: 3,
        value: '60-70',
        postfix: 'см',
        pots: [
          {
            id: 2,
            name: 'C2',
            price: 15,
            inStock: true,
            images: [],
          },
        ],
      },
      {
        id: 4,
        value: '80-90',
        postfix: 'см',
        pots: [
          {
            id: 3,
            name: 'C3',
            price: 18,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'thuja-columna',
    name: 'Туя Колумна',
    description:
      'Колонновидная туя с компактной густой кроной и ровным силуэтом. Хорошо смотрится в рядовых посадках, у входа и в узких местах, где нужен строгий вертикальный акцент.',
    cares: [
      {
        type: 'watering',
        description: 'Поливайте в жару и обязательно мульчируйте приствольный круг.',
      },
      { type: 'light', description: 'Сажайте на светлом участке с дренированной почвой.' },
      { type: 'temperature', description: 'Защищайте молодые растения от весенних ожогов.' },
      { type: 'size', description: 'Сохраняйте колонновидную форму лёгкой санитарной обрезкой.' },
    ],
    valueType: 'size',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    variants: [
      {
        id: 1,
        value: '50-60',
        postfix: 'см',
        pots: [
          {
            id: 1,
            name: 'C2',
            price: 15,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'thuja-kornik',
    name: 'Туя Корник',
    description:
      'Декоративная туя с плотной кроной и более мягким, выразительным оттенком хвои. Подходит для одиночных посадок и небольших групп, где нужен аккуратный, но заметный акцент.',
    cares: [
      { type: 'watering', description: 'Поливайте умеренно и не допускайте переувлажнения.' },
      { type: 'light', description: 'Лучше растёт на солнце или при лёгком притенении.' },
      { type: 'temperature', description: 'Весной удаляйте подмёрзшие и сухие побеги.' },
      {
        type: 'size',
        description: 'Формируйте крону только санитарной и лёгкой корректирующей обрезкой.',
      },
    ],
    valueType: 'size',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    variants: [
      {
        id: 1,
        value: '70-80',
        postfix: 'см',
        pots: [
          {
            id: 1,
            name: 'C5',
            price: 35,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'thuja-zebrina',
    name: 'Туя Зебрина',
    description:
      'Яркая туя с пёстрой хвоей, где зелёные побеги сочетаются с золотистыми полосами. Сорт ценят за контрастный окрас и выразительный вид в смешанных композициях.',
    cares: [
      { type: 'watering', description: 'В засуху поливайте чаще и мульчируйте основание.' },
      { type: 'light', description: 'Высаживайте на хорошо освещённом месте.' },
      {
        type: 'temperature',
        description: 'Не загущайте посадки и защищайте молодые растения от вымокания зимой.',
      },
      { type: 'size', description: 'Не загущайте посадки, чтобы сохранить яркую окраску.' },
    ],
    valueType: 'size',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    variants: [
      {
        id: 1,
        value: '50-60',
        postfix: 'см',
        pots: [
          {
            id: 1,
            name: 'C2',
            price: 20,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'thuja-danica',
    name: 'Туя Даника',
    description:
      'Карликовая шаровидная туя с плотной симметричной кроной. Идеальна для бордюров, небольших композиций и посадок, где нужен аккуратный округлый силуэт.',
    cares: [
      { type: 'watering', description: 'Поддерживайте умеренную влажность почвы без застоя воды.' },
      { type: 'light', description: 'Сажайте на солнце или в полутени.' },
      {
        type: 'temperature',
        description: 'Зимой мульчируйте корневую зону, чтобы защитить поверхностные корни.',
      },
      { type: 'size', description: 'Весной удаляйте сухие участки и обновляйте мульчу.' },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    variants: [
      {
        id: 1,
        pots: [
          {
            id: 1,
            name: 'P9',
            price: 6,
            inStock: true,
            images: [],
          },
        ],
      },
      {
        id: 2,
        pots: [
          {
            id: 2,
            name: 'C2',
            price: 12,
            inStock: true,
            images: [],
          },
        ],
      },
      {
        id: 3,
        pots: [
          {
            id: 3,
            name: 'C3',
            price: 15,
            inStock: true,
            images: [],
          },
        ],
      },
      {
        id: 4,
        pots: [
          {
            id: 4,
            name: 'C5',
            price: 35,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'thuja-hoseri',
    name: 'Туя Хосери',
    description:
      'Низкорослая шаровидная туя с плотной кроной и аккуратным медленным ростом. Хорошо подходит для переднего плана, каменистых садов и компактных декоративных групп.',
    cares: [
      {
        type: 'watering',
        description: 'Поливайте в засушливые периоды, особенно у молодых растений.',
      },
      {
        type: 'light',
        description: 'Лучше развивается на светлых участках без палящего полуденного солнца.',
      },
      { type: 'temperature', description: 'Не допускайте переувлажнения и плотной тяжёлой почвы.' },
      {
        type: 'size',
        description: 'Оставляйте форму естественной, удаляя только сухие и повреждённые ветви.',
      },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    variants: [
      {
        id: 1,
        pots: [
          {
            id: 1,
            name: 'P9',
            price: 6,
            inStock: true,
            images: [],
          },
        ],
      },
      {
        id: 2,
        pots: [
          {
            id: 2,
            name: 'C5',
            price: 35,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'thuja-rheingold',
    name: 'Туя Рейнголд',
    description:
      'Декоративная туя с золотистой хвоей, которая особенно ярко выглядит на солнце. С возрастом крона становится плотной и аккуратной, хорошо работая как цветовой акцент в композиции.',
    cares: [
      { type: 'watering', description: 'Следите за влажностью почвы в жаркие недели.' },
      { type: 'light', description: 'Высаживайте на открытом солнечном участке.' },
      {
        type: 'temperature',
        description: 'Молодые растения берегите от иссушающих зимних ветров и весенних ожогов.',
      },
      { type: 'size', description: 'Весной удаляйте сухие побеги и поддерживайте форму кроны.' },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    variants: [
      {
        id: 1,
        pots: [
          {
            id: 1,
            name: 'C2',
            price: 15,
            inStock: true,
            images: [],
          },
        ],
      },
      {
        id: 2,
        pots: [
          {
            id: 2,
            name: 'C5',
            price: 35,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'juniper-bluearrow',
    name: 'Можжевельник Блю Эрроу',
    description:
      'Узкий колонновидный можжевельник с голубоватой хвоей и строгим силуэтом. Хорошо подходит для ритмичных посадок, узких участков и современных садовых композиций.',
    cares: [
      { type: 'watering', description: 'Поливайте умеренно и не допускайте застоя влаги.' },
      { type: 'light', description: 'Сажайте на полном солнце в лёгкую дренированную почву.' },
      {
        type: 'temperature',
        description: 'Хорошо переносит морозы, но молодые саженцы лучше защищать от выпревания.',
      },
      { type: 'size', description: 'Практически не требует формирующей обрезки.' },
    ],
    valueType: 'size',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    variants: [
      {
        id: 1,
        value: '80',
        postfix: 'см',
        pots: [
          {
            id: 1,
            name: 'C2',
            price: 25,
            inStock: true,
            images: [],
          },
        ],
      },
      {
        id: 2,
        value: '90-120',
        postfix: 'см',
        pots: [
          {
            id: 2,
            name: 'C5',
            price: 35,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'juniper-wiltonii',
    name: 'Можжевельник Вилтони',
    description:
      'Стелющийся можжевельник с плотным голубовато-зелёным ковром. Быстро закрывает грунт, удерживает декоративность круглый сезон и хорошо работает как почвопокровное растение.',
    cares: [
      {
        type: 'watering',
        description: 'Не заливайте растение, оно лучше переносит сухость, чем сырость.',
      },
      { type: 'light', description: 'Выбирайте солнечное место с бедной, но рыхлой почвой.' },
      {
        type: 'temperature',
        description: 'Зимой избегайте вымокания и уплотнения снега, это важнее, чем укрытие.',
      },
      { type: 'size', description: 'При необходимости слегка подрезайте края ковра.' },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    variants: [
      {
        id: 1,
        pots: [
          {
            id: 1,
            name: 'C5',
            price: 45,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'juniper-prince-of-wales',
    name: 'Можжевельник Принц Уэльский',
    description:
      'Низкий стелющийся можжевельник с плотной хвоей и хорошей зимостойкостью. Подходит для укрепления склонов, заполнения пространства и создания спокойного фонового покрытия.',
    cares: [
      { type: 'watering', description: 'После укоренения поливайте только в долгую засуху.' },
      { type: 'light', description: 'Сажайте на солнце или в лёгкой полутени.' },
      {
        type: 'temperature',
        description: 'Сорт зимостойкий, но в малоснежные зимы полезна мульча у корней.',
      },
      { type: 'size', description: 'Следите, чтобы вокруг не скапливались сорняки и мусор.' },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    variants: [
      {
        id: 1,
        pots: [
          {
            id: 1,
            name: 'C5',
            price: 45,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'juniper-lime-glow',
    name: 'Можжевельник Лайм Глоу',
    description:
      'Яркий низкорослый можжевельник с лимонно-зелёной хвоей, которая особенно заметна на солнце. Используется как светлый акцент в композициях и хорошо сочетается с тёмными хвойными.',
    cares: [
      {
        type: 'watering',
        description: 'Поливайте умеренно и не допускайте переувлажнения корней.',
      },
      { type: 'light', description: 'Высаживайте на полностью освещённом участке.' },
      {
        type: 'temperature',
        description:
          'Куст хорошо зимует, но лучше сохраняет цвет на сухих и проветриваемых местах.',
      },
      { type: 'size', description: 'Весной убирайте подсохшие побеги и обновляйте мульчу.' },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    variants: [
      {
        id: 1,
        pots: [
          {
            id: 1,
            name: 'C5',
            price: 45,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'juniper-golden-carpet',
    name: 'Можжевельник Голден Карпет',
    description:
      'Стелющийся сорт с яркой золотистой хвоей и плотным ковровым ростом. Хорошо закрывает грунт, подчёркивает края дорожек и сохраняет декоративность даже на бедных почвах.',
    cares: [
      {
        type: 'watering',
        description: 'Поливайте только в сильную засуху и не допускайте сырости.',
      },
      { type: 'light', description: 'Лучше всего окраска проявляется на солнце.' },
      {
        type: 'temperature',
        description: 'Зимой избегайте застойной влаги и тяжёлого снега на побегах.',
      },
      { type: 'size', description: 'При необходимости слегка подрезайте слишком длинные побеги.' },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: thujaImage,
    variants: [
      {
        id: 1,
        pots: [
          {
            id: 1,
            name: 'C5',
            price: 50,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'pine-mugo-mughus',
    name: 'Сосна горная Мугус',
    description:
      'Неприхотливая горная сосна с плотной широкой кроной и короткой хвоей. Подходит для каменистых садов, склонов и посадок, где важны устойчивость и выразительный природный вид.',
    cares: [
      { type: 'watering', description: 'Не перекармливайте и не переувлажняйте растение.' },
      { type: 'light', description: 'Сажайте на солнечном участке с хорошим дренажом.' },
      {
        type: 'temperature',
        description: 'Морозостоек, но плохо переносит зимнее выпревание и тяжёлую мокрую почву.',
      },
      { type: 'size', description: 'Удаляйте только сухие ветви, сильная обрезка не нужна.' },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: spruceImage,
    variants: [
      {
        id: 1,
        pots: [
          {
            id: 1,
            name: 'C2',
            price: 20,
            inStock: true,
            images: [],
          },
        ],
      },
      {
        id: 2,
        pots: [
          {
            id: 2,
            name: 'C5',
            price: 40,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'pine-mugo-pumilio',
    name: 'Сосна горная Пумилио',
    description:
      'Компактная горная сосна с подушковидной кроной и густой тёмно-зелёной хвоей. Сорт медленно растёт, долго сохраняет аккуратный силуэт и хорошо подходит для переднего плана.',
    cares: [
      { type: 'watering', description: 'Поливайте только при длительной засухе после укоренения.' },
      { type: 'light', description: 'Высаживайте на солнце в лёгкую, хорошо дренированную почву.' },
      { type: 'temperature', description: 'Избегайте тяжёлых удобрений и избыточного полива.' },
      {
        type: 'size',
        description: 'Оставляйте компактную форму, удаляя только сухие или выбивающиеся ветви.',
      },
    ],
    valueType: 'none',
    category: 'Хвойные',
    categoryKey: 'conifers',
    image: spruceImage,
    variants: [
      {
        id: 1,
        pots: [
          {
            id: 1,
            name: 'C2',
            price: 20,
            inStock: true,
            images: [],
          },
        ],
      },
      {
        id: 2,
        pots: [
          {
            id: 2,
            name: 'C5',
            price: 40,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'raspberry-rubyfall',
    name: 'Малина Рубифол',
    description:
      'Сорт малины с крупными сладкими ягодами и хорошей урожайностью. Подходит для любительского сада и даёт вкусный сбор при регулярном уходе и своевременной обрезке.',
    cares: [
      { type: 'watering', description: 'Поливайте в период цветения и налива ягод.' },
      { type: 'light', description: 'Выбирайте солнечное место и рыхлую плодородную почву.' },
      {
        type: 'temperature',
        description: 'На зиму мульчируйте корни, чтобы побеги лучше переживали морозы.',
      },
      { type: 'size', description: 'Подвязывайте побеги и удаляйте отплодоносившие стебли.' },
    ],
    valueType: 'none',
    category: 'Ягодные',
    categoryKey: 'berries',
    image: raspberryImage,
    variants: [
      {
        id: 1,
        pots: [
          {
            id: 1,
            name: 'C2',
            price: 10,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'blackberry-natchez',
    name: 'Ежевика Натчез',
    description:
      'Ранняя крупноплодная ежевика с вытянутыми сладкими ягодами и мощными побегами. Ценится за высокую товарность урожая и удобна для свежего потребления и заготовок.',
    cares: [
      { type: 'watering', description: 'Поливайте регулярно в период роста и плодоношения.' },
      { type: 'light', description: 'Сажайте на солнечном месте с опорой для побегов.' },
      {
        type: 'temperature',
        description: 'На зиму укрывайте побеги в регионах с сильными морозами.',
      },
      { type: 'size', description: 'Обрезайте старые побеги и подвязывайте молодые к опоре.' },
    ],
    valueType: 'none',
    category: 'Ягодные',
    categoryKey: 'berries',
    image: raspberryImage,
    variants: [
      {
        id: 1,
        pots: [
          {
            id: 1,
            name: 'C2',
            price: 15,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'cranberry-stevens',
    name: 'Клюква Стивенс',
    description:
      'Популярный урожайный сорт клюквы с крупными тёмно-красными ягодами. Хорошо подходит для участков с кислой почвой и ценится за стабильное плодоношение и долгий срок хранения.',
    cares: [
      { type: 'watering', description: 'Поддерживайте регулярный полив и толстый слой мульчи.' },
      { type: 'light', description: 'Сажайте только в кислый влажный субстрат.' },
      { type: 'temperature', description: 'Следите, чтобы почва не пересыхала в жаркую погоду.' },
      {
        type: 'size',
        description: 'После сбора ягод можно слегка подрезать побеги и убрать сухие листья.',
      },
    ],
    valueType: 'none',
    category: 'Ягодные',
    categoryKey: 'berries',
    image: raspberryImage,
    variants: [
      {
        id: 1,
        pots: [
          {
            id: 1,
            name: 'P9',
            price: 6,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'lingonberry-koralle',
    name: 'Брусника Коралл',
    description:
      'Компактный декоративно-плодовый кустарник с блестящей листвой и яркими ягодами. Хорошо смотрится в ягодных садах и на кислых участках, где важно сочетание красоты и урожайности.',
    cares: [
      {
        type: 'watering',
        description: 'Поливайте умеренно, не допуская ни пересыхания, ни застоя воды.',
      },
      { type: 'light', description: 'Высаживайте в кислую, лёгкую и хорошо увлажнённую почву.' },
      {
        type: 'temperature',
        description: 'Зимой полезен мульчирующий слой, но без тяжёлого укрытия.',
      },
      { type: 'size', description: 'После плодоношения можно слегка формировать куст.' },
    ],
    valueType: 'none',
    category: 'Ягодные',
    categoryKey: 'berries',
    image: raspberryImage,
    variants: [
      {
        id: 1,
        pots: [
          {
            id: 1,
            name: 'P9',
            price: 10,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'blueberry-bluecrop',
    name: 'Голубика Блюкроп',
    description:
      'Один из самых надёжных сортов голубики с крупными сладко-кислыми ягодами и стабильным урожаем. Подходит для частного сада и хорошо хранится после сбора.',
    cares: [
      {
        type: 'watering',
        description: 'Поливайте регулярно, особенно в период цветения и налива ягод.',
      },
      { type: 'light', description: 'Высаживайте в кислую почву и используйте хвойную мульчу.' },
      {
        type: 'temperature',
        description: 'Не вносите щелочные удобрения и не пересушивайте грунт.',
      },
      { type: 'size', description: 'Весной вырезайте старые и загущающие ветви.' },
    ],
    valueType: 'age',
    category: 'Ягодные',
    categoryKey: 'berries',
    image: blueberryImage,
    variants: [
      {
        id: 1,
        value: '3',
        postfix: 'года',
        pots: [
          {
            id: 1,
            name: 'C2',
            price: 12,
            inStock: true,
            images: [],
          },
        ],
      },
      {
        id: 2,
        value: '4',
        postfix: 'года',
        pots: [
          {
            id: 1,
            name: 'C2',
            price: 15,
            inStock: true,
            images: [],
          },
        ],
      },
      {
        id: 3,
        value: '5',
        postfix: 'лет',
        pots: [
          {
            id: 2,
            name: 'C5',
            price: 25,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'blueberry-duke',
    name: 'Голубика Дюк',
    description:
      'Ранний сорт голубики с крупными плотными ягодами и дружным созреванием. Даёт хороший ранний урожай и подходит для свежего потребления, заморозки и десертов.',
    cares: [
      { type: 'watering', description: 'Поддерживайте равномерную влажность и слой мульчи.' },
      { type: 'light', description: 'Сажайте на солнечном участке с кислой почвой.' },
      {
        type: 'temperature',
        description: 'Избегайте пересушивания корней и защищайте кусты от зимнего иссушения.',
      },
      { type: 'size', description: 'Регулярно обновляйте посадки обрезкой старых ветвей.' },
    ],
    valueType: 'age',
    category: 'Ягодные',
    categoryKey: 'berries',
    image: blueberryImage,
    variants: [
      {
        id: 1,
        value: '4',
        postfix: 'года',
        pots: [
          {
            id: 1,
            name: 'C2',
            price: 15,
            inStock: true,
            images: [],
          },
        ],
      },
      {
        id: 2,
        value: '5',
        postfix: 'лет',
        pots: [
          {
            id: 2,
            name: 'C5',
            price: 25,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'lavander',
    name: 'Лаванда',
    description:
      'Ароматный многолетник с серо-зелёной листвой и фиолетовыми соцветиями. Хорошо работает в бордюрах, ароматных садах и на солнечных участках с сухой почвой.',
    cares: [
      { type: 'watering', description: 'Не переувлажняйте и обеспечьте хороший дренаж.' },
      { type: 'light', description: 'Сажайте только на полном солнце.' },
      {
        type: 'temperature',
        description: 'Зимой держите куст в сухом месте и не допускайте выпревания.',
      },
      { type: 'size', description: 'После цветения слегка подрезайте побеги для компактности.' },
    ],
    valueType: 'none',
    category: 'Многолетние',
    categoryKey: 'perennials',
    image: blueberryImage,
    variants: [
      {
        id: 1,
        pots: [
          {
            id: 1,
            name: 'P9',
            price: 7,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
  {
    id: 'sage-woodland',
    name: 'Шалфей Дубравный',
    description:
      'Декоративный многолетник с ароматной листвой и лилово-фиолетовыми свечами цветков. Привлекает пчёл, долго цветёт и хорошо смотрится в природных и смешанных композициях.',
    cares: [
      { type: 'watering', description: 'Поливайте умеренно и не допускайте застоя воды.' },
      { type: 'light', description: 'Высаживайте на солнце или в лёгкой полутени.' },
      {
        type: 'temperature',
        description: 'Осенью укройте основание куста слоем мульчи, чтобы сохранить корни.',
      },
      { type: 'size', description: 'После цветения обрежьте цветоносы для повторного роста.' },
    ],
    valueType: 'none',
    category: 'Многолетние',
    categoryKey: 'perennials',
    image: blueberryImage,
    variants: [
      {
        id: 1,
        pots: [
          {
            id: 1,
            name: 'P9',
            price: 10,
            inStock: true,
            images: [],
          },
        ],
      },
    ],
  },
]
