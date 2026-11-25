# 0012. Accessible component kit and how it's tested

- **Status:** Accepted
- **Date:** 2026-11-24

## Context

Later screens need a small set of building blocks that are accessible by construction, so each new screen
doesn't re-solve labels, focus, states and target size. ADR 0005 left Preact component testing open.

## Decision

- **Components** in `apps/web/src/components/` (a package only when a second app needs them): primary and
  secondary `Button`, `TextField`, native `SelectField`, `AnswerCard` (good / tight / bad), `Banner`
  (info / caution / bad), `FooterLink`, and decorative `Icon`s.
- **No disabled style.** A button that can't act yet stays focusable with `aria-disabled="true"`, shows a
  visible reason linked through `aria-describedby`, and blocks its own action (click, Enter and Space do
  nothing). A greyed-out `disabled` button can't be focused, gives no reason and fails contrast.
- **Fields:** a visible label above the field, never a placeholder; hints via `aria-describedby`; errors in
  words with an icon and `aria-invalid`, inside a live region that exists before the error appears.
- **Icons** are inline SVG in `currentColor` with `aria-hidden`; the words beside them carry the meaning.
- **Tests:** Vitest **browser mode** (Playwright's Chromium) for behaviour and keyboard, in the same
  `npm test` and runner as the unit tests (`apps/web/vitest.components.config.ts`). Every component state is
  on a `/gallery` page (made-up sample data, not linked, `noindex`), which the required `app` CI job checks:
  axe, 44px targets, CSP, 310% text and forced colours.

## Consequences

- New UI uses the kit, or extends it with the same rules and a gallery entry.
- Grid tracks use `minmax(0, 1fr)`: plain `1fr` can't shrink below its widest child, which pushed the page
  sideways at 310% text (found by the gallery check).
- Whether `/gallery` stays reachable in production is decided with Cloudflare Access (environments phase).
- Component tests run in Chromium only; WebKit is covered by the end-to-end `iphone` project.

## Sources

- https://vitest.dev/guide/browser/
- https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/ (focusable disabled controls)
