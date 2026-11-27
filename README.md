# home-budget

**Docs:** https://code.benweese.com/home-budget/ (decisions, accessibility, supported devices)

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/benweese/home-budget/badge)](https://scorecard.dev/viewer/?uri=github.com/benweese/home-budget)

A simple family cash-flow app: forecast what's safe to spend, weekly envelopes, bank sync. Cloudflare Workers + D1, accessible by default.

**Status: early — not ready to use.** The project is being set up; there is no app yet.

End-to-end and accessibility tests live in [home-budget-e2e](https://github.com/benweese/home-budget-e2e).

## Develop

Requires Node 24 (see `.nvmrc`).

```sh
npm install
npm test               # Vitest: Worker code runs in workerd, build-time packages in Node
npm run test:coverage  # Istanbul coverage (text + lcov)
npm run lint           # ESLint with typescript-eslint's type-checked rules
npm run typecheck      # tsc --noEmit in every workspace
npm run format:check   # Prettier
```

Run the app locally (two terminals): `npm run dev:web` (rebuilds the front end on save) and `npm run dev:worker`
(serves it with the API at http://localhost:8787). Checks: `npm run app:build && npm run app:a11y`.

Workspaces: `packages/ui-tokens`, `apps/worker`, `apps/web`, `docs` (the VitePress docs site: `npm run docs:build`,
then `npm run docs:a11y` for the axe check; `npm run dev -w @home-budget/docs` to preview). After changing `apps/worker/wrangler.jsonc`, run `npm run cf-typegen -w @home-budget/worker`.

## Claude Code

The repo uses the [benweese plugins](https://github.com/benweese/claude-plugins): docs, workflow,
accessibility, privacy and guardrails (`.claude/settings.json`). Install them once from a terminal
(`claude plugin install <name>@benweese`), then start a new session.

- **Commit blockers:** `.claude/privacy.json` blocks personal data and `.claude/guardrails.json` blocks
  secrets before Claude commits. The hooks read `.claude/privacy.json` from the folder the Claude session
  started in. This repo's copy names no denylist, so a session started here runs the built-in checks only; to
  add a denylist, start the session from a folder whose `privacy.json` names one
  ([privacy plugin docs](https://github.com/benweese/claude-plugins/blob/main/plugins/privacy/README.md)).
  For commits made outside Claude, run `install-privacy-git-hook` once, and again after each privacy plugin
  update.
- **`.claude/board.json` is local only** (gitignored): it's the maintainer's task-board config.
- Accessibility rules: [docs/accessibility.md](docs/accessibility.md).

## License

[MIT](LICENSE)
