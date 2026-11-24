# 0006. Money is integer cents

- **Status:** Accepted
- **Date:** 2026-11-22

## Context

Floating-point numbers can't represent most decimal amounts exactly (`0.1 + 0.2 !== 0.3`). A budgeting app
adds, splits and compares amounts constantly; rounding drift would show up as wrong totals.

## Decision

Every amount is stored, sent and computed as an **integer number of cents** (D1 `INTEGER`, TypeScript
`number` holding a safe integer). Amounts become dollars only for display, formatted with `Intl.NumberFormat`.
Splits that don't divide evenly assign the leftover cents by an explicit rule, never by rounding floats.

## Consequences

- Sums and comparisons are exact.
- Input parsing must convert typed dollars to cents carefully (string-based, not `parseFloat × 100`).
- Every new money field is named or typed so its unit (cents) is obvious.
