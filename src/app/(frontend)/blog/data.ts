import thujaImage from '@/assets/plant-thuja.jpg'
import blueberryImage from '@/assets/plant-blueberry.jpg'
import spruceImage from '@/assets/plant-spruce.jpg'
import raspberryImage from '@/assets/plant-raspberry.jpg'
import type { Article, ArticleAuthor, Media } from '@/payload-types'

import { getArticleBySlug, getArticles } from '@/collections/Articles/fetchers'

export interface BlogSection {
  heading?: string
  paragraphs?: string[]
  list?: string[]
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
  category: string
  author: string
  readTime: string
  intro?: string
  sections?: BlogSection[]
  content?: Article['content']
}

type Relation<T> = number | null | undefined | T

function isObjectRelation<T extends { id: number }>(relation: Relation<T>): relation is T {
  return typeof relation === 'object' && relation !== null
}

function formatDate(value: string | null | undefined) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatReadTime(minutes: number | null | undefined) {
  return `${Math.max(1, Math.round(minutes ?? 1))} мин`
}

function resolveMediaUrl(media: Relation<Media>, fallback: string) {
  if (!isObjectRelation<Media>(media)) {
    return fallback
  }

  return (
    media.url ??
    media.sizes?.l?.url ??
    media.sizes?.m?.url ??
    media.sizes?.s?.url ??
    media.sizes?.xs?.url ??
    fallback
  )
}

function resolveAuthorName(author: Relation<ArticleAuthor>) {
  if (!isObjectRelation<ArticleAuthor>(author)) {
    return 'Редакция Underwood'
  }

  return author.name
}

function getNodeText(node: unknown): string {
  if (!node || typeof node !== 'object') {
    return ''
  }

  const maybeNode = node as { children?: unknown[]; text?: unknown }

  if (typeof maybeNode.text === 'string') {
    return maybeNode.text
  }

  return maybeNode.children?.map(getNodeText).join('') ?? ''
}

function removeLeadingTitleHeading(content: Article['content'], title: string): Article['content'] {
  const [firstNode, ...remainingNodes] = content.root.children

  if (
    firstNode?.type === 'heading' &&
    'tag' in firstNode &&
    firstNode.tag === 'h1' &&
    getNodeText(firstNode).trim() === title.trim()
  ) {
    return {
      ...content,
      root: {
        ...content.root,
        children: remainingNodes,
      },
    }
  }

  return content
}

function removeLeadingTitleFromSummary(summary: string, title: string) {
  const normalizedTitle = title.trim()
  const normalizedSummary = summary.trim()

  if (!normalizedSummary.startsWith(normalizedTitle)) {
    return normalizedSummary
  }

  return normalizedSummary.slice(normalizedTitle.length).trim() || normalizedSummary
}

function normalizeArticleCard(article: Article): BlogPost {
  return {
    id: article.slug,
    title: article.title,
    excerpt: removeLeadingTitleFromSummary(article.contentSummary, article.title),
    image: resolveMediaUrl(article.coverImage, thujaImage.src),
    date: formatDate(article.publishedAt ?? article.createdAt),
    category: 'Статья',
    author: resolveAuthorName(article.author),
    readTime: formatReadTime(article.readTimeInMins),
  }
}

function normalizeArticlePage(article: Article): BlogPost {
  return {
    ...normalizeArticleCard(article),
    content: removeLeadingTitleHeading(article.content, article.title),
  }
}

