import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { AppearancePanel } from './AppearancePanel'
import { AppearanceProvider } from './AppearanceProvider'

describe('AppearancePanel', () => {
  it('changes theme and font only in the current React session', async () => {
    const user = userEvent.setup()
    const { unmount } = render(
      <AppearanceProvider>
        <AppearancePanel />
      </AppearanceProvider>,
    )

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Tema' }),
      'dracula',
    )
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Fonte' }),
      'space',
    )

    expect(document.documentElement).toHaveAttribute('data-theme', 'dracula')
    expect(document.documentElement).toHaveAttribute('data-font', 'space')

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Fonte' }),
      'dseg7',
    )

    expect(document.documentElement).toHaveAttribute('data-font', 'dseg7')

    unmount()

    expect(document.documentElement).not.toHaveAttribute('data-theme')
    expect(document.documentElement).not.toHaveAttribute('data-font')
  })
})
