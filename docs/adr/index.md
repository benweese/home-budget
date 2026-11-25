# Decisions (ADRs)

Each architecture decision record says what was decided, why, and what it costs. They're numbered in the order
they were made and never deleted: a changed decision gets a new ADR that supersedes the old one. How to write
one: [ADR 0001](./0001-record-architecture-decisions).

| ADR                                                       | Decision                                                            | Status   |
| --------------------------------------------------------- | ------------------------------------------------------------------- | -------- |
| [0001](./0001-record-architecture-decisions)              | Record decisions as ADRs                                            | Accepted |
| [0002](./0002-stack)                                      | Stack: Hono, Preact + Signals, Vite, D1 + Drizzle on Workers        | Accepted |
| [0003](./0003-npm-workspaces)                             | npm workspaces for the monorepo                                     | Accepted |
| [0004](./0004-css-custom-properties)                      | Plain CSS custom properties, no Tailwind                            | Accepted |
| [0005](./0005-unit-test-runner)                           | Vitest + `@cloudflare/vitest-plugin`, Istanbul coverage             | Accepted |
| [0006](./0006-money-integer-cents)                        | Money is integer cents                                              | Accepted |
| [0007](./0007-typescript-strictness)                      | TypeScript strictness; TypeScript 6.0 for now                       | Accepted |
| [0008](./0008-squash-conventional-commits-release-please) | Squash merge, Conventional Commit titles, release-please            | Accepted |
| [0009](./0009-actions-supply-chain)                       | Actions allow list, SHA pins, image-pinned tools                    | Accepted |
| [0010](./0010-typography-and-reader-settings)             | Atkinson Hyperlegible Next, Dynamic Type root font, reader settings | Accepted |
| [0011](./0011-serving-and-security-headers)               | Workers Static Assets, strict CSP proven in CI                      | Accepted |
| [0012](./0012-component-kit)                              | Accessible component kit; Vitest browser mode + gallery checks      | Accepted |
| [0013](./0013-pwa-manifest-no-service-worker)             | Installable PWA: manifest + icons, no service worker yet            | Accepted |
