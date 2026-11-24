# apps/worker

The Cloudflare Worker. Today a stub that answers `ok`; the Hono app that serves the front end comes later.

- Tests run inside workerd via `@cloudflare/vitest-plugin` (`vitest.config.ts` reads `wrangler.jsonc`).
  Call the Worker with `exports.default.fetch()` from `cloudflare:workers`.
- After changing `wrangler.jsonc`, run `npm run cf-typegen -w @home-budget/worker` and commit
  `worker-configuration.d.ts`.
- The plugin adds `nodejs_compat` during tests even if the config lacks it: keep the flag in `wrangler.jsonc`.
- Fake timers don't reach the KV / R2 / cache simulators.
- D1 (later): migrations applied in a Vitest setup file with `readD1Migrations` + `applyD1Migrations`.
- `wrangler.jsonc` stays local only (`workers_dev: false`, no account ID, no secrets).
