# 0005. Vitest + `@cloudflare/vitest-plugin`, Istanbul coverage

- **Status:** Accepted
- **Date:** 2026-11-23 (proposed 2026-11-22)

## Context

Worker code should be tested in the runtime it ships to, with real local bindings (D1 later). The earlier plan
was Playwright Test + c8 for unit tests, which runs in Node and collects V8 coverage.

## Decision

- **Worker code** (`apps/worker`, and later the packages that run in the Worker) is tested with
  [Vitest](https://vitest.dev/) and **`@cloudflare/vitest-plugin`** (version 1; formerly
  `@cloudflare/vitest-pool-workers`), configured with `cloudflareTest({ wrangler: { configPath } })`. Tests run
  inside **workerd** and call the Worker with `exports.default.fetch()` from `cloudflare:workers`.
- **D1** (when it lands): `readD1Migrations()` in the Vitest config reads the migrations, and a setup file
  applies them with `applyD1Migrations()`. Storage is isolated per test file.
- **Build-time packages** (for example `ui-tokens`' contrast tests) use plain Vitest in Node, as a separate Vitest
  project.
- **Coverage:** Istanbul (`@vitest/coverage-istanbul`). The Workers integration doesn't support V8 coverage.
  Report only for now; thresholds start when real logic lands.
- **Playwright** is for end-to-end tests only (in home-budget-e2e).

## Consequences

- Tests see the real Workers APIs and bindings, so Node-only APIs fail in tests, not in production.
- Known limits: Vitest's fake timers don't reach the KV, R2 and cache simulators; the plugin enables
  `nodejs_compat` during tests even if `wrangler.jsonc` lacks it, so the flag must stay in the config.
- Integration tests across several Workers would use `createTestHarness()` instead.
- Preact component tests are decided separately, with the component kit.

## Sources

- Known issues (Istanbul only, fake timers): https://developers.cloudflare.com/workers/testing/vitest-integration/known-issues/
- Configuration (`cloudflareTest`, `readD1Migrations`): https://developers.cloudflare.com/workers/testing/vitest-integration/configuration/
- Test APIs (`applyD1Migrations`): https://developers.cloudflare.com/workers/testing/vitest-integration/test-apis/
- Package rename (2026-08-19): https://developers.cloudflare.com/changelog/post/2026-08-19-vitest-plugin/
