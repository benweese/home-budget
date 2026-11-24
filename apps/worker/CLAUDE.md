# apps/worker

The Cloudflare Worker: a Hono app for `/api/*`. Workers Static Assets serves `../web/dist` before the Worker
runs; only `/api/*` reaches it (`run_worker_first`), other unknown paths get `index.html` (SPA fallback).

- Tests run inside workerd via `@cloudflare/vitest-plugin` (`vitest.config.ts` reads `wrangler.jsonc`).
  Call the Worker with `exports.default.fetch()` from `cloudflare:workers`.
- After changing `wrangler.jsonc`, run `npm run cf-typegen -w @home-budget/worker` and commit
  `worker-configuration.d.ts`.
- The plugin adds `nodejs_compat` during tests even if the config lacks it: keep the flag in `wrangler.jsonc`.
- Fake timers don't reach the KV / R2 / cache simulators.
- D1 (later): migrations applied in a Vitest setup file with `readD1Migrations` + `applyD1Migrations`.
- `wrangler.jsonc` stays local only (`workers_dev: false`, no account ID, no secrets).
- `/api/*` gets Hono's `secureHeaders` (CSP `default-src 'none'`); static files get `apps/web/public/_headers`.
- Unknown `/api/*` paths are JSON 404s. `GET /api/health` → `{ "status": "ok" }`, `no-store`.
- `npm run app:a11y` (repo root) runs this under `wrangler dev` and checks the real responses.
