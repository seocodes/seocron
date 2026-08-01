export const SECOND_MS = 1_000
export const MINUTE_MS = 60 * SECOND_MS
export const HOUR_MS = 60 * MINUTE_MS
export const MAX_TIMER_HOURS = 99
export const MAX_TIMER_DURATION_MS =
  MAX_TIMER_HOURS * HOUR_MS + 59 * MINUTE_MS + 59 * SECOND_MS
