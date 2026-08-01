import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { useDocumentTitle } from './useDocumentTitle'

const ORIGINAL_TITLE = 'seocron'

describe('useDocumentTitle', () => {
  afterEach(() => {
    document.title = ORIGINAL_TITLE
  })

  it('updates the title and restores the previous value on unmount', () => {
    document.title = ORIGINAL_TITLE
    const { rerender, unmount } = renderHook(
      ({ title }) => useDocumentTitle(title),
      { initialProps: { title: '05:00 · Timer — seocron' } },
    )

    expect(document.title).toBe('05:00 · Timer — seocron')

    rerender({ title: '04:59 · Timer — seocron' })
    expect(document.title).toBe('04:59 · Timer — seocron')

    unmount()
    expect(document.title).toBe(ORIGINAL_TITLE)
  })
})
