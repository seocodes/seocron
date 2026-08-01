import { fonts, themes, type FontId, type ThemeId } from './themes'
import { useAppearance } from './useAppearance'

const selectClasses =
  'min-h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]'

export function AppearancePanel() {
  const { themeId, fontId, setThemeId, setFontId } = useAppearance()

  return (
    <section
      aria-label="Aparência"
      className="flex flex-wrap items-end justify-center gap-3 border-t border-[var(--border)] pt-5 sm:justify-end"
    >
      <label className="flex flex-col gap-1.5 text-xs text-[var(--text-secondary)]">
        Tema
        <select
          className={selectClasses}
          onChange={(event) => setThemeId(event.target.value as ThemeId)}
          value={themeId}
        >
          {themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-xs text-[var(--text-secondary)]">
        Fonte
        <select
          className={selectClasses}
          onChange={(event) => setFontId(event.target.value as FontId)}
          value={fontId}
        >
          {fonts.map((font) => (
            <option key={font.id} value={font.id}>
              {font.label}
            </option>
          ))}
        </select>
      </label>
    </section>
  )
}
