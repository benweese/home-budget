# home-budget

Public repo: a family cash-flow app on Cloudflare Workers + D1 (TypeScript monorepo). Read README.md first.

## Rules

- **Public code, no personal data:** no real amounts, names, account or card numbers, emails, addresses or
  the app's production domain anywhere (code, tests, mocks, docs, commits). The public docs
  site address (code.benweese.com/home-budget/) is fine. Mocks use a fictional household.
- **One exception:** the app's name "Budget Ben" (`apps/web/src/app-name.ts`) uses the owner's first name, by
  the owner's choice. It's the brand, allowed in the UI, tests and docs. No other real names, ever.
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

- `packages/ui-tokens` — tokens + base styles · `apps/worker` — Worker + API · `apps/web` — Preact front end ·
  `docs` — docs site · `scripts/` — shared accessibility + CSP checks. Each has its own CLAUDE.md where useful.
