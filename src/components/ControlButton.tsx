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
    intent === 'primary' ? 'control-key--primary' : 'control-key--secondary'

  return (
    <button
      className={`control-key ${intentClasses} ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
