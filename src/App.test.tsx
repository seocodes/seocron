import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import App from './App'
import { AppearanceProvider } from './features/appearance/AppearanceProvider'

function renderApp() {
  return render(
    <AppearanceProvider>
      <App />
    </AppearanceProvider>,
  )
}

describe('App', () => {
  it('opens in Timer mode', () => {
    renderApp()

    expect(screen.getByRole('button', { name: 'Timer' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('heading', { name: 'Timer' })).toBeInTheDocument()
    expect(screen.getByText('seocron', { exact: true })).toBeInTheDocument()
    expect(
      screen.queryByText(/precision timing instrument/i),
    ).not.toBeInTheDocument()
  })

  it('changes display scale within limits and keeps it across modes', async () => {
    const user = userEvent.setup()
    renderApp()

    expect(screen.getByLabelText('Tamanho do mostrador: 100%')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Aumentar mostrador' }))
    await user.click(screen.getByRole('button', { name: 'Aumentar mostrador' }))
    expect(screen.getByLabelText('Tamanho do mostrador: 140%')).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Aumentar mostrador' }),
    ).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Cronômetro' }))
    expect(screen.getByLabelText('Tamanho do mostrador: 140%')).toBeVisible()
  })

  it('focus mode keeps essential actions and hides secondary content', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Ativar modo foco' }))

    expect(screen.getByRole('button', { name: 'Iniciar Timer' })).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Sair do modo foco' }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.queryByRole('button', { name: 'Cronômetro' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('combobox', { name: 'Tema' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Definir Timer para 5 minutos' }),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Sair do modo foco' }))
    expect(screen.getByRole('button', { name: 'Cronômetro' })).toBeVisible()
    expect(screen.getByRole('combobox', { name: 'Tema' })).toBeVisible()
  })

  it('switches to Stopwatch mode', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Cronômetro' }))

    expect(screen.getByRole('button', { name: 'Cronômetro' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(
      screen.getByRole('heading', { name: 'Cronômetro' }),
    ).toBeInTheDocument()
  })

  it('pauses the running mode before switching', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Iniciar Timer' }))
    await user.click(screen.getByRole('button', { name: 'Cronômetro' }))
    await user.click(screen.getByRole('button', { name: 'Timer' }))

    expect(
      screen.getByRole('button', { name: 'Continuar Timer' }),
    ).toBeInTheDocument()
  })

  it('pauses a running Stopwatch before returning to Timer', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Cronômetro' }))
    await user.click(screen.getByRole('button', { name: 'Iniciar Cronômetro' }))
    await user.click(screen.getByRole('button', { name: 'Timer' }))
    await user.click(screen.getByRole('button', { name: 'Cronômetro' }))

    expect(
      screen.getByRole('button', { name: 'Continuar Cronômetro' }),
    ).toBeInTheDocument()
  })

  it('controls the active mode with keyboard shortcuts', () => {
    renderApp()

    fireEvent.keyDown(window, { code: 'Space' })
    expect(
      screen.getByRole('button', { name: 'Pausar Timer' }),
    ).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'r' })
    expect(
      screen.getByRole('button', { name: 'Iniciar Timer' }),
    ).toBeInTheDocument()
  })

  it('resets the active Stopwatch with the keyboard shortcut', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Cronômetro' }))
    await user.click(screen.getByRole('button', { name: 'Iniciar Cronômetro' }))
    fireEvent.keyDown(window, { key: 'r' })

    expect(
      screen.getByRole('button', { name: 'Iniciar Cronômetro' }),
    ).toBeInTheDocument()
  })
})
