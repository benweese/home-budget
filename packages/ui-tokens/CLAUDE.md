# packages/ui-tokens

Design tokens (colours, type scale, spacing, radii, focus, target size) and base styles. Always dark.

- Edit `src/tokens.ts`, then run `npm run build:css -w @home-budget/ui-tokens` and commit `tokens.css`. A test
  fails if the committed CSS drifts. Never edit `tokens.css` by hand (Prettier skips it on purpose).
- Apps import `@home-budget/ui-tokens/tokens.css` then `@home-budget/ui-tokens/base.css` (after any framework
  CSS, so the root font wins); code and tests import the TS.
- `base.css` is hand-written: the self-hosted Atkinson Hyperlegible Next `@font-face`, the root font (order:
  `font-size: 100%` → `font: -apple-system-body` → family + line height; a test checks it), `.hb-amount`
  (tabular numerals), focus, no motion, forced colours. No Smart Invert rules, on purpose (ADR 0010).
- Every colour pairing the UI uses is listed in `src/pairs.ts` with its minimum: text 4.5:1, UI 3:1. Add a
  pair whenever a new combination appears; the tests check it in both the default and Increase Contrast
  palettes.
- Status colours (good / tight / bad) are always paired with an icon and words, never colour alone.
- `divider` is decorative only; control outlines use `border` (≥3:1 on bg and surfaceRaised).
- `--hb-target-min` is `max(44px, 2.75rem)`, so targets grow with Dynamic Type.
- Tests run in Node (`vitest.config.ts`); they're build-time checks, not Worker code.
