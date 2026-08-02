# seocron — bench instrument design system

## Product

seocron is a static, client-only Timer and Stopwatch. Timer is the default mode. Stopwatch supports laps. The page must remain fast, calm, mobile-friendly, keyboard accessible, and entirely free of tracking, persistence, backend calls, and runtime third-party assets.

## Visual thesis

Present seocron as a compact technical bench instrument rather than a dashboard or collection of cards. The interface is one continuous chassis with a top nameplate, recessed time display, tactile operation deck, and integrated lower configuration/log bay.

## Structure

- Desktop chassis width: approximately 760–860px, centered vertically where space permits.
- Mobile chassis: nearly full viewport width with the same physical hierarchy stacked vertically.
- Top plate: `seocron` nameplate, concise instrument metadata, and a mechanical two-position mode switch.
- Display well: dark/recessed smoked-glass surface; the time is the dominant element; status and units remain legible.
- Control deck: rectangular physical keys with primary, secondary, and disabled states.
- Lower bay: Timer presets/manual inputs or Stopwatch lap register.
- Appearance controls: compact integrated utility strip, not a floating footer card.

## Geometry

- Chassis radius: 8px desktop, 6px mobile.
- Display and inset bays: 4px.
- Keys, inputs, and selects: 4–6px.
- Avoid pills except where a physical rocker/segmented control genuinely benefits from the shape.
- Use precise 1px borders plus inner highlights to suggest fitted panels.

## Material and depth

- Matte painted metal/polymer shell.
- Subtle outer drop shadow, thin upper edge highlight, and inset display shadow.
- Three depth levels only: page, chassis, inset/elevated control.
- No photorealism, excessive gradients, fake screws, or ornamental skeuomorphism.
- A small status LED may reinforce running/paused/completed state but never replace text; it is decorative to assistive technology.

## Typography

- UI labels and controls: JetBrains Mono Variable by default; Space Mono is the alternate.
- Display only: selected font may be JetBrains Mono, Space Mono, VT323, or DSEG7.
- Do not apply DSEG7 to small UI labels.
- Uppercase technical labels use moderate tracking (`0.12em`–`0.18em`) and remain at least 12px.
- Numeric content uses tabular numbers.

## Color

Reuse the existing semantic custom properties: `--background`, `--surface`, `--surface-elevated`, `--text-primary`, `--text-secondary`, `--accent`, `--accent-hover`, `--accent-soft`, `--on-accent`, `--border`, `--focus-ring`, and `--danger`.

Add instrument-specific semantic tokens derived per theme: chassis, chassis-edge, display-background, display-glow, key-shadow, status-running, status-paused. Every theme must preserve WCAG AA contrast; the primary digits require at least 4.5:1.

Retain all existing themes and add three curated variants:

- Lab 1986: warm beige chassis, olive-black display, amber signal.
- Pit Lane: graphite chassis, red signal, warm off-white text.
- Marine Instrument: deep navy chassis, restrained brass accent, ivory text.

No free color picker.

## Components

- Mode switch: two broad rectangular/low-radius segments, clearly selected with `aria-pressed` intact.
- Time display: recessed full-width instrument window with responsive digits that never clip at 320px.
- Action keys: 48px minimum height, slight bottom edge/shadow, pressed translation no greater than 1px.
- Presets: bank of equal tactile keys; selected state visible beyond color through inset edge or marker.
- Manual inputs: counter-like wells with visible labels; preserve numeric input semantics.
- Lap register: technical table with explicit `Volta`, `Parcial`, and `Total` headings visible; scrolling region remains keyboard accessible.
- Appearance strip: two labeled native selects integrated into chassis footer.

## Motion and interaction

- 100–160ms transitions for color, shadow, and 1px press feedback.
- No animated digit rolling or persistent glow pulsing.
- Honor `prefers-reduced-motion`.
- Keep Space start/pause and R reset behavior unchanged.
- Preserve visible focus rings, accessible names, disabled semantics, live announcements, Wake Lock behavior, and real-timestamp timing logic.

## Responsive behavior

- At 640px and above, controls and configuration groups can align horizontally.
- Below 640px, retain a single coherent chassis, stack instrument bays, and allow full-width primary controls.
- Maintain 44px minimum interactive targets and safe-area padding.

## Guardrails

- Visual-only redesign: no new product flow, backend, analytics, storage, network asset, or persistence.
- Do not change timer/stopwatch engines.
- Use only self-hosted fonts and CSS/HTML-native effects.
- Use ONLY the fonts, colors, spacing, and component styles defined here and in `src/index.css`.
