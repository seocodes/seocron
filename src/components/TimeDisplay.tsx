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
      className={`time-display ${compact ? 'time-display--compact' : ''}`}
    >
      {value}
    </output>
  )
}
