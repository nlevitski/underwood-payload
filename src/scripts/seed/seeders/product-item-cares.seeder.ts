import type { Payload } from 'payload'
import { productCatalog, type CatalogItemCare } from './product-catalog.data'

type CatalogCategorySlug = (typeof productCatalog)[number]['categorySlug']
type CatalogCategory = (typeof productCatalog)[number]

type ProductItemCareData = {
  item: number
  watering?: string
  light?: string
  soil?: string
  temperature?: string
  size?: string
}

type CareDefaults = Omit<ProductItemCareData, 'item'>

const defaultCaresByCategorySlug: Record<CatalogCategorySlug, CareDefaults> = {
  thuja: {
    watering:
      'Поливайте регулярно в первый сезон после посадки; взрослые растения поливайте в засуху.',
    light: 'Сажайте на солнце или в лёгкой полутени, чтобы крона оставалась плотной.',
    soil: 'Подходит плодородная, умеренно влажная и хорошо дренированная почва без застоя воды.',
    temperature: 'Молодые растения защищайте от зимнего иссушения и ранневесеннего солнца.',
    size: 'Весной удаляйте сухие ветви; формирующую стрижку проводите умеренно, по сортовой форме.',
  },
  juniper: {
    watering:
      'После укоренения поливайте только в длительную засуху; переувлажнения не допускайте.',
    light: 'Лучше всего окраска и плотность хвои проявляются на солнечном месте.',
    soil: 'Нужна лёгкая дренированная почва; тяжёлые сырые участки и застой воды нежелательны.',
    temperature: 'Большинство сортов зимостойкие, но молодые посадки полезно мульчировать.',
    size: 'Обрезайте минимально: удаляйте сухие побеги и при необходимости подравнивайте контур.',
  },
  pine: {
    watering:
      'Поливайте умеренно после посадки; укоренившиеся сосны хорошо переносят краткую засуху.',
    light: 'Высаживайте на полном солнце, иначе крона становится рыхлой.',
    soil: 'Предпочитает рыхлую дренированную почву без застоя влаги и избытка удобрений.',
    temperature:
      'Зимостойка, но молодые растения защищайте от выпревания и тяжёлого мокрого снега.',
    size: 'Сильная обрезка не нужна; весной удаляйте сухие ветви и прищипывайте прирост при формировке.',
  },
  spruce: {
    watering: 'Поддерживайте умеренную влажность, особенно в жару и первые годы после посадки.',
    light: 'Сажайте на солнце или в лёгкой полутени; голубые формы ярче окрашены на солнце.',
    soil: 'Лучше растёт на свежей, слабокислой, дренированной почве с мульчированием приствольного круга.',
    temperature: 'Молодые растения защищайте от весенних ожогов и пересушивающего ветра.',
    size: 'Обычно достаточно санитарной обрезки; формировку проводите только по молодому приросту.',
  },
  fir: {
    watering: 'Почву держите умеренно влажной, не пересушивайте корневую зону в жару.',
    light: 'Подходит солнце или лёгкая полутень, особенно для молодых растений.',
    soil: 'Нужна плодородная, свежая, слабокислая и хорошо дренированная почва.',
    temperature: 'Молодые пихты защищайте от зимнего ветра и ранневесеннего солнца.',
    size: 'Обрезайте только сухие и повреждённые ветви, сохраняя естественную форму кроны.',
  },
  cypress: {
    watering: 'Поливайте регулярно без заболачивания, особенно в сухую погоду и после посадки.',
    light: 'Сажайте на солнечном или слегка притенённом, защищённом от ветра месте.',
    soil: 'Подходит свежая плодородная дренированная почва; застой влаги зимой опасен.',
    temperature: 'В первые зимы мульчируйте корни и защищайте крону от иссушающих ветров.',
    size: 'Поддерживайте форму лёгкой санитарной и корректирующей обрезкой.',
  },
  blueberry: {
    watering: 'Поливайте регулярно мягкой водой, особенно во время цветения, налива ягод и засухи.',
    light: 'Выбирайте солнечное место; в тени урожайность и сахаристость ягод снижаются.',
    soil: 'Нужен кислый рыхлый субстрат с хвойной мульчей; не используйте золу и щелочные удобрения.',
    temperature: 'Зимостойка, но корни защищайте мульчей, а кусты берегите от зимнего иссушения.',
    size: 'С 4-5 года вырезайте старые, слабые и загущающие побеги ранней весной.',
  },
  raspberry: {
    watering: 'Поливайте регулярно в период роста побегов, цветения и налива ягод.',
    light: 'Лучший урожай даёт на солнечном, проветриваемом участке.',
    soil: 'Почва должна быть плодородной, рыхлой и умеренно влажной; полезна органическая мульча.',
    temperature:
      'На зиму мульчируйте корневую зону; чувствительные сорта пригибайте или укрывайте по условиям участка.',
    size: 'Удаляйте отплодоносившие побеги; ремонтантные сорта можно срезать на уровне почвы осенью.',
  },
  blackberry: {
    watering: 'Поддерживайте стабильную влажность во время роста и плодоношения, не заливая корни.',
    light: 'Сажайте на солнечном, тёплом и защищённом от ветра месте.',
    soil: 'Нужна плодородная дренированная почва и опора для побегов.',
    temperature: 'В холодных регионах побеги на зиму снимают с опоры и укрывают.',
    size: 'После плодоношения вырезайте старые побеги и подвязывайте молодые к шпалере.',
  },
  currant: {
    watering: 'Поливайте в засуху, особенно во время цветения и налива ягод.',
    light:
      'Сажайте на солнце или в лёгкой полутени; красные и белые сорта лучше плодоносят на солнце.',
    soil: 'Подходит плодородная влагоёмкая почва без застоя воды; мульча помогает удерживать влагу.',
    temperature: 'Культура зимостойкая, но молодые посадки полезно мульчировать перед зимой.',
    size: 'Ежегодно вырезайте старые, слабые и загущающие ветви для обновления куста.',
  },
  gooseberry: {
    watering: 'Поливайте умеренно в засуху и во время налива ягод, избегая сырости у корней.',
    light: 'Лучше плодоносит на солнце или в лёгкой полутени.',
    soil: 'Нужна плодородная дренированная почва; не сажайте в низинах с застойной влагой.',
    temperature: 'Зимостоек, но корневую зону молодых кустов лучше мульчировать.',
    size: 'Регулярно прореживайте куст, удаляя старые и загущающие побеги.',
  },
  lingonberry: {
    watering: 'Поддерживайте умеренную влажность кислого субстрата, не допуская пересыхания.',
    light: 'Сажайте на солнце или в лёгкой полутени.',
    soil: 'Нужна кислая рыхлая почва с торфом и хвойной мульчей.',
    temperature: 'Зимостойка; полезен лёгкий мульчирующий слой без плотного укрытия.',
    size: 'После плодоношения удаляйте сухие побеги и слегка омолаживайте посадку.',
  },
  cranberry: {
    watering: 'Почва должна оставаться влажной, особенно в жару и во время налива ягод.',
    light: 'Сажайте на открытом солнечном месте.',
    soil: 'Нужен кислый влажный субстрат на основе торфа, без известкования и золы.',
    temperature: 'Зимостойка, но посадки должны уходить в зиму влажными и замульчированными.',
    size: 'Периодически укорачивайте слишком длинные побеги и удаляйте сухие части.',
  },
  dogwood: {
    watering: 'Поливайте молодые растения регулярно; взрослые кусты поливайте в длительную засуху.',
    light: 'Растёт на солнце и в полутени, в полутени листва меньше страдает от жары.',
    soil: 'Подходит садовая плодородная умеренно влажная почва без застоя воды.',
    temperature: 'Зимостоек, декоративные побеги хорошо сохраняются после санитарной обрезки.',
    size: 'Ранней весной вырезайте старые побеги, чтобы стимулировать яркий молодой прирост.',
  },
  ninebark: {
    watering: 'Поливайте после посадки и в засуху; взрослые кусты достаточно устойчивы.',
    light: 'Для насыщенной окраски листвы выбирайте солнечное место.',
    soil: 'Неприхотлив к почве, но лучше развивается на дренированном садовом грунте.',
    temperature: 'Зимостойкий кустарник, обычно не требует укрытия.',
    size: 'Хорошо переносит стрижку; формируйте после цветения или ранней весной.',
  },
  sage: {
    watering: 'Поливайте умеренно; после укоренения растение переносит краткую засуху.',
    light: 'Высаживайте на солнце или в лёгкой полутени.',
    soil: 'Нужна рыхлая дренированная почва без застоя воды.',
    temperature: 'Осенью полезно замульчировать основание куртины.',
    size: 'После цветения обрежьте цветоносы, чтобы сохранить аккуратную куртину и стимулировать повторный рост.',
  },
  lavander: {
    watering: 'Поливайте редко и только после подсыхания почвы; переувлажнение опаснее засухи.',
    light: 'Сажайте на полном солнце, в тёплом и проветриваемом месте.',
    soil: 'Нужна лёгкая щелочная или нейтральная дренированная почва без сырости.',
    temperature:
      'На зиму важны сухость и дренаж; в бесснежные морозы основание можно слегка укрыть.',
    size: 'После цветения слегка подрезайте побеги, не срезая старую древесину слишком низко.',
  },
}