export const blogPosts: BlogPost[] = [
  {
    id: 'thuja-care',
    title: 'Как ухаживать за туями: полное руководство',
    excerpt:
      'Разбираем основные правила полива, подкормки и обрезки туй в условиях белорусского климата. Советы от практиков с 15-летним опытом.',
    image: thujaImage.src,
    date: '15 января 2026',
    category: 'Уход',
    author: 'Андрей Подлесный',
    readTime: '7 мин',
    intro:
      'Туя — одно из самых неприхотливых хвойных растений для белорусского сада. При правильной агротехнике она десятилетиями сохраняет плотную крону и насыщенный цвет хвои. Ниже — практические рекомендации, которые мы используем в питомнике.',
    sections: [
      {
        heading: 'Полив',
        paragraphs: [
          'В первый год после посадки туя нуждается в регулярном поливе — 10–15 литров воды на куст раз в неделю. В сухую жаркую погоду интервал сокращают до 3–4 дней.',
          'Взрослые растения поливают реже, но обильно — важно промочить почву на глубину 30–40 см, где расположена основная масса корней.',
        ],
      },
      {
        heading: 'Подкормка',
        paragraphs: [
          'Весной (апрель–май) вносим комплексное удобрение для хвойных с азотом. Летом переходим на составы с пониженным содержанием азота, осенью — только калий и фосфор.',
        ],
        list: [
          'Не используйте удобрения для лиственных культур — они перегружают тую азотом.',
          'Избегайте свежего навоза: он сжигает корни.',
          'Хороший вариант — гранулированные удобрения пролонгированного действия.',
        ],
      },
      {
        heading: 'Обрезка',
        paragraphs: [
          'Санитарную обрезку проводят ранней весной: убирают сухие, сломанные и больные побеги. Формирующую стрижку делают в конце мая–июне, когда прирост окреп.',
          'Не срезайте более трети зелёной массы за один раз — туя восстанавливается медленно.',
        ],
      },
      {
        heading: 'Защита зимой',
        paragraphs: [
          'Молодые растения первые 2–3 года притеняют от февральско-мартовского солнца — иначе хвоя получает ожоги. Используем мешковину или специальные сетки для притенения.',
        ],
      },
    ],
  },
  {
    id: 'blueberry-planting',
    title: 'Посадка голубики: пошаговая инструкция',
    excerpt:
      'Выбор места, подготовка почвы и правильная посадка саженцев голубики для богатого урожая. Ошибки, которых стоит избегать.',
    image: blueberryImage.src,
    date: '10 января 2026',
    category: 'Посадка',
    author: 'Андрей Подлесный',
    readTime: '8 мин',
    intro:
      'Голубика садовая требовательна к кислотности почвы — это главное, что нужно понимать перед посадкой. Если игнорировать pH, куст будет болеть и не плодоносить, какой бы дорогой саженец вы ни купили.',
    sections: [
      {
        heading: 'Выбор места',
        paragraphs: [
          'Голубике нужно солнечное, защищённое от северных ветров место. В полутени куст растёт, но урожай падает в 2–3 раза. Уровень грунтовых вод — не выше 60 см от поверхности.',
        ],
      },
      {
        heading: 'Подготовка почвы',
        paragraphs: [
          'Оптимальный pH — 3,5–4,5. На большинстве белорусских участков почва нейтральная или слабокислая, поэтому грунт под голубику готовят отдельно.',
        ],
        list: [
          'Выкапываем яму 60×60×50 см.',
          'Заполняем смесью кислого верхового торфа, опилок хвойных пород и хвойного опада.',
          'Добавляем 30–50 г коллоидной серы для подкисления.',
          'Не вносим золу, доломитовую муку и навоз — они ощелачивают почву.',
        ],
      },
      {
        heading: 'Посадка',
        paragraphs: [
          'Саженец с закрытой корневой системой аккуратно достаём из контейнера и расправляем корневой ком — у голубики корни часто сбиваются в плотный клубок и не растут наружу.',
          'Заглубляем на 5–7 см ниже уровня контейнера. После посадки обильно поливаем и мульчируем слоем хвойного опада или коры толщиной 8–10 см.',
        ],
      },
      {
        heading: 'Частые ошибки',
        list: [
          'Посадка в обычную садовую землю — куст погибает за 1–2 сезона.',
          'Использование обычного (низинного) торфа вместо верхового — он имеет нейтральную реакцию.',
          'Полив жёсткой водой — повышает pH прикорневой зоны.',
        ],
      },
    ],
  },
  {
    id: 'winter-preparation',
    title: 'Подготовка хвойных к зиме',
    excerpt:
      'Как защитить хвойные растения от солнечных ожогов и морозов. Укрытие, мульчирование и другие важные мероприятия.',
    image: spruceImage.src,
    date: '5 января 2026',
    category: 'Сезонные работы',
    author: 'Андрей Подлесный',
    readTime: '6 мин',
    intro:
      'Главная зимняя угроза для хвойных в Беларуси — не морозы, а февральско-мартовское солнце. Хвоя начинает испарять влагу, а корни в мёрзлой почве не могут её восполнить — отсюда ожоги и побурение.',
    sections: [
      {
        heading: 'Влагозарядковый полив',
        paragraphs: [
          'В конце октября — начале ноября, до устойчивых заморозков, проводим обильный полив: 30–50 литров воды под взрослое растение. Хорошо напоённая хвоя зимует значительно лучше.',
        ],
      },
      {
        heading: 'Мульчирование',
        paragraphs: [
          'Приствольный круг засыпаем слоем коры, щепы или хвойного опада толщиной 7–10 см. Мульча защищает корни от промерзания и удерживает влагу.',
        ],
      },
      {
        heading: 'Защита от солнца',
        list: [
          'Молодые туи, можжевельники и ели притеняем мешковиной или специальной сеткой с южной и юго-западной стороны.',
          'Не используйте плёнку или нетканый материал, плотно обмотанный вокруг кроны — растение запреет.',
          'Снимаем укрытие постепенно, когда оттает почва.',
        ],
      },
      {
        heading: 'Связывание кроны',
        paragraphs: [
          'Колоновидные туи и можжевельники связываем мягким шпагатом по спирали — это защитит крону от разваливания под тяжестью мокрого снега.',
        ],
      },
    ],
  },
  {
    id: 'raspberry-pruning',
    title: 'Обрезка малины: когда и как правильно',
    excerpt:
      'Принципы обрезки ремонтантной и обычной малины. Формирование куста для максимального урожая.',
    image: raspberryImage.src,
    date: '28 декабря 2025',
    category: 'Уход',
    author: 'Андрей Подлесный',
    readTime: '5 мин',
    intro:
      'Обрезка — самый важный приём в агротехнике малины. От неё напрямую зависит урожай следующего сезона. Подход к обычной и ремонтантной малине отличается принципиально.',
    sections: [
      {
        heading: 'Обычная (летняя) малина',
        paragraphs: [
          'Плодоносит на побегах второго года. После сбора урожая (июль–август) отплодоносившие стебли сразу вырезают у самой земли — они уже не дадут ягод.',
          'Молодые побеги текущего года прореживают, оставляя 6–8 самых сильных на куст. Весной верхушки укорачивают на 15–20 см — это стимулирует боковые плодовые ветки.',
        ],
      },
      {
        heading: 'Ремонтантная малина',
        paragraphs: [
          'Самый простой и продуктивный способ — поздней осенью или ранней весной скашиваем все побеги под корень. Урожай будет на однолетних побегах в августе–сентябре.',
          'Такой способ исключает зимовку вредителей и упрощает уход.',
        ],
      },
      {
        heading: 'Сроки',
        list: [
          'Санитарная обрезка — ранняя весна, до распускания почек.',
          'Удаление отплодоносивших побегов — сразу после сбора урожая.',
          'Полная обрезка ремонтантной — октябрь–ноябрь или март.',
        ],
      },
    ],
  },
  {
    id: 'soil-acidity',
    title: 'Кислотность почвы: что важно знать',
    excerpt:
      'Как измерить pH почвы и скорректировать его для разных культур. Особенности подкисления для голубики.',
    image: blueberryImage.src,
    date: '20 декабря 2025',
    category: 'Агротехника',
    author: 'Андрей Подлесный',
    readTime: '6 мин',
    intro:
      'pH почвы определяет, какие питательные вещества растение сможет усвоить. Даже при идеальной подкормке на «неправильной» по кислотности земле культура будет голодать.',
    sections: [
      {
        heading: 'Как измерить pH',
        list: [
          'Лакмусовые полоски — быстро и недорого, точность ±0,5.',
          'Электронный pH-метр для почвы — точнее, но требует калибровки.',
          'Лабораторный анализ — самый надёжный вариант для серьёзных проектов.',
        ],
      },
      {
        heading: 'Оптимальный pH по культурам',
        list: [
          'Голубика, рододендроны, верески — 3,5–4,5 (сильнокислая).',
          'Хвойные, гортензии — 4,5–5,5 (кислая).',
          'Большинство ягодных кустарников и плодовых — 5,5–6,5.',
          'Овощи, газон — 6,0–7,0 (слабокислая–нейтральная).',
        ],
      },
      {
        heading: 'Подкисление',
        paragraphs: [
          'Самый управляемый способ — коллоидная сера: 30–50 г на м² заделывают в почву за 2–3 месяца до посадки. Также подходит верховой торф, хвойный опад, сульфат аммония.',
        ],
      },
      {
        heading: 'Раскисление',
        paragraphs: ['Доломитовая мука (300–500 г на м²) или известь-пушонка. Вносят осенью под перекопку, эффект развивается 1–2 сезона.'],
      },
    ],
  },
  {
    id: 'conifer-selection',
    title: 'Выбор хвойных для живой изгороди',
    excerpt:
      'Сравнение туи Смарагд и Брабант, ели и можжевельника. Какие хвойные лучше для вашего участка.',
    image: thujaImage.src,
    date: '15 декабря 2025',
    category: 'Выбор растений',
    author: 'Андрей Подлесный',
    readTime: '7 мин',
    intro:
      'Живая изгородь из хвойных — практичное решение для белорусского сада: круглогодичная декоративность, защита от ветра и посторонних глаз. Выбор сорта зависит от желаемой высоты, скорости роста и ухода.',
    sections: [
      {
        heading: 'Туя Смарагд',
        paragraphs: [
          'Колоновидная форма, высота до 4–5 м, прирост 10–15 см в год. Не требует формирующей стрижки — крона сама держит ровный конус. Идеальна для аккуратной изгороди высотой 2–3 м.',
        ],
      },
      {
        heading: 'Туя Брабант',
        paragraphs: [
          'Быстрорастущая (30–40 см в год), достигает 4–5 м. Требует регулярной стрижки — без неё крона разваливается. Подходит для высокой плотной стены за 4–5 лет.',
        ],
      },
      {
        heading: 'Ель обыкновенная',
        paragraphs: [
          'Самый бюджетный и выносливый вариант. При регулярной стрижке формирует плотную непроходимую стену высотой до 3–4 м. Хорошо переносит белорусские зимы и не страдает от солнечных ожогов.',
        ],
      },
      {
        heading: 'Можжевельник скальный',
        paragraphs: [
          'Сорта Skyrocket, Blue Arrow — узкие колонны до 5–6 м. Подходят для современного дизайна и небольших участков, где важна экономия пространства.',
        ],
      },
      {
        heading: 'Что выбрать',
        list: [
          'Низкая аккуратная изгородь без стрижки — туя Смарагд.',
          'Высокая густая стена быстро — туя Брабант или ель.',
          'Современный минималистичный сад — можжевельник скальный.',
        ],
      },
    ],
  },
]

export async function getBlogPosts() {
  const articles = await getArticles()

  return [...articles.map(normalizeArticleCard), ...blogPosts]
}

export async function getBlogPost(id: string) {
  const staticPost = blogPosts.find((post) => post.id === id)

  if (staticPost) {
    return staticPost
  }

  const article = await getArticleBySlug(id)

  if (!article) {
    return undefined
  }

  return normalizeArticlePage(article)
}

export async function getRelatedPosts(currentId: string, limit = 3) {
  const posts = await getBlogPosts()

  return posts.filter((post) => post.id !== currentId).slice(0, limit)
}

export async function getBlogPostSlugs() {
  const posts = await getBlogPosts()

  return posts.map(({ id }) => ({ slug: id }))
}
