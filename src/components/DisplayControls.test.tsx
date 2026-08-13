import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DisplayControls, type DisplayControlsProps } from './DisplayControls'

const renderControlsDefaults: DisplayControlsProps = {
  scale: 100,
  isFocusMode: false,
  isFullscreen: false,
  isFullscreenSupported: true,
  onDecrease: vi.fn(),
  onIncrease: vi.fn(),
  onToggleFocus: vi.fn(),
  onToggleFullscreen: vi.fn(),
}

function renderControls(overrides: Partial<DisplayControlsProps> = {}) {
  const props: DisplayControlsProps = {
    scale: 100,
    isFocusMode: false,
    isFullscreen: false,
    isFullscreenSupported: true,
    onDecrease: vi.fn(),
    onIncrease: vi.fn(),
    onToggleFocus: vi.fn(),
    onToggleFullscreen: vi.fn(),
    ...overrides,
  }

  render(<DisplayControls {...props} />)
  return props
}

describe('DisplayControls', () => {
  it('exposes the current scale and all actions by accessible name', () => {
    renderControls({ scale: 120 })

    expect(
      screen.getByLabelText('Tamanho do mostrador: 120%'),
    ).toHaveTextContent('120%')
    expect(
      screen.getByRole('button', { name: 'Diminuir mostrador' }),
    ).toBeEnabled()
    expect(
      screen.getByRole('button', { name: 'Aumentar mostrador' }),
    ).toBeEnabled()
    expect(
      screen.getByRole('button', { name: 'Ativar modo foco' }),
    ).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls each visual action', async () => {
    const user = userEvent.setup()
    const props = renderControls()

    await user.click(screen.getByRole('button', { name: 'Diminuir mostrador' }))
    await user.click(screen.getByRole('button', { name: 'Aumentar mostrador' }))
    await user.click(screen.getByRole('button', { name: 'Ativar modo foco' }))
    await user.click(
      screen.getByRole('button', { name: 'Entrar em tela cheia' }),
    )

    expect(props.onDecrease).toHaveBeenCalledOnce()
    expect(props.onIncrease).toHaveBeenCalledOnce()
    expect(props.onToggleFocus).toHaveBeenCalledOnce()
    expect(props.onToggleFullscreen).toHaveBeenCalledOnce()
  })

  it('disables controls at scale limits and without Fullscreen API', () => {
    const { rerender } = render(
      <DisplayControls
        {...renderControlsDefaults}
        isFullscreenSupported={false}
        scale={80}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Diminuir mostrador' }),
    ).toBeDisabled()
    expect(
      screen.getByRole('button', {
        name: 'Tela cheia indisponível neste navegador',
      }),
    ).toBeDisabled()

    rerender(<DisplayControls {...renderControlsDefaults} scale={140} />)
    expect(
      screen.getByRole('button', { name: 'Aumentar mostrador' }),
    ).toBeDisabled()
  })

  it('reflects active focus and fullscreen states', () => {
    renderControls({ isFocusMode: true, isFullscreen: true })

    expect(
      screen.getByRole('button', { name: 'Sair do modo foco' }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('button', { name: 'Sair da tela cheia' }),
    ).toHaveAttribute('aria-pressed', 'true')
  })
})
