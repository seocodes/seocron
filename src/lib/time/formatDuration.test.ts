import { describe, expect, it } from 'vitest'

import {
  formatStopwatchDuration,
  formatTimerDuration,
  splitDurationMs,
} from './formatDuration'

describe('formatTimerDuration', () => {
  it('rounds a partial remaining second up', () => {
    expect(formatTimerDuration(1)).toBe('00:01')
    expect(formatTimerDuration(60_001)).toBe('01:01')
  })

  it('includes hours only when needed', () => {
    expect(formatTimerDuration(3_600_000)).toBe('01:00:00')
  })

  it('never renders a negative duration', () => {
    expect(formatTimerDuration(-1)).toBe('00:00')
  })
})

describe('formatStopwatchDuration', () => {
  it('uses elapsed centiseconds without rounding up', () => {
    expect(formatStopwatchDuration(12_349)).toBe('00:12.34')
  })

  it('includes hours only when needed', () => {
    expect(formatStopwatchDuration(3_661_230)).toBe('01:01:01.23')
  })
})

describe('splitDurationMs', () => {
  it('splits a duration into bounded display parts', () => {
    expect(splitDurationMs(3_723_999)).toEqual({
      hours: 1,
      minutes: 2,
      seconds: 3,
    })
  })
})
