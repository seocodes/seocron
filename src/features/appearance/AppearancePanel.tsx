import { fonts, themes, type FontId, type ThemeId } from './themes'
import { useAppearance } from './useAppearance'

const selectClasses = 'appearance-select'

export function AppearancePanel() {
  const { themeId, fontId, setThemeId, setFontId } = useAppearance()

  return (
    <section aria-label="Aparência" className="appearance-strip">
      <div className="appearance-strip__controls">
        <label className="appearance-field">
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

        <label className="appearance-field">
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
      </div>
      <p aria-hidden="true" className="calibration-mark">
        CALIB. SC-01
      </p>
    </section>
  )
}
