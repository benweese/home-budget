# 0002. Stack: Hono, Preact + Signals, Vite, D1 + Drizzle on Workers

- **Status:** Accepted
- **Date:** 2026-11-22

## Context

The app needs an API, a phone-first web front end installable as a PWA, a SQL database and scheduled jobs,
on free tiers, run by one maintainer.

## Decision

- **Runtime:** Cloudflare Workers. One Worker serves both the API and the built front end.
- **API:** [Hono](https://hono.dev/) with [Zod](https://zod.dev/) validation and Hono RPC for typed clients.
- **Database:** Cloudflare D1 (SQLite) through [Drizzle ORM](https://orm.drizzle.team/); migrations as SQL files.
- **Front end:** [Preact](https://preactjs.com/) + Signals, built with [Vite](https://vite.dev/). Native HTML
  controls first; hand-rolled SVG charts; a PWA via `vite-plugin-pwa`.
- **Language:** TypeScript everywhere (see [0007](./0007-typescript-strictness)).

## Consequences

- One deploy unit and one language; small bundles (Preact) suit phones.
- Workers limits (CPU time, no long-lived processes) shape jobs: scheduled work uses Cron Triggers.
- D1 is SQLite: no stored procedures, and migrations must be written for SQLite.

## Sources

- https://developers.cloudflare.com/workers/ · https://developers.cloudflare.com/d1/
- https://orm.drizzle.team/docs/connect-cloudflare-d1
