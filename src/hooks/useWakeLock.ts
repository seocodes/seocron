import { useEffect, useRef } from 'react'

export function useWakeLock(active: boolean) {
  const sentinelRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    const wakeLock = 'wakeLock' in navigator ? navigator.wakeLock : undefined

    if (!active || wakeLock === undefined) {
      return
    }

    let cancelled = false
    let requestPending = false

    const releaseCurrentLock = async () => {
      const sentinel = sentinelRef.current
      sentinelRef.current = null

      if (sentinel !== null) {
        await sentinel.release().catch(() => undefined)
      }
    }

    const requestLock = async () => {
      if (
        cancelled ||
        requestPending ||
        document.visibilityState !== 'visible' ||
        sentinelRef.current !== null
      ) {
        return
      }

      requestPending = true

      try {
        const sentinel = await wakeLock.request('screen')

        if (cancelled) {
          await sentinel.release().catch(() => undefined)
          return
        }

        sentinelRef.current = sentinel
        sentinel.addEventListener(
          'release',
          () => {
            if (sentinelRef.current === sentinel) {
              sentinelRef.current = null
            }
          },
          { once: true },
        )
      } catch {
        // Wake Lock is an enhancement; timing remains correct without it.
      } finally {
        requestPending = false
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void requestLock()
      }
    }

    void requestLock()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      void releaseCurrentLock()
    }
  }, [active])
}
