import { render, screen } from '@testing-library/react'
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
})
