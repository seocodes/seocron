export const displayScales = [80, 100, 120, 140] as const

export type DisplayScale = (typeof displayScales)[number]

export function previousDisplayScale(scale: DisplayScale): DisplayScale {
  const index = displayScales.indexOf(scale)
  return displayScales[Math.max(0, index - 1)]
}

export function nextDisplayScale(scale: DisplayScale): DisplayScale {
  const index = displayScales.indexOf(scale)
  return displayScales[Math.min(displayScales.length - 1, index + 1)]
}
