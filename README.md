# home-budget

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

Workspaces: `packages/ui-tokens`, `apps/worker`, `apps/web`. After changing `apps/worker/wrangler.jsonc`, run `npm run cf-typegen -w @home-budget/worker`.

## License

[MIT](LICENSE)
