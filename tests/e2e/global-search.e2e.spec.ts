import { expect, test, type Page } from '@playwright/test'
import { writeFile } from 'node:fs/promises'
import type { SearchResults } from '../../src/app/(frontend)/search/searchResults'

const base = 'http://localhost:3005'
test.setTimeout(90_000)
async function openSearch(page: Page, query?: string) {
  await page
    .getByRole('button', { name: 'Поиск растений', exact: true })
    .filter({ visible: true })
    .click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  if (query !== undefined) await dialog.getByRole('searchbox').fill(query)
  return dialog
}
async function results(page: Page) {
  await expect(page.getByRole('dialog').locator('.search-status')).toHaveText(
    /^\d+ растени[еяй]+ · \d+ вариант/,
  )
}

test('draft, clear, cancel, focus and scroll preserve catalog state', async ({ page }) => {
  await page.goto(
    `${base}/catalog?q=туя&category=conifers&pot=C2&priceMin=7&priceMax=40&stock=1&perPage=24`,
  )
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('combobox', { name: 'На странице' })).toHaveText('24')
  await page.evaluate(() => window.scrollTo({ top: 240, behavior: 'instant' }))
  const before = await page.evaluate(() => ({
    href: location.href,
    scroll: scrollY,
    cards: document.querySelector('main')?.textContent,
  }))
  await page
    .getByRole('button', { name: 'Поиск растений', exact: true })
    .filter({ visible: true })
    .click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('searchbox')).toHaveValue('туя')
  await dialog.getByRole('searchbox').fill('голубика')
  await results(page)
  expect(page.url()).toBe(before.href)
  await dialog.getByRole('button', { name: 'Очистить запрос' }).click()
  await expect(dialog.getByText('Найдите растение по названию')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  expect(
    await page.evaluate(() => ({
      href: location.href,
      scroll: scrollY,
      cards: document.querySelector('main')?.textContent,
    })),
  ).toEqual(before)
  await expect(
    page.getByRole('button', { name: 'Поиск растений', exact: true }).filter({ visible: true }),
  ).toBeFocused()
})

for (const action of ['enter', 'icon', 'cta'] as const) {
  test(`shared submit ${action} preserves filters and resets page`, async ({ page }) => {
    await page.goto(
      `${base}/catalog?category=conifers&pot=C2&priceMin=7&priceMax=40&stock=1&perPage=24`,
    )
    const dialog = await openSearch(page, '  туя  ')
    await page.evaluate(() => {
      const url = new URL(location.href)
      url.searchParams.set('page', '3')
      history.replaceState(null, '', url)
    })
    if (action === 'enter') await dialog.getByRole('searchbox').press('Enter')
    if (action === 'icon')
      await dialog.getByRole('button', { name: 'Искать в каталоге', exact: true }).click()
    if (action === 'cta') await dialog.locator('.search-catalog').click()
    await expect(dialog).toBeHidden()
    await expect(page).toHaveURL(/q=/)
    const params = new URL(page.url()).searchParams
    expect(params.get('q')).toBe('туя')
    expect(params.has('page')).toBe(false)
    for (const [key, value] of Object.entries({
      category: 'conifers',
      pot: 'C2',
      priceMin: '7',
      priceMax: '40',
      stock: '1',
      perPage: '24',
    }))
      expect(params.get(key)).toBe(value)
    await expect(page.getByText('Поиск: туя', { exact: false }).first()).toBeVisible()
    await page.getByRole('button', { name: 'Снять поисковый запрос' }).click()
    await expect(page).not.toHaveURL(/q=/)
    expect(new URL(page.url()).searchParams.get('pot')).toBe('C2')
  })
}

test('empty submit removes only q and IME enter does not submit', async ({ page }) => {
  await page.goto(`${base}/catalog?q=туя&category=conifers&perPage=24`)
  const dialog = await openSearch(page, '  ')
  await dialog.getByRole('searchbox').dispatchEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    isComposing: true,
    bubbles: true,
    cancelable: true,
  })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('searchbox').press('Enter')
  await expect(dialog).toBeHidden()
  await expect(page).not.toHaveURL(/q=/)
  expect(new URL(page.url()).searchParams.get('category')).toBe('conifers')
})

