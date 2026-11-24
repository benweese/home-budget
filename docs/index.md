# home-budget

A simple family cash-flow app: it forecasts what's safe to spend, keeps weekly envelopes, and syncs with the
bank. It runs on Cloudflare Workers + D1, and it's built to be accessible by default.

::: warning Early
The project is being set up. There's no app to use yet; these pages record how it's built and why.
:::

## What's here

- [Supported devices](./devices): where the app has to work and look right.
- [Accessibility](./accessibility): the WCAG target and the rules every page follows.
- [Decisions](./adr/): architecture decision records (ADRs), one per decision, with the reasons.

## The code

- **App:** [benweese/home-budget](https://github.com/benweese/home-budget), a TypeScript monorepo
  (`packages/*`, `apps/worker`, `apps/web`, and these docs in `docs/`).
- **End-to-end and accessibility tests:** [benweese/home-budget-e2e](https://github.com/benweese/home-budget-e2e).
- Releases and the changelog come from the commit history ([releases](https://github.com/benweese/home-budget/releases)).

This site is edited through pull requests only, like the code.
