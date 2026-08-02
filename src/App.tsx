import { useCallback, useEffect, useRef, useState } from 'react'

import { ModeToggle, type Mode } from './components/ModeToggle'
import { AppearancePanel } from './features/appearance/AppearancePanel'
import { StopwatchPanel } from './features/stopwatch/StopwatchPanel'
import { useStopwatch } from './features/stopwatch/useStopwatch'
import { TimerPanel } from './features/timer/TimerPanel'
import { useTimer } from './features/timer/useTimer'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useWakeLock } from './hooks/useWakeLock'
import { formatTimerDuration } from './lib/time/formatDuration'
import { MINUTE_MS } from './lib/time/time.constants'

function App() {
  const [activeMode, setActiveMode] = useState<Mode>('timer')
  const [liveMessage, setLiveMessage] = useState('')
  const timer = useTimer(5 * MINUTE_MS)
  const stopwatch = useStopwatch()
  const previousTimerStatus = useRef(timer.status)
  const activeRunning =
    activeMode === 'timer'
      ? timer.status === 'running'
      : stopwatch.status === 'running'
  const titleTime =
    activeMode === 'timer'
      ? formatTimerDuration(timer.remainingMs)
      : formatTimerDuration(Math.floor(stopwatch.elapsedMs / 1_000) * 1_000)
  const titleMode = activeMode === 'timer' ? 'Timer' : 'Cronômetro'

  useDocumentTitle(`${titleTime} · ${titleMode} — seocron`)
  useWakeLock(activeRunning)

  useEffect(() => {
    if (
      previousTimerStatus.current !== 'completed' &&
      timer.status === 'completed'
    ) {
      setLiveMessage('Timer concluído')
    }

    previousTimerStatus.current = timer.status
  }, [timer.status])

  const toggleActiveMode = useCallback(() => {
    if (activeMode === 'timer') {
      if (timer.status === 'running') {
        timer.pause()
        setLiveMessage('Timer pausado')
      } else {
        timer.start()
        setLiveMessage(
          timer.status === 'paused' ? 'Timer retomado' : 'Timer iniciado',
        )
      }
      return
    }

    if (stopwatch.status === 'running') {
      stopwatch.pause()
      setLiveMessage('Cronômetro pausado')
    } else {
      stopwatch.start()
      setLiveMessage(
        stopwatch.status === 'paused'
          ? 'Cronômetro retomado'
          : 'Cronômetro iniciado',
      )
    }
  }, [activeMode, stopwatch, timer])

  const resetActiveMode = useCallback(() => {
    if (activeMode === 'timer') {
      timer.reset()
      setLiveMessage('Timer resetado')
    } else {
      stopwatch.reset()
      setLiveMessage('Cronômetro resetado')
    }
  }, [activeMode, stopwatch, timer])

  useKeyboardShortcuts({
    onToggle: toggleActiveMode,
    onReset: resetActiveMode,
  })

  const changeMode = (nextMode: Mode) => {
    if (nextMode === activeMode) {
      return
    }

    if (activeMode === 'timer' && timer.status === 'running') {
      timer.pause()
    }

    if (activeMode === 'stopwatch' && stopwatch.status === 'running') {
      stopwatch.pause()
    }

    setActiveMode(nextMode)
    setLiveMessage(
      nextMode === 'timer'
        ? 'Modo Timer selecionado'
        : 'Modo Cronômetro selecionado',
    )
  }

  return (
    <main className="app-shell">
      <div className="instrument-chassis">
        <header className="instrument-nameplate">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className={`status-led ${activeRunning ? 'status-led--active' : ''}`}
            />
            <div className="min-w-0">
              <p className="instrument-brand">seocron</p>
              <p className="instrument-model">precision timing instrument</p>
            </div>
          </div>
          <ModeToggle activeMode={activeMode} onChange={changeMode} />
        </header>

        <div className="instrument-stage">
          {activeMode === 'timer' ? (
            <TimerPanel announce={setLiveMessage} timer={timer} />
          ) : (
            <StopwatchPanel announce={setLiveMessage} stopwatch={stopwatch} />
          )}
        </div>

        <p aria-atomic="true" aria-live="polite" className="sr-only">
          {liveMessage}
        </p>

        <AppearancePanel />
      </div>
    </main>
  )
}

export default App
