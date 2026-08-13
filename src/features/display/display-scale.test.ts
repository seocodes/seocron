import { describe, expect, it } from 'vitest'

import { nextDisplayScale, previousDisplayScale } from './display-scale'

describe('display scale', () => {
  it('moves between the available scale steps', () => {
    expect(nextDisplayScale(80)).toBe(100)
    expect(nextDisplayScale(100)).toBe(120)
    expect(previousDisplayScale(140)).toBe(120)
    expect(previousDisplayScale(120)).toBe(100)
  })

  it('stays inside the minimum and maximum', () => {
    expect(previousDisplayScale(80)).toBe(80)
    expect(nextDisplayScale(140)).toBe(140)
  })
})
