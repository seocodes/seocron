import { useEffect, useReducer } from 'react'

const DEFAULT_REFRESH_INTERVAL_MS = 50

export function useNow(
  active: boolean,
  refreshIntervalMs = DEFAULT_REFRESH_INTERVAL_MS,
): number {
  const [, requestRender] = useReducer((revision: number) => revision + 1, 0)

  useEffect(() => {
    if (!active) {
      return
    }

    const refresh = () => requestRender()
    const intervalId = window.setInterval(refresh, refreshIntervalMs)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [active, refreshIntervalMs])

  return Date.now()
}
