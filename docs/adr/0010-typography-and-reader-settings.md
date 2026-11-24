# 0010. Typography and reader settings

- **Status:** Accepted
- **Date:** 2026-11-23

## Context

Text has to follow the reader's own size and contrast settings on iPhone, iPad and desktop, stay readable at
the largest Accessibility sizes, and line amounts up in columns.

## Decision

- **Font:** [Atkinson Hyperlegible Next](https://github.com/googlefonts/atkinson-hyperlegible-next) (Braille
  Institute), the variable version (weights 200–800 in one ~36 KB file), Latin subset, upright only.
  **Self-hosted** from `@fontsource-variable/atkinson-hyperlegible-next` (SIL OFL 1.1): the build serves the
  file from our own origin, never a font CDN. It has tabular figures (`tnum`), checked in the font file.
- **Root font,** in this order (`packages/ui-tokens/base.css`):
  1. `font-size: 100%`: the fallback everywhere (16px unless the reader changed the browser's size);
  2. `font: -apple-system-body`: Safari-only, sets the size from iOS Dynamic Type; other browsers drop it as
     invalid, so 1 stays;
  3. `font-family` and `line-height` after it, because the `font` shorthand resets them.
     Every other size is in rem (`--hb-text-*`), so the whole UI scales from this one value.
- **Amounts** use `.hb-amount` (`font-variant-numeric: tabular-nums`).
- **Increase Contrast:** the tokens' `prefers-contrast: more` overrides (muted text full white, strong borders).
- **Forced colours:** controls keep a visible border, focus uses the system `Highlight` colour, icons follow
  `currentColor`.
- **Smart Invert:** nothing special. Safari already leaves images and media alone, and the UI is dark either
  way, so extra rules would only fight the reader's setting.
- **No motion** anywhere.

## Consequences

- A test checks the root-font declaration order; the docs check asserts the 16px fallback and the loaded font
  in Chromium, and runs every page at a 310% root size (no sideways scroll, nothing cut off) and in forced
  colours.
- The real Dynamic Type check needs a real iPhone; that's part of the manual pass for phone-facing changes.
- A larger default for one reader ("one step bigger") is a per-person setting later, not a different root.

## Sources

- https://webkit.org/blog/3709/using-the-system-font-in-web-content/ (`-apple-system-body`)
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors
- https://github.com/googlefonts/atkinson-hyperlegible-next (licence: OFL 1.1)
