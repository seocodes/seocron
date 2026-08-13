import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useFullscreen } from './useFullscreen'

const fullscreenEnabledDescriptor = Object.getOwnPropertyDescriptor(
  document,
  'fullscreenEnabled',
)
const fullscreenElementDescriptor = Object.getOwnPropertyDescriptor(
  document,
  'fullscreenElement',
)
const exitFullscreenDescriptor = Object.getOwnPropertyDescriptor(
  document,
  'exitFullscreen',
)
const requestFullscreenDescriptor = Object.getOwnPropertyDescriptor(
  document.documentElement,
  'requestFullscreen',
)

function restoreProperty(
  target: object,
  property: PropertyKey,
  descriptor: PropertyDescriptor | undefined,
) {
  if (descriptor) {
    Object.defineProperty(target, property, descriptor)
  } else {
    Reflect.deleteProperty(target, property)
  }
}

function mockFullscreen(options?: { requestRejects?: boolean }) {
  let fullscreenElement: Element | null = null
  const requestFullscreen = options?.requestRejects
    ? vi.fn().mockRejectedValue(new Error('denied'))
    : vi.fn(async () => {
        fullscreenElement = document.documentElement
        document.dispatchEvent(new Event('fullscreenchange'))
      })
  const exitFullscreen = vi.fn(async () => {
    fullscreenElement = null
    document.dispatchEvent(new Event('fullscreenchange'))
  })

  Object.defineProperties(document, {
    fullscreenEnabled: { configurable: true, value: true },
    fullscreenElement: {
      configurable: true,
      get: () => fullscreenElement,
    },
    exitFullscreen: { configurable: true, value: exitFullscreen },
  })
  Object.defineProperty(document.documentElement, 'requestFullscreen', {
    configurable: true,
    value: requestFullscreen,
  })

  return {
    exitFullscreen,
    requestFullscreen,
    simulateEscape: () => {
      fullscreenElement = null
      document.dispatchEvent(new Event('fullscreenchange'))
    },
  }
}

afterEach(() => {
  restoreProperty(document, 'fullscreenEnabled', fullscreenEnabledDescriptor)
  restoreProperty(document, 'fullscreenElement', fullscreenElementDescriptor)
  restoreProperty(document, 'exitFullscreen', exitFullscreenDescriptor)
  restoreProperty(
    document.documentElement,
    'requestFullscreen',
    requestFullscreenDescriptor,
  )
  vi.restoreAllMocks()
})

describe('useFullscreen', () => {
  it('reports an unsupported browser without throwing', async () => {
    Object.defineProperty(document, 'fullscreenEnabled', {
      configurable: true,
      value: false,
    })
    const { result } = renderHook(() => useFullscreen())

    await expect(result.current.toggle()).resolves.toBe('unsupported')
    expect(result.current.isSupported).toBe(false)
  })

  it('enters and exits fullscreen while following browser events', async () => {
    const fullscreen = mockFullscreen()
    const { result } = renderHook(() => useFullscreen())

    await act(async () => {
      expect(await result.current.toggle()).toBe('entered')
    })
    expect(result.current.isFullscreen).toBe(true)
    expect(fullscreen.requestFullscreen).toHaveBeenCalledOnce()

    await act(async () => {
      expect(await result.current.toggle()).toBe('exited')
    })
    expect(result.current.isFullscreen).toBe(false)
    expect(fullscreen.exitFullscreen).toHaveBeenCalledOnce()
  })

  it('follows an exit initiated by Escape', async () => {
    const fullscreen = mockFullscreen()
    const { result } = renderHook(() => useFullscreen())

    await act(() => result.current.toggle())
    act(() => fullscreen.simulateEscape())

    expect(result.current.isFullscreen).toBe(false)
  })

  it('returns an error when the browser rejects the request', async () => {
    mockFullscreen({ requestRejects: true })
    const { result } = renderHook(() => useFullscreen())

    await expect(result.current.toggle()).resolves.toBe('error')
    expect(result.current.isFullscreen).toBe(false)
  })

  it('removes the fullscreen listener on unmount', () => {
    mockFullscreen()
    const removeEventListener = vi.spyOn(document, 'removeEventListener')
    const { unmount } = renderHook(() => useFullscreen())

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith(
      'fullscreenchange',
      expect.any(Function),
    )
  })
})
