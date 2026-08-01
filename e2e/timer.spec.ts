import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('configura, executa e pausa o Timer sem depender de ticks', async ({
  page,
}) => {
  const display = page.getByRole('status')

  await expect(display).toHaveText('05:00')
  await page
    .getByRole('button', { name: 'Definir Timer para 10 minutos' })
    .click()
  await expect(display).toHaveText('10:00')

  await page.getByRole('button', { name: 'Iniciar Timer' }).click()
  await expect(page).toHaveTitle(/^\d{2}:\d{2} · Timer — seocron$/)
  await expect
    .poll(() => display.textContent(), { timeout: 2_500 })
    .not.toBe('10:00')

  await page.getByRole('button', { name: 'Pausar Timer' }).click()
  const pausedValue = await display.textContent()
  await page.waitForTimeout(300)
  await expect(display).toHaveText(pausedValue ?? '')
})

test('aceita uma duração manual válida', async ({ page }) => {
  await page.getByRole('spinbutton', { name: 'Horas' }).fill('0')
  await page.getByRole('spinbutton', { name: 'Minutos' }).fill('0')
  await page.getByRole('spinbutton', { name: 'Segundos' }).fill('2')
  await page.getByRole('button', { name: 'Aplicar' }).click()

  await expect(page.getByRole('status')).toHaveText('00:02')
})
