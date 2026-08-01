import { describe, expect, it } from 'vitest'

import { durationPartsToMs } from './duration'

describe('durationPartsToMs', () => {
  it('converts a valid duration to milliseconds', () => {
    expect(durationPartsToMs({ hours: 1, minutes: 2, seconds: 3 })).toBe(
      3_723_000,
    )
  })

  it.each([
    { hours: 0, minutes: 0, seconds: 0 },
    { hours: -1, minutes: 0, seconds: 0 },
    { hours: 100, minutes: 0, seconds: 0 },
    { hours: 0, minutes: 60, seconds: 0 },
    { hours: 0, minutes: 0, seconds: 60 },
    { hours: 0.5, minutes: 0, seconds: 0 },
  ])('rejects invalid parts: $hours:$minutes:$seconds', (parts) => {
    expect(durationPartsToMs(parts)).toBeNull()
  })
})
