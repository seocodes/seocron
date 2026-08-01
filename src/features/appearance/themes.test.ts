import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { contrastRatio } from './contrast'
import { themes } from './themes'

describe('theme contrast', () => {
  it.each(themes)('$label meets the contrast contract', ({ tokens }) => {
    expect(
      contrastRatio(tokens.textPrimary, tokens.background),
    ).toBeGreaterThanOrEqual(4.5)
    expect(
      contrastRatio(tokens.textSecondary, tokens.background),
    ).toBeGreaterThanOrEqual(4.5)
    expect(
      contrastRatio(tokens.textPrimary, tokens.surface),
    ).toBeGreaterThanOrEqual(4.5)
    expect(
      contrastRatio(tokens.textSecondary, tokens.surface),
    ).toBeGreaterThanOrEqual(4.5)
    expect(
      contrastRatio(tokens.onAccent, tokens.accent),
    ).toBeGreaterThanOrEqual(4.5)
    expect(
      contrastRatio(tokens.textPrimary, tokens.accentSoft),
    ).toBeGreaterThanOrEqual(4.5)
    expect(
      contrastRatio(tokens.border, tokens.background),
    ).toBeGreaterThanOrEqual(3)
    expect(contrastRatio(tokens.border, tokens.surface)).toBeGreaterThanOrEqual(
      3,
    )
    expect(
      contrastRatio(tokens.focusRing, tokens.background),
    ).toBeGreaterThanOrEqual(3)
    expect(
      contrastRatio(tokens.danger, tokens.background),
    ).toBeGreaterThanOrEqual(4.5)
  })
})

describe('theme CSS', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8')
  const tokenNames: Record<keyof (typeof themes)[number]['tokens'], string> = {
    background: 'background',
    surface: 'surface',
    surfaceElevated: 'surface-elevated',
    textPrimary: 'text-primary',
    textSecondary: 'text-secondary',
    accent: 'accent',
    accentHover: 'accent-hover',
    accentSoft: 'accent-soft',
    onAccent: 'on-accent',
    border: 'border',
    focusRing: 'focus-ring',
    danger: 'danger',
  }

  it.each(themes)('$label tokens match the shipped CSS', ({ id, tokens }) => {
    const selector = id === 'nord' ? ':root' : `:root[data-theme='${id}']`
    const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const block = new RegExp(`${escapedSelector}\\s*{([^}]*)}`).exec(css)?.[1]

    expect(block, `Missing CSS block for ${id}`).toBeDefined()

    for (const [token, value] of Object.entries(tokens)) {
      const cssName = tokenNames[token as keyof typeof tokenNames]
      expect(block).toContain(`--${cssName}: ${value};`)
    }
  })
})
