# apps/web

The front end: Preact + Signals, built by Vite into `dist/`, which the Worker serves as static assets.

- Entry `src/main.tsx` imports `@home-budget/ui-tokens/tokens.css`, then `base.css`, then `app.css`.
- The app name lives in `src/app-name.ts` only (also hard-coded once in `index.html`'s `<title>` and
  `<noscript>`; change all three together).
- **Strict CSP** (`public/_headers`): no inline `<script>` or `<style>`, no `style=""` attributes in HTML,
  no third-party origins. Setting styles from JS through the CSSOM is fine. `npm run app:a11y` fails on any
  violation.
- `vite.config.ts` dedupes `preact`: the docs workspace hoists Preact 10, and without the dedupe
  `@preact/signals` binds to it and signal updates never re-render. Keep it.
- Layout: 1 → 2 → 3 columns at 40rem / 64rem (rem, so large text gets fewer columns). Every size from tokens.
- Words before colour: every status has text (`statusText` in `src/health.ts`).
- **Components** (`src/components/`, ADR 0012): Button (no disabled style: `unavailableReason` → aria-disabled +
  linked visible reason; presses blocked), TextField, SelectField (native), AnswerCard, Banner, FooterLink, Icon.
  Every state goes on `/gallery` (made-up data only), which `npm run app:a11y` checks.
- Tests: pure helpers in Node (`test/*.test.ts`); components in a real browser via Vitest browser mode
  (`test/components/`, `vitest.components.config.ts`). Grid tracks use `minmax(0, 1fr)` (large text).
- Dev: `npm run dev:web` (vite build --watch) + `npm run dev:worker` (wrangler dev) in two terminals.
- **PWA** (ADR 0013): `public/manifest.webmanifest` + `public/icons/` (the icon source). No service worker yet.
  Keep 192/512 `any` and the maskable 512 as separate entries; `test/manifest.test.ts` checks it all.
