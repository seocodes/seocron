import { fireEvent, render, renderHook, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useKeyboardShortcuts } from './useKeyboardShortcuts'

describe('useKeyboardShortcuts', () => {
  it('maps Space and R to the active controls', () => {
    const onToggle = vi.fn()
    const onReset = vi.fn()
    renderHook(() => useKeyboardShortcuts({ onToggle, onReset }))

    const spaceEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      code: 'Space',
    })
    window.dispatchEvent(spaceEvent)
    fireEvent.keyDown(window, { key: 'r' })

    expect(spaceEvent.defaultPrevented).toBe(true)
    expect(onToggle).toHaveBeenCalledOnce()
    expect(onReset).toHaveBeenCalledOnce()
  })

  it('ignores shortcuts from interactive controls and modified keys', () => {
    const onToggle = vi.fn()
    const onReset = vi.fn()
    renderHook(() => useKeyboardShortcuts({ onToggle, onReset }))
    render(<input aria-label="Duração" />)

    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Duração' }), {
      code: 'Space',
    })
    fireEvent.keyDown(window, { ctrlKey: true, key: 'r' })
    fireEvent.keyDown(window, { code: 'Space', repeat: true })

    expect(onToggle).not.toHaveBeenCalled()
    expect(onReset).not.toHaveBeenCalled()
  })
})
