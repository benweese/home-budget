# 0003. npm workspaces for the monorepo

- **Status:** Accepted
- **Date:** 2026-11-22

## Context

The repo holds several packages (`packages/*`), the Worker and web app (`apps/*`) and this docs site
(`docs/`). They share tooling but must be able to pin different versions of some dependencies.

## Decision

Use **npm workspaces** (`workspaces` in the root `package.json`), with one `package-lock.json`. Every workspace
is private, scoped `@home-budget/`, and unversioned; the repo has one version (see [0008](./0008-squash-conventional-commits-release-please)).
The docs site is its own workspace so its Vite version can't conflict with the app's.

## Consequences

- No extra package manager to install; works with Dependabot and `npm ci` in CI.
- npm hoists shared dependencies and nests conflicting versions per workspace.
- Revisit if install times or hoisting problems grow (pnpm is the likely alternative).

## Sources

- https://docs.npmjs.com/cli/using-npm/workspaces
