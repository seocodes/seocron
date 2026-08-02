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
    <div aria-label="Modo de contagem" className="mode-switch" role="group">
      {modes.map((mode) => {
        const isActive = activeMode === mode.id

        return (
          <button
            aria-pressed={isActive}
            className="mode-switch__button"
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
