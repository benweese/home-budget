# 0004. Plain CSS custom properties, no Tailwind

- **Status:** Accepted
- **Date:** 2026-11-22

## Context

The app is always dark, follows the reader's text size and contrast settings, and has a small, fixed palette.
The styling layer was an open question: plain CSS custom properties or Tailwind v4 on the same tokens.

## Decision

Use **plain CSS with custom properties** for design tokens (`packages/ui-tokens`), with component styles in
ordinary CSS. No Tailwind, no CSS-in-JS.

## Consequences

- No build plugin or class vocabulary; media queries for Dynamic Type, Increase Contrast and forced colours are
  written directly.
- Token contrast is tested from one source of truth.
- More hand-written CSS than a utility framework; consistency comes from the tokens and the component kit.
