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
