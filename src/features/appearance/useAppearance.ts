import { useContext } from 'react'

import {
  AppearanceContext,
  type AppearanceContextValue,
} from './appearance-context'

export function useAppearance(): AppearanceContextValue {
  const context = useContext(AppearanceContext)

  if (context === null) {
    throw new Error('useAppearance must be used within AppearanceProvider')
  }

  return context
}
