import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useStopwatch } from './useStopwatch'

const START_TIME = new Date('2026-08-01T12:00:00.000Z')

describe('useStopwatch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(START_TIME)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts, pauses and continues from accumulated timestamp differences', () => {
    const { result } = renderHook(() => useStopwatch())

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(1_240))

    expect(result.current.elapsedMs).toBe(1_240)

    act(() => result.current.pause())
    act(() => vi.advanceTimersByTime(5_000))

    expect(result.current.status).toBe('paused')
    expect(result.current.elapsedMs).toBe(1_240)

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(760))

    expect(result.current.elapsedMs).toBe(2_000)
  })

  it('catches up after a large clock jump without counting ticks', () => {
    const { result } = renderHook(() => useStopwatch())

    act(() => result.current.start())
    vi.setSystemTime(new Date(START_TIME.getTime() + 60_000))
    act(() => vi.advanceTimersByTime(20))

    expect(result.current.elapsedMs).toBe(60_020)
  })

  it('records total and split time for each lap', () => {
    const { result } = renderHook(() => useStopwatch())

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(1_000))
    act(() => result.current.recordLap())
    act(() => vi.advanceTimersByTime(500))
    act(() => result.current.recordLap())

    expect(result.current.laps).toEqual([
      { number: 1, elapsedMs: 1_000, splitMs: 1_000 },
      { number: 2, elapsedMs: 1_500, splitMs: 500 },
    ])
  })

  it('does not record a lap while paused and reset clears all state', () => {
    const { result } = renderHook(() => useStopwatch())

    act(() => result.current.recordLap())
    expect(result.current.laps).toHaveLength(0)

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(1_000))
    act(() => result.current.recordLap())
    act(() => result.current.reset())

    expect(result.current.status).toBe('idle')
    expect(result.current.elapsedMs).toBe(0)
    expect(result.current.laps).toHaveLength(0)
  })
})
