import { HOUR_MS, MINUTE_MS, SECOND_MS } from './time.constants'

function pad(value: number): string {
  return value.toString().padStart(2, '0')
}

export function formatTimerDuration(durationMs: number): string {
  const safeDurationMs = Math.max(0, durationMs)
  const totalSeconds = Math.ceil(safeDurationMs / SECOND_MS)
  const hours = Math.floor(totalSeconds / 3_600)
  const minutes = Math.floor((totalSeconds % 3_600) / 60)
  const seconds = totalSeconds % 60

  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`
}

export function formatStopwatchDuration(durationMs: number): string {
  const safeDurationMs = Math.max(0, durationMs)
  const totalCentiseconds = Math.floor(safeDurationMs / 10)
  const centiseconds = totalCentiseconds % 100
  const totalSeconds = Math.floor(totalCentiseconds / 100)
  const hours = Math.floor(totalSeconds / 3_600)
  const minutes = Math.floor((totalSeconds % 3_600) / 60)
  const seconds = totalSeconds % 60

  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`
    : `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`
}

export function splitDurationMs(durationMs: number) {
  const safeDurationMs = Math.max(0, durationMs)

  return {
    hours: Math.floor(safeDurationMs / HOUR_MS),
    minutes: Math.floor((safeDurationMs % HOUR_MS) / MINUTE_MS),
    seconds: Math.floor((safeDurationMs % MINUTE_MS) / SECOND_MS),
  }
}
