import { useEffect, useMemo, useState, type ReactNode } from 'react'

import { AppearanceContext } from './appearance-context'
import type { FontId, ThemeId } from './themes'

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('nord')
  const [fontId, setFontId] = useState<FontId>('jetbrains')

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = themeId
    root.dataset.font = fontId

    return () => {
      delete root.dataset.theme
      delete root.dataset.font
    }
  }, [fontId, themeId])

  const value = useMemo(
    () => ({ themeId, fontId, setThemeId, setFontId }),
    [fontId, themeId],
  )

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  )
}
