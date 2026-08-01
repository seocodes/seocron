# seocron agent guide

## Product invariants

- The app is a static, client-only Timer + Stopwatch. Timer is the default mode.
- Do not add a backend, analytics, tracking, cookies, or runtime network calls.
- Do not use `localStorage`, `sessionStorage`, IndexedDB, or server persistence.
- Time is derived from real timestamps (`Date.now()`), never by counting interval ticks.
- A render scheduler may request updates, but it must not be the source of elapsed time.
- Request Screen Wake Lock only while the active mode is running and fail gracefully when unavailable.
- Keep all themes WCAG AA. Primary digits must have at least 4.5:1 contrast.
- Every interactive control must be keyboard reachable and have an accessible name.
- Fonts must be bundled locally; do not introduce font or asset CDNs.

## Engineering preferences

- Prefer plain React state and focused hooks over a global state library.
- Keep abstractions proportional to this small app. Optimize only measured problems.
- Keep timing logic separate from presentation and cover it with deterministic tests.
- Preserve strict TypeScript. Avoid `any`, non-null assertions beyond bootstrap code, and hidden side effects.
- Add dependencies only when they remove meaningful maintenance or correctness risk.
- Keep user-facing copy in Brazilian Portuguese.

## Verification

Run `npm run verify` before considering a change complete. For a focused change, run the nearest test first, then the full command.

`npm run verify` covers type checking, linting, unit/component tests, and the production build.

## Project map

- `src/app`: application composition and cross-feature coordination.
- `src/components`: reusable presentational controls.
- `src/features/timer`: timer engine and UI.
- `src/features/stopwatch`: stopwatch, laps, and UI.
- `src/features/appearance`: in-memory theme and font selection.
- `src/hooks`: browser integrations such as Wake Lock, title, visibility, and shortcuts.
- `src/lib/time`: parsing and formatting utilities.
- `src/test`: shared test setup and integration tests.

## Definition of done

- The requested behavior is implemented without changing the product invariants.
- Relevant deterministic tests cover success and edge cases.
- Keyboard and screen-reader behavior is considered for UI changes.
- No external runtime request or browser persistence was introduced.
- `npm run verify` succeeds.
