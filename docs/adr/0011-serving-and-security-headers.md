# 0011. Serving the app: Workers Static Assets and a strict CSP

- **Status:** Accepted
- **Date:** 2026-11-23

## Context

One Worker serves both the API and the front end (ADR 0002). Local runs and end-to-end tests should exercise
exactly what production serves, and the security headers should be proven, not assumed.

## Decision

- **Workers Static Assets.** `apps/web` builds with Vite into `dist/`; `apps/worker/wrangler.jsonc` points
  `assets.directory` at it with `run_worker_first: ["/api/*"]` and `not_found_handling:
"single-page-application"`. Static files never run Worker code; unknown non-API paths get `index.html`;
  unknown `/api/*` paths are JSON 404s from the Worker. Local and end-to-end runs use `wrangler dev`.
- **Security headers.** Static files: `apps/web/public/_headers` with a strict Content-Security-Policy
  (`default-src 'self'`, no inline script or style, `frame-ancestors 'none'`, `object-src 'none'`), plus
  `nosniff`, `Referrer-Policy: no-referrer`, a closed `Permissions-Policy` and `Cross-Origin-Opener-Policy`.
  API: Hono's `secureHeaders` with `default-src 'none'`.
- **Proven in CI.** The required `app` job runs the Worker under `wrangler dev` and fails on a missing CSP
  header, any CSP violation in the console, a broken SPA fallback, the shell not reaching the API, and any
  accessibility failure (the shared checks in `scripts/a11y-check.mjs`).
- **One Preact.** `apps/web/vite.config.ts` dedupes `preact`, because the docs workspace hoists Preact 10 and
  `@preact/signals` would otherwise bind to it.

## Consequences

- No inline scripts or styles, ever: new code that needs them must change the policy in an ADR first.
- The Cloudflare Vite plugin (Worker inside `vite dev`) isn't used; local development is two processes
  (`vite build --watch` + `wrangler dev`).

## Sources

- https://developers.cloudflare.com/workers/static-assets/
- https://developers.cloudflare.com/workers/static-assets/headers/
- https://hono.dev/docs/middleware/builtin/secure-headers
