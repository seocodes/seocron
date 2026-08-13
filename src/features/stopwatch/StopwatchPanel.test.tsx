import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { StopwatchPanel } from './StopwatchPanel'
import { useStopwatch } from './useStopwatch'

const display = {
  scale: 100 as const,
  isFocusMode: false,
  isFullscreen: false,
  isFullscreenSupported: false,
  onDecrease: vi.fn(),
  onIncrease: vi.fn(),
  onToggleFocus: vi.fn(),
  onToggleFullscreen: vi.fn(),
}

function StopwatchHarness() {
  const stopwatch = useStopwatch()

  return (
    <StopwatchPanel
      announce={vi.fn()}
      display={display}
      stopwatch={stopwatch}
    />
  )
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

  it('keeps lap actions but hides the register in focus mode', () => {
    function FocusHarness() {
      return (
        <StopwatchPanel
          announce={vi.fn()}
          display={{ ...display, isFocusMode: true }}
          stopwatch={useStopwatch()}
        />
      )
    }

    render(<FocusHarness />)

    expect(
      screen.getByRole('button', { name: 'Iniciar Cronômetro' }),
    ).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Registrar volta' }),
    ).toBeVisible()
    expect(screen.queryByText('Voltas')).not.toBeInTheDocument()
  })
})
