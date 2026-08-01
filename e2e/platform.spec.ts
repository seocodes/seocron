import { expect, test } from '@playwright/test'

test('atalhos globais ignoram inputs e controlam o modo ativo', async ({
  page,
}) => {
  await page.goto('/')
  const display = page.getByRole('status')

  await page.getByRole('spinbutton', { name: 'Horas' }).focus()
  await page.keyboard.press('Space')
  await expect(display).toHaveText('05:00')
  await expect(
    page.getByRole('button', { name: 'Iniciar Timer' }),
  ).toBeVisible()

  await page.getByText('Defina um tempo e comece').click()
  await page.keyboard.press('Space')
  await expect(page.getByRole('button', { name: 'Pausar Timer' })).toBeVisible()

  await page.keyboard.press('r')
  await expect(display).toHaveText('05:00')
  await expect(
    page.getByRole('button', { name: 'Iniciar Timer' }),
  ).toBeVisible()
})

test('aparência vive apenas na memória da aba', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('combobox', { name: 'Tema' }).selectOption('signal-red')
  await page.getByRole('combobox', { name: 'Fonte' }).selectOption('dseg7')

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'signal-red')
  await expect(page.locator('html')).toHaveAttribute('data-font', 'dseg7')
  await expect
    .poll(() =>
      page.evaluate(() => document.fonts.check('400 64px "DSEG7 Classic"')),
    )
    .toBe(true)

  await page.reload()
  await expect(page.getByRole('combobox', { name: 'Tema' })).toHaveValue('nord')
  await expect(page.getByRole('combobox', { name: 'Fonte' })).toHaveValue(
    'jetbrains',
  )
})

test.describe('layout mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('não cria overflow horizontal nos dois modos', async ({ page }) => {
    await page.goto('/')

    const hasHorizontalOverflow = () =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      )

    for (const fontId of ['vt323', 'dseg7']) {
      await page.getByRole('combobox', { name: 'Fonte' }).selectOption(fontId)
      await expect.poll(hasHorizontalOverflow).toBe(false)
      await page
        .getByRole('button', { name: 'Cronômetro', exact: true })
        .click()
      await expect.poll(hasHorizontalOverflow).toBe(false)
      await page.getByRole('button', { name: 'Timer', exact: true }).click()
    }
  })
})
