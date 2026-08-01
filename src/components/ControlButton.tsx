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
