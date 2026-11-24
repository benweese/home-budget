# packages/ui-tokens

Design tokens: the single source of truth for colours, spacing, radii, focus and target size. Always dark.

- Edit `src/tokens.ts`, then run `npm run build:css -w @home-budget/ui-tokens` and commit `tokens.css`. A test
  fails if the committed CSS drifts. Never edit `tokens.css` by hand (Prettier skips it on purpose).
- Apps import `@home-budget/ui-tokens/tokens.css` (custom properties `--hb-*`); code and tests import the TS.
- Every colour pairing the UI uses is listed in `src/pairs.ts` with its minimum: text 4.5:1, UI 3:1. Add a
  pair whenever a new combination appears; the tests check it in both the default and Increase Contrast
  palettes.
- Status colours (good / tight / bad) are always paired with an icon and words, never colour alone.
- `divider` is decorative only; control outlines use `border` (≥3:1 on bg and surfaceRaised).
- `--hb-target-min` is `max(44px, 2.75rem)`, so targets grow with Dynamic Type.
- Tests run in Node (`vitest.config.ts`); they're build-time checks, not Worker code.
