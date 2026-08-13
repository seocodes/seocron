import type { DisplayScale } from '../features/display/display-scale'

interface TimeDisplayProps {
  label: string
  value: string
  scale: DisplayScale
  compact?: boolean
}

export function TimeDisplay({
  label,
  value,
  scale,
  compact = false,
}: TimeDisplayProps) {
  return (
    <output
      aria-label={`${label}: ${value}`}
      className={`time-display ${compact ? 'time-display--compact' : ''}`}
      data-scale={scale}
    >
      {value}
    </output>
  )
}
