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
- Unit tests (Node) cover pure helpers; component tests come with the component kit.
- Dev: `npm run dev:web` (vite build --watch) + `npm run dev:worker` (wrangler dev) in two terminals.
