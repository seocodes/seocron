import { expect, test } from '@playwright/test'

test('executa, registra volta, pausa e reseta o Cronômetro', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Cronômetro', exact: true }).click()

  const display = page.getByRole('status')
  await expect(display).toHaveText('00:00.00')
  await page.getByRole('button', { name: 'Iniciar Cronômetro' }).click()
  await expect
    .poll(() => display.textContent(), { timeout: 2_500 })
    .not.toBe('00:00.00')

  await page.getByRole('button', { name: 'Registrar volta' }).click()
  await expect(
    page.getByRole('region', { name: 'Lista de voltas' }),
  ).toBeVisible()
  await expect(page.getByRole('rowheader', { name: '01' })).toBeVisible()

  await page.getByRole('button', { name: 'Pausar Cronômetro' }).click()
  const pausedValue = await display.textContent()
  await page.waitForTimeout(300)
  await expect(display).toHaveText(pausedValue ?? '')

  await page.getByRole('button', { name: 'Resetar Cronômetro' }).click()
  await expect(display).toHaveText('00:00.00')
})
