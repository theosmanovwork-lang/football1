import { expect, test, type Page } from '@playwright/test'

async function openHome(page: Page, width: number): Promise<void> {
  await page.setViewportSize({ width, height: 900 })
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await expect(page.getByRole('button', { name: /Требует решения/ })).toBeVisible()
}

test('home renders in the browser with the bridge mock', async ({ page }) => {
  await openHome(page, 1440)
  await expect(page.getByRole('heading', { name: 'Главная' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Основное меню' })).toBeVisible()
})

for (const [width, readout] of [
  [1440, 'окно 1440 px · контент 888 px · полный вид'],
  [1200, 'окно 1200 px · контент 684 px · узкая панель'],
  [1024, 'окно 1024 px · контент 956 px · меню иконками'],
  [800, 'окно 800 px · контент 792 px · меню скрыто'],
] as const) {
  test(`layout at ${width} px follows the breakpoints`, async ({ page }) => {
    await openHome(page, width)
    await expect(page.getByTestId('layout-readout')).toHaveText(readout)
  })
}

test('panel slides over the content below 1200 px and the menu becomes a drawer at 800 px', async ({
  page,
}) => {
  await openHome(page, 1024)
  await expect(page.getByRole('complementary', { name: 'Следующий матч' })).toHaveCount(0)
  await page.keyboard.press(']')
  await expect(page.getByRole('button', { name: 'Закрыть боковую панель' })).toBeVisible()

  await page.setViewportSize({ width: 800, height: 900 })
  await page.getByRole('button', { name: 'Открыть меню' }).click()
  await page.getByRole('link', { name: 'Состав', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Состав' }).first()).toBeVisible()
})

test('text and icons keep their size when the window narrows', async ({ page }) => {
  await openHome(page, 1440)
  const title = page.getByText('Лиам Харт: растяжение бедра', { exact: false })
  const wide = await title.evaluate((el) => getComputedStyle(el).fontSize)
  await page.setViewportSize({ width: 800, height: 900 })
  expect(await title.evaluate((el) => getComputedStyle(el).fontSize)).toBe(wide)
})

test('command palette opens from the keyboard and switches the theme', async ({ page }) => {
  await openHome(page, 1440)
  await page.keyboard.press('Control+k')
  const input = page.getByPlaceholder('Перейти или выполнить команду…')
  await expect(input).toBeVisible()
  await input.fill('светлая')
  await page.keyboard.press('Enter')
  await expect(page.locator('html')).not.toHaveClass(/dark/)
})

test('menu width is dragged, remembered and reset by double-click', async ({ page }) => {
  await openHome(page, 1440)
  const handle = page.getByRole('button', { name: /Ширина меню/ })
  const box = await handle.boundingBox()
  if (!box) throw new Error('resize handle not found')
  await page.mouse.move(box.x + box.width / 2, box.y + 200)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + 40, box.y + 200, { steps: 5 })
  await page.mouse.up()
  await expect(page.getByTestId('layout-readout')).toHaveText(/контент 848 px/)
  await page.reload()
  await expect(page.getByTestId('layout-readout')).toHaveText(/контент 848 px/)
  await page.getByRole('button', { name: /Ширина меню/ }).dblclick()
  await expect(page.getByTestId('layout-readout')).toHaveText(/контент 888 px/)
})
