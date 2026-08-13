import { useCallback, useEffect, useRef, useState } from 'react'

import { ModeToggle, type Mode } from './components/ModeToggle'
import type { DisplayControlsProps } from './components/DisplayControls'
import { AppearancePanel } from './features/appearance/AppearancePanel'
import {
  nextDisplayScale,
  previousDisplayScale,
  type DisplayScale,
} from './features/display/display-scale'
import { StopwatchPanel } from './features/stopwatch/StopwatchPanel'
import { useStopwatch } from './features/stopwatch/useStopwatch'
import { TimerPanel } from './features/timer/TimerPanel'
import { useTimer } from './features/timer/useTimer'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import { useFullscreen } from './hooks/useFullscreen'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useWakeLock } from './hooks/useWakeLock'
import { formatTimerDuration } from './lib/time/formatDuration'
import { MINUTE_MS } from './lib/time/time.constants'

function App() {
  const [activeMode, setActiveMode] = useState<Mode>('timer')
  const [displayScale, setDisplayScale] = useState<DisplayScale>(100)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [liveMessage, setLiveMessage] = useState('')
  const timer = useTimer(5 * MINUTE_MS)
  const stopwatch = useStopwatch()
  const previousTimerStatus = useRef(timer.status)
  const fullscreen = useFullscreen()
  const previousFullscreen = useRef(fullscreen.isFullscreen)
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

  useEffect(() => {
    if (previousFullscreen.current === fullscreen.isFullscreen) {
      return
    }

    setLiveMessage(
      fullscreen.isFullscreen ? 'Tela cheia ativada' : 'Tela cheia encerrada',
    )
    previousFullscreen.current = fullscreen.isFullscreen
  }, [fullscreen.isFullscreen])

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

  const decreaseDisplay = () => {
    const nextScale = previousDisplayScale(displayScale)
    setDisplayScale(nextScale)
    setLiveMessage(`Mostrador em ${nextScale}%`)
  }

  const increaseDisplay = () => {
    const nextScale = nextDisplayScale(displayScale)
    setDisplayScale(nextScale)
    setLiveMessage(`Mostrador em ${nextScale}%`)
  }

  const toggleFocusMode = () => {
    const nextFocusMode = !isFocusMode
    setIsFocusMode(nextFocusMode)
    setLiveMessage(nextFocusMode ? 'Modo foco ativado' : 'Modo foco encerrado')
  }

  const toggleFullscreen = async () => {
    const result = await fullscreen.toggle()

    if (result === 'unsupported') {
      setLiveMessage('Tela cheia indisponível neste navegador')
    } else if (result === 'error') {
      setLiveMessage('Não foi possível alterar a tela cheia')
    }
  }

  const displayControls: DisplayControlsProps = {
    scale: displayScale,
    isFocusMode,
    isFullscreen: fullscreen.isFullscreen,
    isFullscreenSupported: fullscreen.isSupported,
    onDecrease: decreaseDisplay,
    onIncrease: increaseDisplay,
    onToggleFocus: toggleFocusMode,
    onToggleFullscreen: toggleFullscreen,
  }

  return (
    <main className={`app-shell ${isFocusMode ? 'app-shell--focus' : ''}`}>
      <div
        className={`instrument-chassis ${isFocusMode ? 'instrument-chassis--focus' : ''}`}
      >
        {!isFocusMode && (
          <header className="instrument-nameplate">
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden="true"
                className={`status-led ${activeRunning ? 'status-led--active' : ''}`}
              />
              <div className="min-w-0">
                <p className="instrument-brand">seocron</p>
              </div>
            </div>
            <ModeToggle activeMode={activeMode} onChange={changeMode} />
          </header>
        )}

        <div className="instrument-stage">
          {activeMode === 'timer' ? (
            <TimerPanel
              announce={setLiveMessage}
              display={displayControls}
              timer={timer}
            />
          ) : (
            <StopwatchPanel
              announce={setLiveMessage}
              display={displayControls}
              stopwatch={stopwatch}
            />
          )}
        </div>

        <p aria-atomic="true" aria-live="polite" className="sr-only">
          {liveMessage}
        </p>

        {!isFocusMode && <AppearancePanel />}
      </div>
    </main>
  )
}

export default App
