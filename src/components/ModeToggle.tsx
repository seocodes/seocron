export type Mode = 'timer' | 'stopwatch'

interface ModeToggleProps {
  activeMode: Mode
  onChange: (mode: Mode) => void
}

const modes: Array<{ id: Mode; label: string }> = [
  { id: 'timer', label: 'Timer' },
  { id: 'stopwatch', label: 'Cronômetro' },
]

export function ModeToggle({ activeMode, onChange }: ModeToggleProps) {
  return (
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
            onClick={() => onChange(mode.id)}
            type="button"
          >
            {mode.label}
          </button>
        )
      })}
    </div>
  )
}
