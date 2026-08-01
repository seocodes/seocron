import {
  HOUR_MS,
  MAX_TIMER_HOURS,
  MINUTE_MS,
  SECOND_MS,
} from './time.constants'

export interface DurationParts {
  hours: number
  minutes: number
  seconds: number
}

export function durationPartsToMs(parts: DurationParts): number | null {
  const { hours, minutes, seconds } = parts
  const values = [hours, minutes, seconds]

  if (values.some((value) => !Number.isInteger(value))) {
    return null
  }

  if (
    hours < 0 ||
    hours > MAX_TIMER_HOURS ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    return null
  }

  const durationMs = hours * HOUR_MS + minutes * MINUTE_MS + seconds * SECOND_MS

  return durationMs > 0 ? durationMs : null
}
