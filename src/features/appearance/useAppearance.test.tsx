import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useAppearance } from './useAppearance'

describe('useAppearance', () => {
  it('rejects use outside AppearanceProvider', () => {
    expect(() => renderHook(() => useAppearance())).toThrow(
      'useAppearance must be used within AppearanceProvider',
    )
  })
})
