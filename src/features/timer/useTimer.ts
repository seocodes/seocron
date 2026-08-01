import { useCallback, useEffect, useState } from 'react'

import { useNow } from '../../hooks/useNow'
import { MAX_TIMER_DURATION_MS } from '../../lib/time/time.constants'

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed'

interface TimerState {
  status: TimerStatus
  configuredDurationMs: number
  pausedRemainingMs: number
  endsAtMs: number | null
}

export interface TimerController {
  status: TimerStatus
  configuredDurationMs: number
  remainingMs: number
  configure: (durationMs: number) => void
  start: () => void
  pause: () => void
  reset: () => void
}

function normalizeDuration(durationMs: number): number | null {
  if (!Number.isFinite(durationMs)) {
    return null
  }

  const wholeDurationMs = Math.floor(durationMs)

  if (wholeDurationMs < 1 || wholeDurationMs > MAX_TIMER_DURATION_MS) {
    return null
  }

  return wholeDurationMs
}

export function useTimer(initialDurationMs: number): TimerController {
  const normalizedInitialDuration = normalizeDuration(initialDurationMs)

  if (normalizedInitialDuration === null) {
    throw new RangeError('Timer duration must be within the supported range')
  }

  const [state, setState] = useState<TimerState>(() => ({
    status: 'idle',
    configuredDurationMs: normalizedInitialDuration,
    pausedRemainingMs: normalizedInitialDuration,
    endsAtMs: null,
  }))
  const now = useNow(state.status === 'running')
  const remainingMs =
    state.status === 'running' && state.endsAtMs !== null
      ? Math.max(0, state.endsAtMs - now)
      : state.pausedRemainingMs

  useEffect(() => {
    if (state.status !== 'running' || remainingMs > 0) {
      return
    }

    setState((current) => {
      if (current.status !== 'running') {
        return current
      }

      return {
        ...current,
        status: 'completed',
        pausedRemainingMs: 0,
        endsAtMs: null,
      }
    })
  }, [remainingMs, state.status])

  const configure = useCallback((durationMs: number) => {
    const normalizedDuration = normalizeDuration(durationMs)

    if (normalizedDuration === null) {
      return
    }

    setState({
      status: 'idle',
      configuredDurationMs: normalizedDuration,
      pausedRemainingMs: normalizedDuration,
      endsAtMs: null,
    })
  }, [])

  const start = useCallback(() => {
    setState((current) => {
      if (current.status === 'running') {
        return current
      }

      const nextRemainingMs =
        current.status === 'completed'
          ? current.configuredDurationMs
          : current.pausedRemainingMs

      return {
        ...current,
        status: 'running',
        pausedRemainingMs: nextRemainingMs,
        endsAtMs: Date.now() + nextRemainingMs,
      }
    })
  }, [])

  const pause = useCallback(() => {
    setState((current) => {
      if (current.status !== 'running' || current.endsAtMs === null) {
        return current
      }

      const nextRemainingMs = Math.max(0, current.endsAtMs - Date.now())

      return {
        ...current,
        status: nextRemainingMs === 0 ? 'completed' : 'paused',
        pausedRemainingMs: nextRemainingMs,
        endsAtMs: null,
      }
    })
  }, [])

  const reset = useCallback(() => {
    setState((current) => ({
      ...current,
      status: 'idle',
      pausedRemainingMs: current.configuredDurationMs,
      endsAtMs: null,
    }))
  }, [])

  return {
    status: state.status,
    configuredDurationMs: state.configuredDurationMs,
    remainingMs,
    configure,
    start,
    pause,
    reset,
  }
}
