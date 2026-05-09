type CatalogItem = {
  name: string
  nameRu: string
  attributes: Record<string, string | number | boolean>
}

type CatalogCategory = {
  group: 'conifers' | 'berries' | 'foliage' | 'perennials'
  category: string
  categorySlug: string
  items: CatalogItem[]
}

export const productCatalog: CatalogCategory[] = [
  {
    group: 'conifers',
    category: 'Туя',
    categorySlug: 'thuja',
    items: [
      {
        name: 'Brabant',
        nameRu: 'Брабант',
        attributes: {
          type: 'Ширококоническая / пирамидальная',
          notes: 'Быстрорастущая, классическая форма для живой изгороди',
        },
      },
      {
        name: 'Woodwardii',
        nameRu: 'Вудварди',
        attributes: {
          type: 'Шаровидная (широкошаровидная)',
          notes: 'Крупная форма, декоративная в одиночной посадке',
        },
      },
      {
        name: 'Globosa',
        nameRu: 'Глабоза',
        attributes: { type: 'Шаровидная', notes: 'Компактная, круглая крона' },
      },
      {
        name: 'Golden Brabant',
        nameRu: 'Голден Брабант',
        attributes: {
          type: 'Широкопирамидальная (ширококоническая)',
          notes: 'Золотистая хвоя, зимостойкая',
        },
      },
      {
        name: 'Golden Smaragd',
        nameRu: 'Голден Смарагд',
        attributes: { type: 'Узкопирамидальная', notes: 'Золотистая хвоя, декоративная' },
      },
      {
        name: 'Danica',
        nameRu: 'Даника',
        attributes: { type: 'Шаровидная', notes: 'Карликовая, низкорослая, идеальна для рокариев' },
      },
      {
        name: 'Zebrina',
        nameRu: 'Зебрина',
        attributes: {
          type: 'Коническая / пирамидальная',
          notes: 'Декоративный окрас хвои, эффектная в ландшафте',
        },
      },
      {
        name: 'Columna',
        nameRu: 'Колумна',
        attributes: {
          type: 'Колонновидная',
          notes: 'Узкая, вертикальная, для малых участков и живых изгородей',
        },
      },
      {
        name: 'Kornik',
        nameRu: 'Корник',
        attributes: {
          type: 'Ширококоническая (яйцевидная)',
          notes: 'Широкая форма, подходит для групповых посадок',
        },
      },
      {
        name: 'Miriam',
        nameRu: 'Мириам',
        attributes: {
          type: 'Шаровидная / широкошаровидная',
          notes: 'Компактная, медленнорастущая, эффектная в групповых посадках',
        },
      },
      {
        name: 'Rheingold',
        nameRu: 'Рейнголд',
        attributes: {
          type: 'Ширококоническая / яйцевидная',
          notes: 'Золотистая хвоя, декоративная',
        },
      },
      {
        name: 'Smaragd',
        nameRu: 'Смарагд',
        attributes: {
          type: 'Узкопирамидальная',
          notes: 'Компактная, медленнорастущая, идеально для одиночной посадки',
        },
      },
      {
        name: 'Tiny Tim',
        nameRu: 'Тини Тим',
        attributes: {
          type: 'Шаровидная (карликовая)',
          notes: 'Очень медленнорастущая, для каменистых садов и контейнеров',
        },
      },
      {
        name: 'Hoseri',
        nameRu: 'Хосери',
        attributes: { type: 'Шаровидная', notes: 'Медленнорастущая, плотная форма' },
      },
      {
        name: 'Ericoides',
        nameRu: 'Эрикоидес',
        attributes: {
          type: 'Шаровидная / широкоокруглая',
          notes: 'Вересковидная форма, декоративная, низкая',
        },
      },
    ],
  },
  {
    group: 'conifers',
    category: 'Можжевельник',
    categorySlug: 'juniper',
    items: [
      {
        name: 'Blue Carpet',
        nameRu: 'Блю Карпет',
        attributes: { type: 'Стелющийся / ковровый', notes: 'Карликовый, декоративный' },
      },
      {
        name: 'Blue Star',
        nameRu: 'Блюстар',
        attributes: { type: 'Шаровидная', notes: 'Сине-зелёная хвоя' },
      },
      {
        name: 'Blue Chip',
        nameRu: 'Блючип',
        attributes: { type: 'Стелющийся / ковровый', notes: 'Карликовый, декоративный' },
      },
      {
        name: 'Blue Arrow',
        nameRu: 'Блю Эрроу',
        attributes: { type: 'Шаровидная / компактная', notes: 'Сине-зелёная хвоя' },
      },
      {
        name: 'Wiltonii',
        nameRu: 'Вилтони',
        attributes: { type: 'Кустовидная / плотная', notes: 'Средний размер' },
      },
      {
        name: 'Glacier',
        nameRu: 'Глэсиер',
        attributes: { type: 'Шаровидная / компактная', notes: '' },
      },
      {
        name: 'Golden Carpet',
        nameRu: 'Голден Карпет',
        attributes: { type: 'Стелющийся / ковровый', notes: 'Карликовый, декоративный' },
      },
      {
        name: 'Green Carpet',
        nameRu: 'Грин Карпет',
        attributes: { type: 'Стелющийся / ковровый', notes: 'Карликовый, декоративный' },
      },
      {
        name: 'Cossack Juniper',
        nameRu: 'Казацкий',
        attributes: { type: 'Кустовидная / распростёртая', notes: 'Низкорослый, зимостойкий' },
      },
      {
        name: 'Lime Glow',
        nameRu: 'Лайм Глоу',
        attributes: { type: 'Кустовидная / шаровидная', notes: 'Ярко-зелёная хвоя' },
      },
      {
        name: 'Old Gold',
        nameRu: 'Олд Голд',
        attributes: { type: 'Кустовидная / шаровидная', notes: 'Золотистая хвоя' },
      },
      {
        name: 'Prince of Wales',
        nameRu: 'Принц Уэльский',
        attributes: { type: 'Шаровидная', notes: 'Медленнорастущий' },
      },
      {
        name: 'Stricta',
        nameRu: 'Стрикта',
        attributes: { type: 'Колонновидная', notes: 'Узкая форма, вертикальная' },
      },
      {
        name: 'Holger',
        nameRu: 'Холгер',
        attributes: { type: 'Кустовидная / колонновидная', notes: '' },
      },
    ],
  },
  {
    group: 'conifers',
    category: 'Сосна',
    categorySlug: 'pine',
    items: [
      {
        name: 'Winter Gold',
        nameRu: 'Винтер Голд',
        attributes: { type: 'Шаровидная / компактная', notes: 'Золотистая хвоя зимой' },
      },
      {
        name: 'Green Tower',
        nameRu: 'Грин Тауэр',
        attributes: { type: 'Колонновидная', notes: 'Узкая, декоративная форма' },
      },
      {
        name: 'Maria Brigon',
        nameRu: 'Мария Бригон',
        attributes: { type: 'Шаровидная / подушковидная', notes: 'Карликовая, декоративная' },
      },
      {
        name: 'Moseri',
        nameRu: 'Мозери',
        attributes: { type: 'Карликовая / подушковидная', notes: 'Медленнорастущая, декоративная' },
      },
      {
        name: 'Mugus',
        nameRu: 'Мугус',
        attributes: { type: 'Карликовая / подушковидная', notes: 'Очень низкая, компактная' },
      },
      {
        name: 'Pumilio',
        nameRu: 'Пумилио',
        attributes: { type: 'Карликовая / подушковидная', notes: 'Медленнорастущая, декоративная' },
      },
      {
        name: 'Uncinata',
        nameRu: 'Унцината',
        attributes: { type: 'Шаровидная / широкоокруглая', notes: '' },
      },
      {
        name: 'Black Pine',
        nameRu: 'Черная',
        attributes: { type: 'Шаровидная / компактная', notes: 'Тёмная хвоя' },
      },
    ],
  },
  {
    group: 'conifers',
    category: 'Ель',
    categorySlug: 'spruce',
    items: [
      {
        name: 'Glauca Globosa',
        nameRu: 'Глаука Глабоза',
        attributes: { type: 'Шаровидная', notes: 'Сине-зелёная хвоя' },
      },
      {
        name: 'Kaibab',
        nameRu: 'Кейбаб',
        attributes: { type: 'Колонновидная', notes: 'Узкая вертикальная форма' },
      },
      {
        name: 'Conica (Canadian)',
        nameRu: 'Коника (канадская)',
        attributes: { type: 'Шаровидная / компактная', notes: 'Медленнорастущая, декоративная' },
      },
      {
        name: 'Majestic Blue',
        nameRu: 'Маджестик Блю',
        attributes: { type: 'Шаровидная / компактная', notes: 'Синяя хвоя, декоративная' },
      },
      {
        name: 'Nidiformis',
        nameRu: 'Нидиформис',
        attributes: {
          type: 'Подушковидная / карликовая',
          notes: 'Очень медленнорастущая, декоративная',
        },
      },
    ],
  },
  {
    group: 'conifers',
    category: 'Пихта',
    categorySlug: 'fir',
    items: [
      {
        name: 'Icebreaker',
        nameRu: 'Айсбрейкер',
        attributes: { type: 'Колонновидная', notes: 'Узкая, эффектная форма' },
      },
      {
        name: 'Korean Fir',
        nameRu: 'Корейская',
        attributes: { type: 'Ширококоническая', notes: 'Медленнорастущая, декоративная' },
      },
      {
        name: 'Nordmann Fir',
        nameRu: 'Нордмана',
        attributes: {
          type: 'Пирамидальная / широкопирамидальная',
          notes: 'Классическая рождественская ёлка',
        },
      },
      {
        name: 'Silberlocke',
        nameRu: 'Сильберлок',
        attributes: { type: 'Широкопирамидальная', notes: 'Синевато-зелёная хвоя' },
      },
    ],
  },
  {
    group: 'conifers',
    category: 'Кипарисовик',
    categorySlug: 'cypress',
    items: [
      {
        name: "Lawson's Yvonne",
        nameRu: 'Лавсона Ивон',
        attributes: { type: 'Колонновидная', notes: 'Узкая, вертикальная форма' },
      },
      {
        name: 'Plumosa Aurea',
        nameRu: 'Плюмоза Ауреа',
        attributes: { type: 'Шаровидная / подушковидная', notes: 'Ярко-золотистая хвоя' },
      },
      {
        name: 'Sun Gold',
        nameRu: 'Сан Голд',
        attributes: { type: 'Кустовидная / шаровидная', notes: 'Золотистая хвоя' },
      },
      {
        name: 'Filifera Nana',
        nameRu: 'Филифера Нана',
        attributes: { type: 'Подушковидная / карликовая', notes: 'Компактная, декоративная' },
      },
    ],
  },
  {
    group: 'berries',
    category: 'Голубика',
    categorySlug: 'blueberry',
    items: [
      {
        name: 'Bluecrop',
        nameRu: 'Блюкроп',
        attributes: {
          ripening_time: 'Средний',
          growth_form: 'Сильнорослый, прямостоячий',
          features: 'Самый «стандартный» промышленный сорт, стабильный урожай, транспортабельный',
          color: '',
        },
      },
      {
        name: 'Duke',
        nameRu: 'Дюк',
        attributes: {
          ripening_time: 'Ранний',
          growth_form: 'Сильнорослый, вертикальный',
          features: 'Очень ранний, дружное созревание, хорошо для рынка',
          color: '',
        },
      },
      {
        name: 'Reka',
        nameRu: 'Река',
        attributes: {
          ripening_time: 'Ранний',
          growth_form: 'Сильнорослый, прямостоячий',
          features: 'Очень урожайный, быстрый старт плодоношения',
          color: '',
        },
      },
      {
        name: 'Elizabeth',
        nameRu: 'Элизабет',
        attributes: {
          ripening_time: 'Поздний',
          growth_form: 'Сильнорослый, раскидистый',
          features: 'Отличный вкус, десертный сорт',
          color: '',
        },
      },
      {
        name: 'Chanticleer',
        nameRu: 'Шантеклер',
        attributes: {
          ripening_time: 'Ранний',
          growth_form: 'Среднерослый, компактный',
          features: 'Ранний рынок, плотная ягода',
          color: '',
        },
      },
      {
        name: 'Chandler',
        nameRu: 'Чандлер',
        attributes: {
          ripening_time: 'Средне-поздний',
          growth_form: 'Сильнорослый, раскидистый',
          features: 'Очень крупная ягода, растянутое плодоношение',
          color: '',
        },
      },
      {
        name: 'Denise Blue',
        nameRu: 'Денис Блю',
        attributes: {
          ripening_time: 'Средний',
          growth_form: 'Среднерослый',
          features: 'Крупная ягода, десертный вкус',
          color: '',
        },
      },
      {
        name: 'Bluegold',
        nameRu: 'Блюголд',
        attributes: {
          ripening_time: 'Средний',
          growth_form: 'Среднерослый, компактный',
          features: 'Морозостойкий, дружное созревание',
          color: '',
        },
      },
      {
        name: 'Nui',
        nameRu: 'Нуи',
        attributes: {
          ripening_time: 'Средний',
          growth_form: 'Сильнорослый',
          features: 'Очень крупная ягода, требователен к уходу',
          color: '',
        },
      },
      {
        name: 'Herbert',
        nameRu: 'Герберт',
        attributes: {
          ripening_time: 'Поздний',
          growth_form: 'Сильнорослый, раскидистый',
          features: 'Крупная ягода, ароматная, поздний сбор',
          color: '',
        },
      },
    ],
  },
  {
    group: 'berries',
    category: 'Малина',
    categorySlug: 'raspberry',
    items: [
      {
        name: 'Rubifol',
        nameRu: 'Рубифол',
        attributes: {
          ripening_time: 'Ремонтантная',
          growth_form: 'Средний–поздний',
          features: 'Крупная ягода, ориентирован на осенний оборот, товарный',
          color: '',
        },
      },
      {
        name: 'Maravilla',
        nameRu: 'Маравилла',
        attributes: {
          ripening_time: 'Ремонтантная',
          growth_form: 'Поздний',
          features: 'Очень крупная ягода, тепличный и туннельный сорт, хорошо хранится',
          color: '',
        },
      },
      {
        name: '18-183-1',
        nameRu: '18-183-1',
        attributes: {
          ripening_time: 'Ремонтантная',
          growth_form: 'Средний',
          features: 'Селекционный номерной сорт, промышленное направление',
          color: '',
        },
      },
      {
        name: 'Cascade Harvest',
        nameRu: 'Каскад Харвест',
        attributes: {
          ripening_time: 'Летняя',
          growth_form: 'Средний',
          features: 'Урожайный, плотная ягода, подходит для переработки и свежего рынка',
          color: '',
        },
      },
      {
        name: 'Sokolytsa',
        nameRu: 'Соколица',
        attributes: {
          ripening_time: 'Летняя',
          growth_form: 'Ранний–средний',
          features: 'Крупная ягода, десертный вкус, сильные побеги',
          color: '',
        },
      },
      {
        name: 'Cumberland',
        nameRu: 'Кумберленд',
        attributes: {
          ripening_time: 'Летняя',
          growth_form: 'Средний',
          features: 'Чёрная малина, мощный куст, ароматная ягода',
          color: '',
        },
      },
    ],
  },
  {
    group: 'berries',
    category: 'Ежевика',
    categorySlug: 'blackberry',
    items: [
      {
        name: 'Natchez',
        nameRu: 'Натчез',
        attributes: {
          ripening_time: 'Ранний',
          growth_form: 'Прямостоячий / полупрямостоячий, бесшипный',
          features:
            'Очень крупная удлинённая ягода, высокая урожайность, десертный вкус, ранний рынок',
          color: '',
        },
      },
      {
        name: 'Ouachita',
        nameRu: 'Оуачита',
        attributes: {
          ripening_time: 'Средний',
          growth_form: 'Прямостоячий, бесшипный',
          features:
            'Крупная плотная ягода, хорошая транспортабельность, стабильный промышленный сорт',
          color: '',
        },
      },
    ],
  },
  {
    group: 'berries',
    category: 'Смородина',
    categorySlug: 'currant',
    items: [
      {
        name: 'Snezhana',
        nameRu: 'Снежана',
        attributes: {
          ripening_time: 'Средний',
          growth_form: 'Среднерослый',
          features: 'Десертная, сладкая, светлая ягода',
          color: 'Белая',
        },
      },
      {
        name: 'Bayana',
        nameRu: 'Баяна',
        attributes: {
          ripening_time: 'Средний–поздний',
          growth_form: 'Сильнорослый',
          features: 'Крупная ягода, стабильный урожай',
          color: 'Белая',
        },
      },
      {
        name: 'Lasunya',
        nameRu: 'Ласунья',
        attributes: {
          ripening_time: 'Средний',
          growth_form: 'Среднерослый',
          features: 'Десертный вкус, сладко-кислая',
          color: 'Красная',
        },
      },
      {
        name: 'Svyatomikhailovskaya',
        nameRu: 'Святомихайловская',
        attributes: {
          ripening_time: 'Средний',
          growth_form: 'Сильнорослый',
          features: 'Урожайный технологический сорт',
          color: 'Красная',
        },
      },
      {
        name: 'Ulyublena',
        nameRu: 'Улюблёна',
        attributes: {
          ripening_time: 'Средний–поздний',
          growth_form: 'Среднерослый',
          features: 'Крупная ягода, десертное направление',
          color: 'Красная',
        },
      },
      {
        name: 'Selechenskaya-2',
        nameRu: 'Селеченская-2',
        attributes: {
          ripening_time: 'Ранний',
          growth_form: 'Сильнорослый',
          features: 'Очень крупная ягода, ранний рынок',
          color: 'Чёрная',
        },
      },
      {
        name: 'Dobrynya',
        nameRu: 'Добрыня',
        attributes: {
          ripening_time: 'Средний',
          growth_form: 'Компактный',
          features: 'Очень крупная, плотная ягода',
          color: 'Чёрная',
        },
      },
      {
        name: 'Nightingale Night',
        nameRu: 'Соловьиная ночь',
        attributes: {
          ripening_time: 'Средний',
          growth_form: 'Среднерослый',
          features: 'Ароматная, десертная',
          color: 'Чёрная',
        },
      },
      {
        name: '6-10-0234',
        nameRu: '6-10-0234',
        attributes: {
          ripening_time: 'Средний',
          growth_form: '—',
          features: 'Селекционная номерная форма',
          color: 'Чёрная',
        },
      },
      {
        name: '6-14-145',
        nameRu: '6-14-145',
        attributes: {
          ripening_time: 'Средний–поздний',
          growth_form: '—',
          features: 'Селекционная номерная форма',
          color: 'Чёрная',
        },
      },
      {
        name: 'Galitsky Amber',
        nameRu: 'Галицкий бурштын',
        attributes: {
          ripening_time: 'Средний',
          growth_form: 'Среднерослый',
          features: 'Зелёноплодный десертный тип',
          color: 'Зелёная',
        },
      },
    ],
  },
  {
    group: 'berries',
    category: 'Крыжовник',
    categorySlug: 'gooseberry',
    items: [
      {
        name: 'Kseniya',
        nameRu: 'Ксения',
        attributes: {
          ripening_time: 'Средний',
          growth_form: 'Среднерослый',
          features: 'Десертный вкус, крупные ягоды',
          color: '',
        },
      },
      {
        name: 'Pax',
        nameRu: 'Пакс',
        attributes: {
          ripening_time: 'Средний–поздний',
          growth_form: 'Среднерослый',
          features: 'Урожайный, плотные ягоды',
          color: '',
        },
      },
      {
        name: 'Orpheus',
        nameRu: 'Орфей',
        attributes: {
          ripening_time: 'Средний',
          growth_form: 'Сильнорослый',
          features: 'Хорошая транспортабельность',
          color: '',
        },
      },
    ],
  },
  {
    group: 'berries',
    category: 'Брусника',
    categorySlug: 'lingonberry',
    items: [
      {
        name: 'Coral',
        nameRu: 'Коралл',
        attributes: {
          ripening_time: 'Средний',
          growth_form: 'Низкорослая',
          features: 'Декоративная и съедобная, ягод много',
          color: '',
        },
      },
    ],
  },
  {
    group: 'berries',
    category: 'Клюква',
    categorySlug: 'cranberry',
    items: [
      {
        name: 'Stevens',
        nameRu: 'Стивенс',
        attributes: {
          ripening_time: 'Поздний',
          growth_form: 'Низкорослая',
          features: 'Промышленный сорт, плоды крупные, кисло-сладкие',
          color: '',
        },
      },
    ],
  },
  {
    group: 'foliage',
    category: 'Дёрен',
    categorySlug: 'dogwood',
    items: [
      {
        name: 'White Elegantissima',
        nameRu: 'Белый Элегантиссимо',
        attributes: {
          growth_form: 'Кустовидная, компактная',
          features: 'Белые цветки, декоративная кора, средний рост',
          color: 'Белая кора / зелёная листва',
        },
      },
    ],
  },
  {
    group: 'foliage',
    category: 'Пузыреплодник',
    categorySlug: 'ninebark',
    items: [
      {
        name: 'Diablo',
        nameRu: 'Дьябло',
        attributes: {
          growth_form: 'Кустовидная, компактная',
          features: 'Тёмно-бордовая листва, декоративные плоды',
          color: 'Тёмно-бордовая',
        },
      },
    ],
  },
  {
    group: 'perennials',
    category: 'Шалфей',
    categorySlug: 'sage',
    items: [
      {
        name: 'Woodland',
        nameRu: 'Дубравный',
        attributes: {},
      },
    ],
  },
  {
    group: 'perennials',
    category: 'Лаванда',
    categorySlug: 'lavander',
    items: [
      {
        name: 'Lavander',
        nameRu: 'Лаванда',
        attributes: {},
      },
    ],
  },
]
