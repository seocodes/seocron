import { useCallback, useState } from 'react'

import { useNow } from '../../hooks/useNow'

export type StopwatchStatus = 'idle' | 'running' | 'paused'

export interface Lap {
  number: number
  elapsedMs: number
  splitMs: number
}

interface StopwatchState {
  status: StopwatchStatus
  accumulatedMs: number
  startedAtMs: number | null
  laps: Lap[]
}

export interface StopwatchController {
  status: StopwatchStatus
  elapsedMs: number
  laps: Lap[]
  start: () => void
  pause: () => void
  reset: () => void
  recordLap: () => void
}

function getElapsedMs(state: StopwatchState, now: number): number {
  if (state.status !== 'running' || state.startedAtMs === null) {
    return state.accumulatedMs
  }

  return state.accumulatedMs + Math.max(0, now - state.startedAtMs)
}

export function useStopwatch(): StopwatchController {
  const [state, setState] = useState<StopwatchState>({
    status: 'idle',
    accumulatedMs: 0,
    startedAtMs: null,
    laps: [],
  })
  const now = useNow(state.status === 'running', 20)
  const elapsedMs = getElapsedMs(state, now)

  const start = useCallback(() => {
    setState((current) => {
      if (current.status === 'running') {
        return current
      }

      return {
        ...current,
        status: 'running',
        startedAtMs: Date.now(),
      }
    })
  }, [])

  const pause = useCallback(() => {
    setState((current) => {
      if (current.status !== 'running') {
        return current
      }

      return {
        ...current,
        status: 'paused',
        accumulatedMs: getElapsedMs(current, Date.now()),
        startedAtMs: null,
      }
    })
  }, [])

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      accumulatedMs: 0,
      startedAtMs: null,
      laps: [],
    })
  }, [])

  const recordLap = useCallback(() => {
    setState((current) => {
      if (current.status !== 'running') {
        return current
      }

      const currentElapsedMs = getElapsedMs(current, Date.now())
      const previousElapsedMs = current.laps.at(-1)?.elapsedMs ?? 0

      return {
        ...current,
        laps: [
          ...current.laps,
          {
            number: current.laps.length + 1,
            elapsedMs: currentElapsedMs,
            splitMs: currentElapsedMs - previousElapsedMs,
          },
        ],
      }
    })
  }, [])

  return {
    status: state.status,
    elapsedMs,
    laps: state.laps,
    start,
    pause,
    reset,
    recordLap,
  }
}
