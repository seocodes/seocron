import { useState } from 'react'

import { ModeToggle, type Mode } from './components/ModeToggle'
import { AppearancePanel } from './features/appearance/AppearancePanel'
import { StopwatchPanel } from './features/stopwatch/StopwatchPanel'
import { useStopwatch } from './features/stopwatch/useStopwatch'
import { TimerPanel } from './features/timer/TimerPanel'
import { useTimer } from './features/timer/useTimer'
import { MINUTE_MS } from './lib/time/time.constants'

function App() {
  const [activeMode, setActiveMode] = useState<Mode>('timer')
  const [liveMessage, setLiveMessage] = useState('')
  const timer = useTimer(5 * MINUTE_MS)
  const stopwatch = useStopwatch()

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
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-8">
      <header className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold tracking-[0.24em] text-[var(--text-secondary)] uppercase">
          seocron
        </p>
        <ModeToggle activeMode={activeMode} onChange={changeMode} />
      </header>

      <div className="flex flex-1 items-center justify-center py-12 sm:py-16">
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
    </main>
  )
}

export default App
