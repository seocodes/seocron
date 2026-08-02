# Theme context

## Compact token summary

- Stack: Vite 8, React 19, TypeScript 7, Tailwind CSS 4 through `@import 'tailwindcss'`.
- CSS approach: Tailwind utilities plus global CSS custom properties.
- UI font: current selected local monospace face.
- Digital fonts: JetBrains Mono Variable, Space Mono, VT323, DSEG7 Classic; all self-hosted.
- Base/Nord: background `#20242c`, surface `#2b303b`, elevated `#3b4350`, primary text `#f2f4f8`, secondary `#d5dbe5`, accent `#88c0d0`, border `#8793a6`, focus `#ebcb8b`.
- Existing palettes: Nord, Dracula, Solarized Light, Solarized Dark, Ocean Blue, Signal Red, Midnight.
- Current geometry: pill buttons/toggle; `0.75rem` inputs; `1.5rem` content panels.
- Current spacing: page padding `1.25rem` mobile / `2rem` desktop; central content max width `64rem`; subpanels max width `42rem`.
- Motion: color transitions only; global reduced-motion override.
- Breakpoint used directly: Tailwind `sm` (`640px`).

## Raw sources

The canonical raw sources are:

- `src/index.css` for imports, CSS variables, font selection, theme selectors, reset, and reduced-motion behavior.
- `src/features/appearance/themes.ts` for typed palette definitions.
- `src/features/appearance/AppearanceProvider.tsx` for in-memory theme/font application through root data attributes.

All three files are under the context budget and must be passed in full to design work.
