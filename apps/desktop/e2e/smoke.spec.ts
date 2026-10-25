import { expect, test } from '@playwright/test'

test('placeholder renders with the bridge mock in the browser', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Футбольный менеджер' })).toBeVisible()
  await expect(page.getByTestId('runtime')).toHaveText('Браузер (мок моста)')
})
