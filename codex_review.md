# Codex Review

Review date: 2026-05-13

## Scope

I reviewed the current React/Vite codebase for functional issues, code quality risks, and low-effort upgrade opportunities. I also ran the main project checks:

- `npm run build`: passes.
- `npm test`: fails with 1 failing test out of 1547.
- `npm run lint`: fails with 17 errors and 1 warning.

Note: the working tree already had unrelated modified/untracked files before this review. This document is the only file added by Codex for the review.

## Functional Issues

### 1. MemoryGame test is failing and appears flaky

Evidence:

- `npm test` fails in `src/__tests__/components/MemoryGame.test.tsx`.
- Failing test: `MemoryGame > playing state > non-matching cards flip back after delay`.
- Expected card text: `?`.
- Received card text: a symbol, for example `❄️`.

Relevant files:

- `src/__tests__/components/MemoryGame.test.tsx:238`
- `src/__tests__/components/MemoryGame.test.tsx:251`
- `src/__tests__/components/MemoryGame.test.tsx:267`
- `src/components/minigames/MemoryGame.tsx:87`
- `src/components/minigames/MemoryGame.tsx:108`

The test clicks the first card, then searches for a different card by clicking through the deck. If it accidentally clicks the matching pair first, the first card becomes permanently matched. The test then continues using that same first card as though it were still part of the next non-match pair, so the assertion can fail depending on shuffle order.

Recommended fix:

- Make the test deterministic by controlling `Math.random` or by deriving two known non-matching card indexes before clicking the second card.
- Keep this as a test fix unless manual play reveals that non-matching cards fail to flip back in the real UI.

### 2. Lint currently blocks a clean quality gate

Evidence:

- `npm run lint` reports 17 errors and 1 warning.

Main categories:

- Unused imports in tests, including `VictoryScreen.test.tsx`, `cargo.test.ts`, `rating.test.ts`, and `gameStore.test.ts`.
- `no-explicit-any` errors in `src/__tests__/integration/phase10-cargo.test.tsx`.
- React hooks lint errors for synchronous state updates inside effects.
- `QuizQuestion` memo dependencies do not match the value used inside `useMemo`.

Relevant files:

- `src/components/game/EventModal.tsx:58`
- `src/components/minigames/MemoryGame.tsx:131`
- `src/components/screens/DashboardScreen.tsx:184`
- `src/components/screens/VictoryScreen.tsx:37`
- `src/components/game/QuizQuestion.tsx:114`

Recommended fix:

- First remove unused test imports and replace test `any` values with concrete local types.
- For `QuizQuestion`, include `question.options` in the memo dependency list or memoize based on the full question object.
- For React 19 lint rules, prefer derived values where possible. For cases that really are event/timer synchronization, consider moving updates into handlers or using a reducer to avoid effect-driven cascading renders.

### 3. Final destination is hardcoded as country index 9

Evidence:

- `src/components/screens/DashboardScreen.tsx:120`
- `src/components/game/LocationIndicator.tsx:44`

Both components assume USA/final destination is always index `9`. This works with the current 10-country route, but future route changes can silently break victory/shop/location behavior.

Recommended fix:

- Replace `currentCountryIndex === 9` with `currentCountryIndex === countries.length - 1`.
- Consider a small helper such as `isFinalCountryIndex(index)` if this appears in more places.

### 4. Leaderboard save is not protected from storage failures

Evidence:

- `loadLeaderboard` safely catches invalid JSON and storage read problems.
- `saveLeaderboard` writes directly to `localStorage` without a try/catch.

Relevant file:

- `src/logic/leaderboard.ts:73`

Impact:

- In private browsing, quota exhaustion, locked-down browser contexts, or malformed storage environments, submitting a leaderboard entry can throw and disrupt the victory flow.

Recommended fix:

- Wrap `localStorage.setItem` in a try/catch and return a success boolean, or keep the void API but fail gracefully.
- Add one test for storage write failure.

## Code Improvement Areas

### 1. DashboardScreen is doing too much orchestration

Relevant file:

- `src/components/screens/DashboardScreen.tsx`

The dashboard owns turn execution animation, event resolution, modal sequencing, cargo handling, station shop transitions, mini-game starts, quiz starts, and victory flow. The separate `useModalOrchestrator` hook helps, but the screen still has many coupled effects and handlers.

Suggested upgrade:

- Extract turn side effects into focused hooks, for example `useTurnFlow`, `useStationFlow`, and `useEventFlow`.
- Keep `DashboardScreen` mostly as composition and rendering.
- This would make modal ordering bugs easier to test without mounting the entire dashboard.

### 2. Tests are broad, but some are brittle around randomness and timers

Relevant examples:

- `src/__tests__/components/MemoryGame.test.tsx`
- Components using `Math.random`, `setTimeout`, and `setInterval`.

Suggested upgrade:

- Inject shuffle/random functions into mini-games where practical.
- Use deterministic fixtures for timer-heavy tests.
- Prefer testing behavior from known state instead of discovering state by clicking through randomized UI.

### 3. Store actions could enforce more domain invariants

Relevant file:

- `src/stores/gameStore.ts`

The UI may prevent invalid actions, but store actions are still callable directly from tests or future components. Examples worth hardening:

- Prevent duplicate cart purchases in `purchaseCart`.
- Validate country indexes before starting mini-games or quizzes.
- Keep resource max calculations centralized when cart upgrades affect caps.

This is not urgent, but it would reduce future feature bugs.

## Easy Upgrade Candidates

### 1. Fix lint/test gate as a short maintenance pass

This is the highest-value easy upgrade. The production build passes, but CI-style confidence is currently weakened by one failing test and lint failures.

Suggested order:

1. Stabilize `MemoryGame.test.tsx`.
2. Remove unused imports.
3. Replace test `any` annotations.
4. Resolve the `QuizQuestion` memo dependency.
5. Triage React hooks lint findings one component at a time.

### 2. Replace magic route constants

Use `countries.length - 1` for final-destination checks. This is small, low-risk, and makes later route expansion safer.

### 3. Add defensive leaderboard persistence

Handle `localStorage.setItem` failures gracefully so victory/name-entry UX does not crash in constrained browser environments.

### 4. Add a targeted smoke test for final-destination behavior

A focused test could assert:

- final country shows finish behavior,
- non-final station still allows shop,
- route length changes do not require updating hardcoded indexes.

## Overall Assessment

The project is in a strong shape for a game prototype: it has a clear data/logic/component split, substantial test coverage, and a passing production build. The main issues are not architectural emergencies; they are quality-gate failures, some brittle randomness/timer tests, and a few hardcoded assumptions that will become annoying as the game grows.

Recommended next move: fix the failing test and lint gate first, then do the small final-destination and leaderboard resilience upgrades.
