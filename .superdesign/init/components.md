# Shared UI components

## `src/components/ControlButton.tsx`

Reusable primary/secondary action button.

```tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ControlButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  intent?: 'primary' | 'secondary'
}

export function ControlButton({
  children,
  className = '',
  intent = 'secondary',
  ...props
}: ControlButtonProps) {
  const intentClasses =
    intent === 'primary'
      ? 'border-transparent bg-[var(--accent)] text-[var(--on-accent)] hover:bg-[var(--accent-hover)]'
      : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'

  return (
    <button
      className={`min-h-12 rounded-full border px-6 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-45 ${intentClasses} ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
```

## `src/components/ModeToggle.tsx`

Two-option accessible mode switch.

```tsx
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
            className="min-h-11 rounded-full px-4 text-sm font-semibold text-[var(--text-primary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] aria-pressed:bg-[var(--accent)] aria-pressed:text-[var(--on-accent)]"
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
```

## `src/components/TimeDisplay.tsx`

Responsive accessible digital time output.

```tsx
interface TimeDisplayProps {
  label: string
  value: string
  compact?: boolean
}

export function TimeDisplay({
  label,
  value,
  compact = false,
}: TimeDisplayProps) {
  return (
    <output
      aria-label={`${label}: ${value}`}
      className={`font-digital leading-none font-semibold tracking-[-0.08em] text-[var(--text-primary)] tabular-nums ${
        compact
          ? 'text-[clamp(3.5rem,15vw,8.5rem)]'
          : 'text-[clamp(4.75rem,19vw,11rem)]'
      }`}
    >
      {value}
    </output>
  )
}
```
