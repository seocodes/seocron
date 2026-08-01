import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { StopwatchPanel } from './StopwatchPanel'
import { useStopwatch } from './useStopwatch'

function StopwatchHarness() {
  const stopwatch = useStopwatch()

  return <StopwatchPanel announce={vi.fn()} stopwatch={stopwatch} />
}

describe('StopwatchPanel', () => {
  it('starts and enables lap recording', async () => {
    const user = userEvent.setup()
    render(<StopwatchHarness />)

    expect(
      screen.getByRole('button', { name: 'Registrar volta' }),
    ).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Iniciar Cronômetro' }))

    expect(
      screen.getByRole('button', { name: 'Pausar Cronômetro' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Registrar volta' }),
    ).toBeEnabled()
  })

  it('records a lap and reset clears the list', async () => {
    const user = userEvent.setup()
    render(<StopwatchHarness />)

    await user.click(screen.getByRole('button', { name: 'Iniciar Cronômetro' }))
    await user.click(screen.getByRole('button', { name: 'Registrar volta' }))

    expect(
      screen.getByRole('region', { name: 'Lista de voltas' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: '01' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Resetar Cronômetro' }))

    expect(
      screen.queryByRole('region', { name: 'Lista de voltas' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByText('As voltas registradas aparecerão aqui.'),
    ).toBeInTheDocument()
  })
})
