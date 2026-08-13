import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { MINUTE_MS } from '../../lib/time/time.constants'
import { TimerPanel } from './TimerPanel'
import { useTimer } from './useTimer'

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

function TimerHarness() {
  const timer = useTimer(5 * MINUTE_MS)

  return <TimerPanel announce={vi.fn()} display={display} timer={timer} />
}

describe('TimerPanel', () => {
  it('applies a preset and reflects the selected duration', async () => {
    const user = userEvent.setup()
    render(<TimerHarness />)

    await user.click(
      screen.getByRole('button', { name: 'Definir Timer para 10 minutos' }),
    )

    expect(screen.getByLabelText('Timer: 10:00')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Definir Timer para 10 minutos' }),
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('validates and applies the manual duration', async () => {
    const user = userEvent.setup()
    render(<TimerHarness />)

    await user.clear(screen.getByRole('spinbutton', { name: 'Horas' }))
    await user.type(screen.getByRole('spinbutton', { name: 'Horas' }), '0')
    await user.clear(screen.getByRole('spinbutton', { name: 'Minutos' }))
    await user.type(screen.getByRole('spinbutton', { name: 'Minutos' }), '0')
    await user.clear(screen.getByRole('spinbutton', { name: 'Segundos' }))
    await user.type(screen.getByRole('spinbutton', { name: 'Segundos' }), '1')
    await user.click(screen.getByRole('button', { name: 'Aplicar' }))

    expect(screen.getByLabelText('Timer: 00:01')).toBeInTheDocument()
  })

  it('shows an error for an empty duration', async () => {
    const user = userEvent.setup()
    render(<TimerHarness />)

    await user.clear(screen.getByRole('spinbutton', { name: 'Horas' }))
    await user.clear(screen.getByRole('spinbutton', { name: 'Minutos' }))
    await user.clear(screen.getByRole('spinbutton', { name: 'Segundos' }))
    await user.click(screen.getByRole('button', { name: 'Aplicar' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Use apenas números inteiros nos três campos.',
    )
  })

  it('disables configuration while running', async () => {
    const user = userEvent.setup()
    render(<TimerHarness />)

    await user.click(screen.getByRole('button', { name: 'Iniciar Timer' }))

    expect(
      screen.getByRole('button', { name: 'Pausar Timer' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: 'Horas' })).toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'Definir Timer para 5 minutos' }),
    ).toBeDisabled()
  })

  it('hides configuration in focus mode', () => {
    const timer = {
      ...display,
      isFocusMode: true,
    }

    function FocusHarness() {
      return (
        <TimerPanel
          announce={vi.fn()}
          display={timer}
          timer={useTimer(5 * MINUTE_MS)}
        />
      )
    }

    render(<FocusHarness />)

    expect(screen.getByRole('button', { name: 'Iniciar Timer' })).toBeVisible()
    expect(
      screen.queryByRole('button', { name: 'Definir Timer para 5 minutos' }),
    ).not.toBeInTheDocument()
  })
})
