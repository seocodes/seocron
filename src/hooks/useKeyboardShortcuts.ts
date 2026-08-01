import { useEffect, useRef } from 'react'

interface KeyboardShortcutActions {
  onToggle: () => void
  onReset: () => void
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest(
      'input, textarea, select, button, a[href], [contenteditable="true"]',
    ) !== null
  )
}

export function useKeyboardShortcuts(actions: KeyboardShortcutActions) {
  const actionsRef = useRef(actions)
  actionsRef.current = actions

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isInteractiveTarget(event.target)
      ) {
        return
      }

      if (event.code === 'Space') {
        event.preventDefault()
        actionsRef.current.onToggle()
        return
      }

      if (event.key.toLowerCase() === 'r') {
        actionsRef.current.onReset()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
