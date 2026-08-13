import { expect, test } from '@playwright/test'

test('produção carrega e executa os dois modos principais', async ({
  page,
}) => {
  await page.goto('/')

  await expect(page.getByText('seocron', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Iniciar Timer' }).click()
  await expect(page.getByRole('button', { name: 'Pausar Timer' })).toBeVisible()
  await page.getByRole('button', { name: 'Cronômetro', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Cronômetro' })).toBeVisible()
})
