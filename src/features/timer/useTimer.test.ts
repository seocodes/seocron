import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useTimer } from './useTimer'

const START_TIME = new Date('2026-08-01T12:00:00.000Z')

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(START_TIME)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts, pauses and continues from timestamp differences', () => {
    const { result } = renderHook(() => useTimer(5_000))

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(1_250))

    expect(result.current.remainingMs).toBe(3_750)

    act(() => result.current.pause())
    expect(result.current.status).toBe('paused')

    act(() => vi.advanceTimersByTime(5_000))
    expect(result.current.remainingMs).toBe(3_750)

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(750))

    expect(result.current.remainingMs).toBe(3_000)
  })

  it('catches up after a large clock jump without counting ticks', () => {
    const { result } = renderHook(() => useTimer(10_000))

    act(() => result.current.start())
    vi.setSystemTime(new Date(START_TIME.getTime() + 7_000))
    act(() => vi.advanceTimersByTime(50))

    expect(result.current.remainingMs).toBe(2_950)
  })

  it('completes at zero and restarts from the configured duration', () => {
    const { result } = renderHook(() => useTimer(1_000))

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(1_000))

    expect(result.current.status).toBe('completed')
    expect(result.current.remainingMs).toBe(0)

    act(() => result.current.start())

    expect(result.current.status).toBe('running')
    expect(result.current.remainingMs).toBe(1_000)
  })

  it('resets and accepts a valid new duration', () => {
    const { result } = renderHook(() => useTimer(5_000))

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(1_000))
    act(() => result.current.reset())

    expect(result.current.status).toBe('idle')
    expect(result.current.remainingMs).toBe(5_000)

    act(() => result.current.configure(10_000))

    expect(result.current.configuredDurationMs).toBe(10_000)
    expect(result.current.remainingMs).toBe(10_000)
  })
})
