# 0007. TypeScript strictness; TypeScript 6.0 for now

- **Status:** Accepted
- **Date:** 2026-11-22

## Context

Money logic and optional fields are where type holes turn into wrong answers.

## Decision

- `strict`, plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`, in every workspace
  (`tsconfig.base.json`); ESM with `moduleResolution: bundler`; no emit (bundlers build).
- If `exactOptionalPropertyTypes` fights a library's types, relax it **with a new ADR** that names the library,
  never with `as` casts or `any`.
- **TypeScript 6.0.x** until typescript-eslint supports TypeScript 7 (its peer range is `<6.1.0` as of
  2026-11-23). Dependabot ignores TypeScript 7 until then.
- ESLint uses typescript-eslint's `strictTypeChecked` rules.

## Consequences

- Index access returns `T | undefined`, so lookups need explicit handling.
- Optional properties can't be set to `undefined` by accident.
- Moving to TypeScript 7 is a follow-up once the lint tooling supports it.

## Sources

- https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess
- https://www.typescriptlang.org/tsconfig/#exactOptionalPropertyTypes
- https://typescript-eslint.io/users/dependency-versions/
