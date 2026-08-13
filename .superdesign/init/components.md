# Shared UI components

This inventory points to the implementation instead of duplicating complete source snippets that can become stale.

## `src/components/ControlButton.tsx`

Reusable primary/secondary action key. It forwards native button attributes and preserves disabled and accessible-name semantics.

## `src/components/ModeToggle.tsx`

Two-position Timer/Cronômetro switch. The selected mode is exposed through `aria-pressed`; `App` owns the active mode and pauses a running mode before switching.

## `src/components/TimeDisplay.tsx`

Accessible digital output. Required props are `label`, `value`, and `scale`; `compact` selects the Cronômetro proportions. It emits `data-scale` so CSS changes the real font size and layout space without page zoom or transforms.

## `src/components/DisplayControls.tsx`

Shared visual toolbar with decrease, scale indicator, increase, focus, and fullscreen actions. Its `DisplayControlsProps` contract lets Timer and Cronômetro use the same state owned by `App`. Scale boundaries disable the relevant key, while focus and fullscreen expose pressed state.

## Feature panels

- `src/features/timer/TimerPanel.tsx`: display, visualization toolbar, essential actions, presets, and manual duration form.
- `src/features/stopwatch/StopwatchPanel.tsx`: display, visualization toolbar, actions, and lap register.

Both panels receive `display: DisplayControlsProps`. In focus mode they keep the running controls but omit secondary configuration or history from the rendered DOM.

## Appearance

`src/features/appearance/AppearancePanel.tsx` uses native selects. Theme and font are supplied by the in-memory appearance context. The available local display fonts are JetBrains Mono, Space Mono, IBM Plex Mono, Orbitron, VT323, and DSEG7.
