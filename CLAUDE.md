# home-budget

Public repo: a family cash-flow app on Cloudflare Workers + D1 (TypeScript monorepo). Read README.md first.

## Rules

- **Public code, no personal data:** no real amounts, names, account or card numbers, emails, addresses or
  production domains anywhere (code, tests, mocks, docs, commits). Mocks use a fictional household.
- **No references to private trackers** in commits, PRs or code (no issue numbers from elsewhere).
- Money is stored and computed as **integer cents**, never floats.
- TypeScript strict (+ `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`). If a library's types fight
  `exactOptionalPropertyTypes`, relax it with an ADR note, never with casts.
- `apps/worker/wrangler.jsonc` is local only: no account IDs, no secrets, no production config.
- Accessibility: WCAG 2.2 AA + docs/accessibility.md. Native HTML first; role/label locators.

## Workflow

- Before every PR: `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check`.
- PR titles are Conventional Commits (CONTRIBUTING.md; a required check); squash merge only. release-please
  writes CHANGELOG.md and the version from them: never edit either by hand.
- Unit tests: Vitest. Worker code runs in workerd (`@cloudflare/vitest-plugin`); build-time packages in
  Node. Coverage is Istanbul (V8 isn't supported by the Workers integration). E2E lives in home-budget-e2e.
- Claude plugins (benweese marketplace): docs, workflow, accessibility, privacy, guardrails — see README.
  `.claude/board.json` is local only (gitignored); never commit it.
- A privacy or secret block on commit is a real finding: fix the line, never bypass it.

## Layout

- `packages/ui-tokens` — design tokens · `apps/worker` — the Worker (see its CLAUDE.md) · `apps/web` — front end.
