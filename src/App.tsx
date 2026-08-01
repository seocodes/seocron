import { useState } from 'react'

type Mode = 'timer' | 'stopwatch'

const modes: Array<{ id: Mode; label: string }> = [
  { id: 'timer', label: 'Timer' },
  { id: 'stopwatch', label: 'Cronômetro' },
]

function App() {
  const [activeMode, setActiveMode] = useState<Mode>('timer')

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col px-5 py-6 sm:px-8 sm:py-8">
      <header className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold tracking-[0.24em] text-[var(--text-secondary)] uppercase">
          seocron
        </p>

        <div
          aria-label="Modo de contagem"
          className="flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1"
          role="group"
        >
          {modes.map((mode) => {
            const isActive = activeMode === mode.id

            return (
              <button
                aria-pressed={isActive}
                className="min-h-11 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] aria-pressed:bg-[var(--accent)] aria-pressed:text-[var(--on-accent)]"
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                type="button"
              >
                {mode.label}
              </button>
            )
          })}
        </div>
      </header>

      <section
        aria-labelledby="active-mode-title"
        className="flex flex-1 flex-col items-center justify-center py-16 text-center"
      >
        <p className="mb-4 text-sm text-[var(--text-secondary)]">
          {activeMode === 'timer' ? 'Pronto para começar' : 'Tempo decorrido'}
        </p>
        <h1 className="sr-only" id="active-mode-title">
          {activeMode === 'timer' ? 'Timer' : 'Cronômetro'}
        </h1>
        <output
          aria-label={`${activeMode === 'timer' ? 'Timer' : 'Cronômetro'}: ${activeMode === 'timer' ? '5 minutos' : 'zero'}`}
          className="font-digital text-[clamp(4.75rem,19vw,11rem)] leading-none font-semibold tracking-[-0.08em] text-[var(--text-primary)] tabular-nums"
        >
          {activeMode === 'timer' ? '05:00' : '00:00'}
        </output>
        <p className="mt-8 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
          A fundação está pronta. Os controles e a contagem baseada em
          timestamps entram no próximo incremento.
        </p>
      </section>
    </main>
  )
}

export default App
