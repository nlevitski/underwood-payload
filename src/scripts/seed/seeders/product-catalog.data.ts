type CatalogItem = {
  name: string
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
      { name: 'Брабант', attributes: { type: 'Ширококоническая / пирамидальная', notes: 'Быстрорастущая, классическая форма для живой изгороди' } },
      { name: 'Вудварди', attributes: { type: 'Шаровидная (широкошаровидная)', notes: 'Крупная форма, декоративная в одиночной посадке' } },
      { name: 'Глабоза', attributes: { type: 'Шаровидная', notes: 'Компактная, круглая крона' } },
      { name: 'Голден Брабант', attributes: { type: 'Широкопирамидальная (ширококоническая)', notes: 'Золотистая хвоя, зимостойкая' } },
      { name: 'Голден Смарагд', attributes: { type: 'Узкопирамидальная', notes: 'Золотистая хвоя, декоративная' } },
      { name: 'Даника', attributes: { type: 'Шаровидная', notes: 'Карликовая, низкорослая, идеальна для рокариев' } },
      { name: 'Зебрина', attributes: { type: 'Коническая / пирамидальная', notes: 'Декоративный окрас хвои, эффектная в ландшафте' } },
      { name: 'Колумна', attributes: { type: 'Колонновидная', notes: 'Узкая, вертикальная, для малых участков и живых изгородей' } },
      { name: 'Корник', attributes: { type: 'Ширококоническая (яйцевидная)', notes: 'Широкая форма, подходит для групповых посадок' } },
      { name: 'Мириам', attributes: { type: 'Шаровидная / широкошаровидная', notes: 'Компактная, медленнорастущая, эффектная в групповых посадках' } },
      { name: 'Рейнголд', attributes: { type: 'Ширококоническая / яйцевидная', notes: 'Золотистая хвоя, декоративная' } },
      { name: 'Смарагд', attributes: { type: 'Узкопирамидальная', notes: 'Компактная, медленнорастущая, идеально для одиночной посадки' } },
      { name: 'Тини Тим', attributes: { type: 'Шаровидная (карликовая)', notes: 'Очень медленнорастущая, для каменистых садов и контейнеров' } },
      { name: 'Хосери', attributes: { type: 'Шаровидная', notes: 'Медленнорастущая, плотная форма' } },
      { name: 'Эрикоидес', attributes: { type: 'Шаровидная / широкоокруглая', notes: 'Вересковидная форма, декоративная, низкая' } },
    ],
  },
  {
    group: 'conifers',
    category: 'Можжевельник',
    categorySlug: 'juniper',
    items: [
      { name: 'Блю карпет', attributes: { type: 'Стелющийся / ковровый', notes: 'Карликовый, декоративный' } },
      { name: 'Блюстар', attributes: { type: 'Шаровидная', notes: 'Сине-зелёная хвоя' } },
      { name: 'Блючип', attributes: { type: 'Стелющийся / ковровый', notes: 'Карликовый, декоративный' } },
      { name: 'Блюэрроу', attributes: { type: 'Шаровидная / компактная', notes: 'Сине-зелёная хвоя' } },
      { name: 'Вилтони', attributes: { type: 'Кустовидная / плотная', notes: 'Средний размер' } },
      { name: 'Глэсиер', attributes: { type: 'Шаровидная / компактная', notes: '' } },
      { name: 'Голден карпет', attributes: { type: 'Стелющийся / ковровый', notes: 'Карликовый, декоративный' } },
      { name: 'Грин карпет', attributes: { type: 'Стелющийся / ковровый', notes: 'Карликовый, декоративный' } },
      { name: 'Казацкий', attributes: { type: 'Кустовидная / распростёртая', notes: 'Низкорослый, зимостойкий' } },
      { name: 'Лайм глоу', attributes: { type: 'Кустовидная / шаровидная', notes: 'Ярко-зелёная хвоя' } },
      { name: 'Олд голд', attributes: { type: 'Кустовидная / шаровидная', notes: 'Золотистая хвоя' } },
      { name: 'Принц Уэльский', attributes: { type: 'Шаровидная', notes: 'Медленнорастущий' } },
      { name: 'Стрикта', attributes: { type: 'Колонновидная', notes: 'Узкая форма, вертикальная' } },
      { name: 'Холгер', attributes: { type: 'Кустовидная / колонновидная', notes: '' } },
    ],
  },
  {
    group: 'conifers',
    category: 'Сосна',
    categorySlug: 'pine',
    items: [
      { name: 'Винтер Голд', attributes: { type: 'Шаровидная / компактная', notes: 'Золотистая хвоя зимой' } },
      { name: 'Грин Тауэр', attributes: { type: 'Колонновидная', notes: 'Узкая, декоративная форма' } },
      { name: 'Мария Бригон', attributes: { type: 'Шаровидная / подушковидная', notes: 'Карликовая, декоративная' } },
      { name: 'Мозери', attributes: { type: 'Карликовая / подушковидная', notes: 'Медленнорастущая, декоративная' } },
      { name: 'Мугус', attributes: { type: 'Карликовая / подушковидная', notes: 'Очень низкая, компактная' } },
      { name: 'Пумилио', attributes: { type: 'Карликовая / подушковидная', notes: 'Медленнорастущая, декоративная' } },
      { name: 'Унцината', attributes: { type: 'Шаровидная / широкоокруглая', notes: '' } },
      { name: 'Черная', attributes: { type: 'Шаровидная / компактная', notes: 'Тёмная хвоя' } },
    ],
  },
  {
    group: 'conifers',
    category: 'Ель',
    categorySlug: 'spruce',
    items: [
      { name: 'Глаука Глабоза', attributes: { type: 'Шаровидная', notes: 'Сине-зелёная хвоя' } },
      { name: 'Кейбаб', attributes: { type: 'Колонновидная', notes: 'Узкая вертикальная форма' } },
      { name: 'Коника (канадская)', attributes: { type: 'Шаровидная / компактная', notes: 'Медленнорастущая, декоративная' } },
      { name: 'Маджестик Блю', attributes: { type: 'Шаровидная / компактная', notes: 'Синяя хвоя, декоративная' } },
      { name: 'Нидиформис', attributes: { type: 'Подушковидная / карликовая', notes: 'Очень медленнорастущая, декоративная' } },
    ],
  },
  {
    group: 'conifers',
    category: 'Пихта',
    categorySlug: 'fir',
    items: [
      { name: 'Айсбрейкер', attributes: { type: 'Колонновидная', notes: 'Узкая, эффектная форма' } },
      { name: 'Корейская', attributes: { type: 'Ширококоническая', notes: 'Медленнорастущая, декоративная' } },
      { name: 'Нордмана', attributes: { type: 'Пирамидальная / широкопирамидальная', notes: 'Классическая рождественская ёлка' } },
      { name: 'Сильберлок', attributes: { type: 'Широкопирамидальная', notes: 'Синевато-зелёная хвоя' } },
    ],
  },
  {
    group: 'conifers',
    category: 'Кипарисовик',
    categorySlug: 'cypress',
    items: [
      { name: 'Лавсона Ивон', attributes: { type: 'Колонновидная', notes: 'Узкая, вертикальная форма' } },
      { name: 'Плюмоза Ауреа', attributes: { type: 'Шаровидная / подушковидная', notes: 'Ярко-золотистая хвоя' } },
      { name: 'Сан Голд', attributes: { type: 'Кустовидная / шаровидная', notes: 'Золотистая хвоя' } },
      { name: 'Филифера Нана', attributes: { type: 'Подушковидная / карликовая', notes: 'Компактная, декоративная' } },
    ],
  },
  {
    group: 'berries',
    category: 'Голубика',
    categorySlug: 'blueberry',
    items: [
      { name: 'Блюкроп (Bluecrop)', attributes: { ripening_time: 'Средний', growth_form: 'Сильнорослый, прямостоячий', features: 'Самый «стандартный» промышленный сорт, стабильный урожай, транспортабельный', color: '' } },
      { name: 'Дюк (Duke)', attributes: { ripening_time: 'Ранний', growth_form: 'Сильнорослый, вертикальный', features: 'Очень ранний, дружное созревание, хорошо для рынка', color: '' } },
      { name: 'Река (Reka)', attributes: { ripening_time: 'Ранний', growth_form: 'Сильнорослый, прямостоячий', features: 'Очень урожайный, быстрый старт плодоношения', color: '' } },
      { name: 'Элизабет (Elizabeth)', attributes: { ripening_time: 'Поздний', growth_form: 'Сильнорослый, раскидистый', features: 'Отличный вкус, десертный сорт', color: '' } },
      { name: 'Шантеклер (Chanticleer)', attributes: { ripening_time: 'Ранний', growth_form: 'Среднерослый, компактный', features: 'Ранний рынок, плотная ягода', color: '' } },
      { name: 'Чандлер (Chandler)', attributes: { ripening_time: 'Средне-поздний', growth_form: 'Сильнорослый, раскидистый', features: 'Очень крупная ягода, растянутое плодоношение', color: '' } },
      { name: 'Денис Блю (Denise Blue)', attributes: { ripening_time: 'Средний', growth_form: 'Среднерослый', features: 'Крупная ягода, десертный вкус', color: '' } },
      { name: 'Блюголд (Bluegold)', attributes: { ripening_time: 'Средний', growth_form: 'Среднерослый, компактный', features: 'Морозостойкий, дружное созревание', color: '' } },
      { name: 'Нуи (Nui)', attributes: { ripening_time: 'Средний', growth_form: 'Сильнорослый', features: 'Очень крупная ягода, требователен к уходу', color: '' } },
      { name: 'Герберт (Herbert)', attributes: { ripening_time: 'Поздний', growth_form: 'Сильнорослый, раскидистый', features: 'Крупная ягода, ароматная, поздний сбор', color: '' } },
    ],
  },
  {
    group: 'berries',
    category: 'Малина',
    categorySlug: 'raspberry',
    items: [
      { name: 'Рубифол', attributes: { ripening_time: 'Ремонтантная', growth_form: 'Средний–поздний', features: 'Крупная ягода, ориентирован на осенний оборот, товарный', color: '' } },
      { name: 'Маравилла', attributes: { ripening_time: 'Ремонтантная', growth_form: 'Поздний', features: 'Очень крупная ягода, тепличный и туннельный сорт, хорошо хранится', color: '' } },
      { name: '18-183-1', attributes: { ripening_time: 'Ремонтантная', growth_form: 'Средний', features: 'Селекционный номерной сорт, промышленное направление', color: '' } },
      { name: 'Каскад Харвест', attributes: { ripening_time: 'Летняя', growth_form: 'Средний', features: 'Урожайный, плотная ягода, подходит для переработки и свежего рынка', color: '' } },
      { name: 'Соколица', attributes: { ripening_time: 'Летняя', growth_form: 'Ранний–средний', features: 'Крупная ягода, десертный вкус, сильные побеги', color: '' } },
      { name: 'Кумберленд', attributes: { ripening_time: 'Летняя', growth_form: 'Средний', features: 'Чёрная малина, мощный куст, ароматная ягода', color: '' } },
    ],
  },
  {
    group: 'berries',
    category: 'Ежевика',
    categorySlug: 'blackberry',
    items: [
      { name: 'Натчез', attributes: { ripening_time: 'Ранний', growth_form: 'Прямостоячий / полупрямостоячий, бесшипный', features: 'Очень крупная удлинённая ягода, высокая урожайность, десертный вкус, ранний рынок', color: '' } },
      { name: 'Оуачита', attributes: { ripening_time: 'Средний', growth_form: 'Прямостоячий, бесшипный', features: 'Крупная плотная ягода, хорошая транспортабельность, стабильный промышленный сорт', color: '' } },
    ],
  },
  {
    group: 'berries',
    category: 'Смородина',
    categorySlug: 'currant',
    items: [
      { name: 'Снежана', attributes: { ripening_time: 'Средний', growth_form: 'Среднерослый', features: 'Десертная, сладкая, светлая ягода', color: 'Белая' } },
      { name: 'Баяна', attributes: { ripening_time: 'Средний–поздний', growth_form: 'Сильнорослый', features: 'Крупная ягода, стабильный урожай', color: 'Белая' } },
      { name: 'Ласунья', attributes: { ripening_time: 'Средний', growth_form: 'Среднерослый', features: 'Десертный вкус, сладко-кислая', color: 'Красная' } },
      { name: 'Святомихайловская', attributes: { ripening_time: 'Средний', growth_form: 'Сильнорослый', features: 'Урожайный технологический сорт', color: 'Красная' } },
      { name: 'Улюблёна', attributes: { ripening_time: 'Средний–поздний', growth_form: 'Среднерослый', features: 'Крупная ягода, десертное направление', color: 'Красная' } },
      { name: 'Селеченская-2', attributes: { ripening_time: 'Ранний', growth_form: 'Сильнорослый', features: 'Очень крупная ягода, ранний рынок', color: 'Чёрная' } },
      { name: 'Добрыня', attributes: { ripening_time: 'Средний', growth_form: 'Компактный', features: 'Очень крупная, плотная ягода', color: 'Чёрная' } },
      { name: 'Соловьиная ночь', attributes: { ripening_time: 'Средний', growth_form: 'Среднерослый', features: 'Ароматная, десертная', color: 'Чёрная' } },
      { name: '6-10-0234', attributes: { ripening_time: 'Средний', growth_form: '—', features: 'Селекционная номерная форма', color: 'Чёрная' } },
      { name: '6-14-145', attributes: { ripening_time: 'Средний–поздний', growth_form: '—', features: 'Селекционная номерная форма', color: 'Чёрная' } },
      { name: 'Галицкий бурштын', attributes: { ripening_time: 'Средний', growth_form: 'Среднерослый', features: 'Зелёноплодный десертный тип', color: 'Зелёная' } },
    ],
  },
  {
    group: 'berries',
    category: 'Крыжовник',
    categorySlug: 'gooseberry',
    items: [
      { name: 'Ксения', attributes: { ripening_time: 'Средний', growth_form: 'Среднерослый', features: 'Десертный вкус, крупные ягоды', color: '' } },
      { name: 'Пакс', attributes: { ripening_time: 'Средний–поздний', growth_form: 'Среднерослый', features: 'Урожайный, плотные ягоды', color: '' } },
      { name: 'Орфей', attributes: { ripening_time: 'Средний', growth_form: 'Сильнорослый', features: 'Хорошая транспортабельность', color: '' } },
    ],
  },
  {
    group: 'berries',
    category: 'Брусника',
    categorySlug: 'lingonberry',
    items: [{ name: 'Коралл', attributes: { ripening_time: 'Средний', growth_form: 'Низкорослая', features: 'Декоративная и съедобная, ягод много', color: '' } }],
  },
  {
    group: 'berries',
    category: 'Клюква',
    categorySlug: 'cranberry',
    items: [{ name: 'Стивенс', attributes: { ripening_time: 'Поздний', growth_form: 'Низкорослая', features: 'Промышленный сорт, плоды крупные, кисло-сладкие', color: '' } }],
  },
  {
    group: 'foliage',
    category: 'Дёрен',
    categorySlug: 'dogwood',
    items: [{ name: 'Белый Элегантиссимо', attributes: { growth_form: 'Кустовидная, компактная', features: 'Белые цветки, декоративная кора, средний рост', color: 'Белая кора / зелёная листва' } }],
  },
  {
    group: 'foliage',
    category: 'Пузыреплодник',
    categorySlug: 'ninebark',
    items: [{ name: 'Дьябло', attributes: { growth_form: 'Кустовидная, компактная', features: 'Тёмно-бордовая листва, декоративные плоды', color: 'Тёмно-бордовая' } }],
  },
]