test('opens from home, article and product without changing their page; no filters carried to catalog', async ({
  page,
  request,
}) => {
  const data = (await (await request.get(`${base}/api/plant-search?q=туя`)).json()) as SearchResults
  await page.goto(`${base}/blog`)
  const articleHref = await page.locator('main a[href^="/blog/"]').first().getAttribute('href')
  expect(articleHref).toBeTruthy()
  for (const path of ['/', articleHref!, data.groups[0]!.primary.href]) {
    await page.goto(base + path)
    const before = page.url()
    const dialog = await openSearch(page)
    await expect(dialog.getByRole('searchbox')).toHaveValue('')
    await dialog.getByRole('searchbox').fill('туя')
    await results(page)
    expect(page.url()).toBe(before)
    await dialog.getByRole('button', { name: 'Закрыть поиск' }).click()
    expect(page.url()).toBe(before)
  }
  const dialog = await openSearch(page, 'туя')
  await dialog.getByRole('searchbox').press('Enter')
  await expect(page).toHaveURL(`${base}/catalog?q=${encodeURIComponent('туя')}`)
})

test('real offers expand in place, only one group expands, all links round-trip on product and Back', async ({
  page,
  request,
}) => {
  await page.goto(`${base}/catalog?perPage=24`)
  for (const [query, type] of [
    ['туя', 'size'],
    ['туя', 'none'],
    ['голубика', 'age'],
  ] as const) {
    const data = (await (
      await request.get(`${base}/api/plant-search?q=${encodeURIComponent(query)}`)
    ).json()) as SearchResults
    const group = data.groups.find((entry) => entry.valueType === type && entry.offers.length > 1)
    expect(group).toBeTruthy()
    const dialog = await openSearch(page, query)
    await results(page)
    const ids = await dialog
      .locator('.search-group')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-item-id')))
    const target = dialog.locator(`[data-item-id="${group!.itemId}"]`)
    await target.getByRole('button').click()
    await expect(target.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
    expect(
      await dialog
        .locator('.search-group')
        .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-item-id'))),
    ).toEqual(ids)
    await expect(target.locator('.search-offer')).toHaveCount(group!.offers.length)
    const offer = group!.offers.at(-1)!
    await target.locator(`a[href="${offer.href}"]`).last().click()
    await expect(page).toHaveURL(base + offer.href)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(group!.name)
    const assertSelection = async () => {
      await expect(
        page
          .getByRole('button', { name: offer.pot, exact: true })
          .and(page.locator('[aria-pressed]')),
      ).toHaveAttribute('aria-pressed', 'true')
      if (offer.value)
        await expect(
          page
            .getByRole('button', { name: offer.value, exact: true })
            .and(page.locator('[aria-pressed]')),
        ).toHaveAttribute('aria-pressed', 'true')
      await expect(
        page.locator('main').getByText(`${offer.price} BYN`, { exact: true }).first(),
      ).toBeVisible()
      await expect(
        page
          .locator('main')
          .getByText(offer.inStock ? 'В наличии' : 'Под заказ', { exact: true })
          .first(),
      ).toBeVisible()
      const image = page.locator('main img').first()
      await expect(image).toBeVisible()
      await expect
        .poll(() =>
          image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0),
        )
        .toBe(true)
    }
    await assertSelection()
    await page.reload()
    await assertSelection()
    await page.goBack()
    await expect(page).toHaveURL(`${base}/catalog?perPage=24`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Каталог растений')
    await expect(page.getByRole('combobox', { name: 'На странице' })).toHaveText('24')
  }
})

test('stale responses, retry and zero results stay usable', async ({ page }) => {
  await page.goto(base)
  await page.route('**/api/plant-search?*', async (route) => {
    const q = new URL(route.request().url()).searchParams.get('q')
    if (q === 'ошибка') return route.fulfill({ status: 500, json: {} })
    if (q === 'старый') {
      await new Promise((resolve) => setTimeout(resolve, 900))
      return route.fulfill({ json: { groups: [], plants: 99, offers: 99 } }).catch(() => {})
    }
    return route.continue()
  })
  const dialog = await openSearch(page, 'старый')
  await page.waitForRequest('**/api/plant-search?*')
  await dialog.getByRole('searchbox').fill('голубика')
  await results(page)
  await expect(dialog.locator('.search-status')).toContainText('2 растения')
  await page.waitForTimeout(1000)
  await expect(dialog.locator('.search-status')).not.toContainText('99')
  await dialog.getByRole('searchbox').fill('ошибка')
  await expect(dialog.getByRole('button', { name: 'Повторить' })).toBeVisible()
  await page.unroute('**/api/plant-search?*')
  await dialog.getByRole('button', { name: 'Повторить' }).click()
  await expect(dialog.getByText('Ничего не найдено')).toBeVisible()
  await dialog.getByRole('searchbox').fill('ТУЯ   СМАРАГД')
  await results(page)
  await expect(dialog.locator('.search-group')).toHaveCount(2)
})

test('responsive geometry, scrolling, focus trap, resize and screenshots', async ({ page }) => {
  test.setTimeout(120_000)
  const measurements: unknown[] = []
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  for (const width of [360, 390, 767, 768, 834, 1024, 1099, 1100, 1280, 1440]) {
    const height = width === 834 ? 1112 : width >= 1100 ? 1000 : 844
    await page.setViewportSize({ width, height })
    await page.goto(`${base}/catalog`)
    const trigger = page
      .getByRole('button', { name: 'Поиск растений', exact: true })
      .filter({ visible: true })
    const box = await trigger.boundingBox()
    expect(box!.height).toBe(width >= 1100 ? 36 : width >= 768 ? 40 : 48)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    if (width === 1100) expect(box!.width).toBeGreaterThanOrEqual(316)
    measurements.push({
      width,
      field: box,
      header: await page.locator('.site-header').boundingBox(),
    })
    if ([390, 834, 1024, 1280, 1440].includes(width))
      await page.screenshot({ path: `output/playwright/search-header-${width}.png` })
    const dialog = await openSearch(page, 'туя')
    await results(page)
    const input = dialog.getByRole('searchbox')
    await expect(input).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true)
    await input.focus()
    await dialog.locator('.search-group').first().getByRole('button').click()
    await expect
      .poll(() =>
        dialog
          .locator('img')
          .evaluateAll((nodes) =>
            nodes.every(
              (node) =>
                (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBe(true)
    if ([390, 834, 1440].includes(width))
      await page.screenshot({ path: `output/playwright/search-expanded-${width}.png` })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    if (width >= 1100) {
      const panel = await dialog.boundingBox()
      expect(Math.abs(panel!.x - box!.x)).toBeLessThan(1)
      expect(panel!.width).toBe(720)
      expect(Math.abs(panel!.y - (box!.y + box!.height + 12))).toBeLessThan(1)
    }
    await page.keyboard.press('Escape')
    if (width < 1100) {
      await page.evaluate(() => scrollTo({ top: 350, behavior: 'instant' }))
      await expect(page.getByRole('button', { name: 'Открыть поиск', exact: true })).toBeVisible()
      const y = await page.evaluate(() => scrollY)
      await page.getByRole('button', { name: 'Открыть поиск', exact: true }).click()
      await page.keyboard.press('Escape')
      expect(await page.evaluate(() => scrollY)).toBe(y)
      await expect(page.getByRole('button', { name: 'Открыть поиск', exact: true })).toBeFocused()
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(base)
  const dialog = await openSearch(page, 'туя')
  await results(page)
  await page.setViewportSize({ width: 390, height: 420 })
  await expect(dialog.getByRole('searchbox')).toHaveValue('туя')
  await expect(dialog.getByRole('searchbox')).toBeFocused()
  await expect(dialog.locator('.search-catalog')).toBeInViewport()
  await page.screenshot({ path: 'output/playwright/search-short.png' })
  await page.keyboard.press('Escape')
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page
    .getByRole('button', { name: 'Поиск растений', exact: true })
    .filter({ visible: true })
    .click()
  await page.mouse.click(15, 250)
  await expect(dialog).toBeHidden()
  expect(errors).toEqual([])
  await writeFile('output/playwright/search-geometry.json', JSON.stringify(measurements, null, 2))
})

test('touch menu, expansion position, age/pot states and keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${base}/catalog`)
  await page.getByRole('button', { name: 'Меню', exact: true }).click()
  await expect(page.getByRole('navigation', { name: 'Мобильная навигация' })).toBeVisible()
  const dialog = await openSearch(page)
  await expect(page.getByRole('navigation', { name: 'Мобильная навигация' })).toBeHidden()
  await page.keyboard.type('туя')
  await expect(dialog.getByRole('searchbox')).toHaveValue('туя')
  await results(page)
  const groups = dialog.locator('.search-group')
  await groups.nth(0).getByRole('button').click()
  const second = groups.nth(1)
  await second.evaluate((node) => {
    const scroller = node.closest('.search-results')!
    scroller.scrollTop += node.getBoundingClientRect().top - scroller.getBoundingClientRect().top
  })
  const before = (await second.boundingBox())!.y
  await second.getByRole('button').click()
  await expect(second.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  await expect(groups.nth(0).getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  expect(Math.abs((await second.boundingBox())!.y - before)).toBeLessThan(1)
  await page.screenshot({ path: 'output/playwright/search-pots-390.png' })
  await dialog.getByRole('searchbox').fill('голубика')
  await results(page)
  await groups.first().getByRole('button').click()
  await expect(dialog.getByRole('link').filter({ hasText: 'Под заказ' })).toBeVisible()
  await page.screenshot({ path: 'output/playwright/search-age-390.png' })
  await page.keyboard.press('Tab')
  expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
  await page.setViewportSize({ width: 834, height: 1112 })
  await openSearch(page)
  await page.setViewportSize({ width: 1440, height: 1000 })
  await expect(dialog.getByRole('searchbox')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.locator('.header-search-desktop')).toBeFocused()
})

test('200 percent equivalent layout, reduced motion and API validation', async ({
  browser,
  request,
}) => {
  // A 1440x1000 display at 200% exposes a 720x500 CSS viewport.
  const context = await browser.newContext({
    viewport: { width: 720, height: 500 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await page.goto(`${base}/catalog`)
  const dialog = await openSearch(page, 'голубика')
  await results(page)
  await dialog.locator('.search-group').first().getByRole('button').click()
  await expect(dialog.locator('.search-catalog')).toBeInViewport()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: 'output/playwright/search-200-percent.png' })
  await context.close()
  expect((await request.get(`${base}/api/plant-search?q=${'x'.repeat(201)}`)).status()).toBe(400)
  expect((await request.get(`${base}/api/plant-search?q=x&limit=99`)).status()).toBe(400)
  expect(await (await request.get(`${base}/api/plant-search?q=+`)).json()).toEqual({
    groups: [],
    plants: 0,
    offers: 0,
  })
  // The public read endpoint must not change the existing private REST collection.
  expect((await request.get(`${base}/api/product-variants`)).status()).toBe(403)
})

test('cancel preserves real page two and resetting filters preserves applied search', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${base}/catalog?page=2`)
  await expect(page.locator('main [role="status"]')).toContainText('13–24')
  const cards = page.locator('main a[aria-label^="Открыть страницу товара"]')
  const beforeCards = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('href')),
  )
  await page.evaluate(() => scrollTo({ top: 400, behavior: 'instant' }))
  await page.getByRole('button', { name: 'Открыть поиск', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('searchbox').fill('голубика')
  await results(page)
  await dialog.getByRole('button', { name: 'Закрыть поиск' }).click()
  await expect(page).toHaveURL(`${base}/catalog?page=2`)
  expect(await page.evaluate(() => scrollY)).toBe(400)
  expect(
    await cards.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href'))),
  ).toEqual(beforeCards)
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
  await openSearch(page, 'туя')
  await dialog.getByRole('searchbox').press('Enter')
  await expect(page).not.toHaveURL(/page=/)
  await page.setViewportSize({ width: 1280, height: 1000 })
  await page.getByRole('checkbox', { name: 'Хвойные', exact: true }).check()
  await expect(page).toHaveURL(/category=conifers/)
  await page.locator('aside').getByRole('button', { name: 'Сбросить', exact: true }).click()
  await expect(page).not.toHaveURL(/category=/)
  expect(new URL(page.url()).searchParams.get('q')).toBe('туя')
})