export function buildItemCareData(
  itemId: number,
  category: CatalogCategory,
  cares: CatalogItemCare[] = [],
): ProductItemCareData {
  const data: ProductItemCareData = {
    item: itemId,
    ...defaultCaresByCategorySlug[category.categorySlug],
  }

  for (const care of cares) {
    // Older catalog data used universal slots for soil-related notes; only these two stayed semantic.
    if (care.type !== 'watering' && care.type !== 'size') {
      continue
    }

    data[care.type] = care.description
  }

  return data
}

export async function seedProductItemCares(payload: Payload) {
  const [{ docs: groups }, { docs: categories }, { docs: items }] = await Promise.all([
    payload.find({
      collection: 'product-groups',
      depth: 0,
      limit: 0,
      pagination: false,
    }),
    payload.find({
      collection: 'product-categories',
      depth: 0,
      limit: 0,
      pagination: false,
    }),
    payload.find({
      collection: 'product-items',
      depth: 0,
      limit: 0,
      pagination: false,
    }),
  ])

  const groupNameById = new Map<number, string>()
  for (const group of groups) {
    if (typeof group.id === 'number') {
      groupNameById.set(group.id, group.name)
    }
  }

  const categoryIdByKey = new Map<string, number>()
  for (const category of categories) {
    const groupId = typeof category.group === 'number' ? category.group : null
    if (!groupId || typeof category.id !== 'number') {
      continue
    }

    const groupName = groupNameById.get(groupId)
    if (!groupName) {
      continue
    }

    if (typeof category.nameRu === 'string') {
      categoryIdByKey.set(`${groupName}::${category.nameRu}`, category.id)
    }

    if (typeof category.name === 'string') {
      categoryIdByKey.set(`${groupName}::${category.name}`, category.id)
    }
  }

  const itemIdByKey = new Map<string, number>()
  for (const item of items) {
    if (typeof item.id !== 'number') {
      continue
    }

    const categoryId = typeof item.category === 'number' ? item.category : null
    if (!categoryId) {
      continue
    }

    itemIdByKey.set(`${categoryId}::${item.name}`, item.id)
  }

  const createOperations: Promise<unknown>[] = []

  for (const catalogCategory of productCatalog) {
    const categoryId =
      categoryIdByKey.get(`${catalogCategory.group}::${catalogCategory.category}`) ??
      categoryIdByKey.get(`${catalogCategory.group}::${catalogCategory.categorySlug}`)
    if (!categoryId) {
      continue
    }

    for (const item of catalogCategory.items) {
      const itemId = itemIdByKey.get(`${categoryId}::${item.name}`)
      if (!itemId) {
        throw new Error(
          `Product item not found for care seed: ${catalogCategory.category}/${item.name}`,
        )
      }

      createOperations.push(
        payload.create({
          collection: 'product-item-cares',
          data: buildItemCareData(itemId, catalogCategory, item.cares),
        }),
      )
    }
  }

  await Promise.all(createOperations)
}
