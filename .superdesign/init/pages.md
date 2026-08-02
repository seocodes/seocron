# Page dependency tree

## `/` — seocron

Entry: `src/main.tsx`

Dependencies:

- `src/main.tsx`
  - `src/index.css`
  - `src/App.tsx`
    - `src/components/ModeToggle.tsx`
    - `src/features/appearance/AppearancePanel.tsx`
      - `src/features/appearance/themes.ts`
      - `src/features/appearance/useAppearance.ts`
        - `src/features/appearance/appearance-context.ts`
    - `src/features/stopwatch/StopwatchPanel.tsx`
      - `src/components/ControlButton.tsx`
      - `src/components/TimeDisplay.tsx`
      - `src/lib/time/formatDuration.ts`
      - `src/features/stopwatch/useStopwatch.ts`
    - `src/features/timer/TimerPanel.tsx`
      - `src/components/ControlButton.tsx`
      - `src/components/TimeDisplay.tsx`
      - `src/lib/time/duration.ts`
      - `src/lib/time/formatDuration.ts`
      - `src/lib/time/time.constants.ts`
      - `src/features/timer/useTimer.ts`
    - `src/hooks/useDocumentTitle.ts`
    - `src/hooks/useKeyboardShortcuts.ts`
    - `src/hooks/useWakeLock.ts`
    - `src/lib/time/formatDuration.ts`
    - `src/lib/time/time.constants.ts`
  - `src/features/appearance/AppearanceProvider.tsx`
    - `src/features/appearance/appearance-context.ts`
    - `src/features/appearance/themes.ts`

For visual drafts, pass the JSX-bearing files, `themes.ts`, and `src/index.css`; timing hooks and time utilities have no independent visual bearing.
