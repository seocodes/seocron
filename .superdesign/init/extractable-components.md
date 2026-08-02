# Extractable components

The app has no shared cross-page navigation or layout component worth extracting as a Superdesign DraftComponent. It is a single-route utility and its three primitives are small enough to keep inline as design context.

## ControlButton

- Source: `src/components/ControlButton.tsx`
- Category: basic
- Description: Primary/secondary tactile action control.
- Extractable props: `intent`, `disabled`
- Hardcoded: button geometry, typography, focus behavior

## ModeToggle

- Source: `src/components/ModeToggle.tsx`
- Category: basic
- Description: Timer/Stopwatch segmented control.
- Extractable props: `activeMode`
- Hardcoded: mode labels, focus behavior

## TimeDisplay

- Source: `src/components/TimeDisplay.tsx`
- Category: basic
- Description: Responsive digital numeric output.
- Extractable props: `label`, `value`, `compact`
- Hardcoded: tabular digit typography and scale
