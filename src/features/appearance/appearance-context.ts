import { createContext } from 'react'

import type { FontId, ThemeId } from './themes'

export interface AppearanceContextValue {
  themeId: ThemeId
  fontId: FontId
  setThemeId: (themeId: ThemeId) => void
  setFontId: (fontId: FontId) => void
}

export const AppearanceContext = createContext<AppearanceContextValue | null>(
  null,
)
