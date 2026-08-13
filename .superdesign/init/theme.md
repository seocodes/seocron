# Theme context

## Compact token summary

- Stack: Vite 8, React 19, TypeScript 7, Tailwind CSS 4 through `@import 'tailwindcss'`.
- CSS approach: Tailwind utilities plus global CSS custom properties and component classes.
- UI font: JetBrains Mono Variable by default; IBM Plex Mono can also serve interface text.
- Display fonts: JetBrains Mono, Space Mono, IBM Plex Mono, Orbitron, VT323, and DSEG7 Classic; all self-hosted.
- Base/Nord: background `#20242c`, surface `#2b303b`, elevated `#3b4350`, primary text `#f2f4f8`, secondary `#d5dbe5`, accent `#88c0d0`, border `#8793a6`, focus `#ebcb8b`.
- Palettes: Nord, Dracula, Solarized Light, Solarized Dark, Ocean Blue, Signal Red, Midnight, Lab 1986, Pit Lane, and Marine Instrument.
- Geometry: one low-radius instrument chassis, recessed display, rectangular tactile keys, native selects, and precise 1px borders.
- Display scale: discrete `80`, `100`, `120`, and `140` data states; mobile rules prevent clipping at 320px.
- Motion: short color/shadow/1px press transitions with a global reduced-motion override.
- Primary responsive breakpoints: `400px` for minimum display sizing and `640px` for stacked instrument bays.

## Raw sources

The canonical raw sources are:

- `src/index.css` for imports, tokens, font selection, theme selectors, components, focus mode, responsive behavior, and reduced motion.
- `src/features/appearance/themes.ts` for typed theme and font definitions.
- `src/features/appearance/AppearanceProvider.tsx` for in-memory theme/font application through root data attributes.
- `src/features/display/display-scale.ts` for the allowed display scale states.

Pass these files in full when visual work depends on the current design system.
