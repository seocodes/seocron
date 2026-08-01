import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useWakeLock } from './useWakeLock'

class MockWakeLockSentinel extends EventTarget {
  release = vi.fn(async () => {
    this.dispatchEvent(new Event('release'))
  })
}

describe('useWakeLock', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'wakeLock')
  })

  it('requests while active and releases when stopped', async () => {
    const sentinel = new MockWakeLockSentinel()
    const request = vi.fn(async () => sentinel)
    Object.defineProperty(navigator, 'wakeLock', {
      configurable: true,
      value: { request },
    })

    const { rerender } = renderHook(({ active }) => useWakeLock(active), {
      initialProps: { active: false },
    })

    rerender({ active: true })

    await waitFor(() => expect(request).toHaveBeenCalledWith('screen'))

    rerender({ active: false })

    await waitFor(() => expect(sentinel.release).toHaveBeenCalledOnce())
  })

  it('does nothing when the API is unavailable', () => {
    expect(() => renderHook(() => useWakeLock(true))).not.toThrow()
  })
})
