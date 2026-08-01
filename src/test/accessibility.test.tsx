import { fireEvent, render, screen } from '@testing-library/react'
import axe from 'axe-core'
import { describe, expect, it } from 'vitest'

import App from '../App'
import { AppearanceProvider } from '../features/appearance/AppearanceProvider'
import { themes } from '../features/appearance/themes'

describe('application accessibility', () => {
  it.each(themes)(
    '$label has no automated semantic violations',
    async ({ id }) => {
      const { container } = render(
        <AppearanceProvider>
          <App />
        </AppearanceProvider>,
      )

      fireEvent.change(screen.getByRole('combobox', { name: 'Tema' }), {
        target: { value: id },
      })

      const results = await axe.run(container, {
        rules: {
          // jsdom has no layout engine; color contrast is covered by themes.test.ts.
          'color-contrast': { enabled: false },
        },
      })

      expect(
        results.violations,
        results.violations
          .map((violation) => `${violation.id}: ${violation.help}`)
          .join('\n'),
      ).toHaveLength(0)
    },
  )
})
