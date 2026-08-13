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

test('escala e modo foco vivem apenas na memória da aba', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Aumentar mostrador' }).click()
  await page.getByRole('button', { name: 'Ativar modo foco' }).click()
  await expect(page.getByLabel('Tamanho do mostrador: 120%')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Sair do modo foco' }),
  ).toBeVisible()

  await page.reload()
  await expect(page.getByLabel('Tamanho do mostrador: 100%')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Ativar modo foco' }),
  ).toBeVisible()
  await expect(page.getByRole('combobox', { name: 'Tema' })).toBeVisible()
})

test('modo foco preserva uma volta registrada em memória', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Cronômetro', exact: true }).click()
  await page.getByRole('button', { name: 'Iniciar Cronômetro' }).click()
  await page.getByRole('button', { name: 'Ativar modo foco' }).click()
  await page.getByRole('button', { name: 'Registrar volta' }).click()

  await expect(page.getByText('Voltas')).toHaveCount(0)
  await page.getByRole('button', { name: 'Sair do modo foco' }).click()
  await expect(page.getByRole('rowheader', { name: '01' })).toBeVisible()
})

test('tela cheia oferece ação ou fallback seguro', async ({ page }) => {
  await page.goto('/')
  const fullscreenIsSupported = await page.evaluate(
    () =>
      document.fullscreenEnabled &&
      typeof document.documentElement.requestFullscreen === 'function',
  )

  if (fullscreenIsSupported) {
    await page.getByRole('button', { name: 'Entrar em tela cheia' }).click()
    await expect
      .poll(() => page.evaluate(() => document.fullscreenElement !== null))
      .toBe(true)
    await page.getByRole('button', { name: 'Sair da tela cheia' }).click()
  } else {
    await expect(
      page.getByRole('button', {
        name: 'Tela cheia indisponível neste navegador',
      }),
    ).toBeDisabled()
  }
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

    for (const fontId of ['ibm-plex', 'orbitron', 'vt323', 'dseg7']) {
      await page.getByRole('combobox', { name: 'Fonte' }).selectOption(fontId)
      for (let scale = 100; scale <= 140; scale += 20) {
        await expect.poll(hasHorizontalOverflow).toBe(false)
        await page
          .getByRole('button', { name: 'Cronômetro', exact: true })
          .click()
        await expect.poll(hasHorizontalOverflow).toBe(false)
        await page.getByRole('button', { name: 'Timer', exact: true }).click()

        if (scale < 140) {
          await page.getByRole('button', { name: 'Aumentar mostrador' }).click()
        }
      }
      await page.reload()
    }
  })
})

test.describe('layout mínimo', () => {
  test.use({ viewport: { width: 320, height: 700 } })

  test('mantém 140% sem overflow nos dois modos e no foco', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('combobox', { name: 'Fonte' }).selectOption('orbitron')
    await page.getByRole('button', { name: 'Aumentar mostrador' }).click()
    await page.getByRole('button', { name: 'Aumentar mostrador' }).click()

    const hasHorizontalOverflow = () =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      )

    await expect.poll(hasHorizontalOverflow).toBe(false)
    await page.getByRole('button', { name: 'Cronômetro', exact: true }).click()
    await expect.poll(hasHorizontalOverflow).toBe(false)
    await page.getByRole('button', { name: 'Ativar modo foco' }).click()
    await expect.poll(hasHorizontalOverflow).toBe(false)
  })
})
