import { useCallback, useEffect, useState } from 'react'

export type FullscreenResult = 'entered' | 'exited' | 'unsupported' | 'error'

export interface FullscreenController {
  isFullscreen: boolean
  isSupported: boolean
  toggle: () => Promise<FullscreenResult>
}

function fullscreenIsSupported() {
  return (
    document.fullscreenEnabled &&
    typeof document.documentElement.requestFullscreen === 'function' &&
    typeof document.exitFullscreen === 'function'
  )
}

export function useFullscreen(): FullscreenController {
  const [isFullscreen, setIsFullscreen] = useState(
    () => document.fullscreenElement !== null,
  )
  const isSupported = fullscreenIsSupported()

  useEffect(() => {
    const updateFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement !== null)
    }

    document.addEventListener('fullscreenchange', updateFullscreenState)
    return () => {
      document.removeEventListener('fullscreenchange', updateFullscreenState)
    }
  }, [])

  const toggle = useCallback(async (): Promise<FullscreenResult> => {
    if (!fullscreenIsSupported()) {
      return 'unsupported'
    }

    try {
      if (document.fullscreenElement !== null) {
        await document.exitFullscreen()
        return 'exited'
      }

      await document.documentElement.requestFullscreen()
      return 'entered'
    } catch {
      return 'error'
    }
  }, [])

  return { isFullscreen, isSupported, toggle }
}
