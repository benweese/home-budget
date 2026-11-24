# Accessibility

## Statement

home-budget aims to meet **WCAG 2.2 level AA**, plus the stricter rules below.

- **How it's checked:** axe (WCAG 2.2 AA rules) runs on every page and component state in CI, including this
  docs site; keyboard, contrast and large-text checks run in the end-to-end tests; and phone-facing changes get
  a manual pass on real iPhones with VoiceOver and the largest text sizes.
- **Limits:** automated checks find only part of what WCAG covers, so passing them isn't the same as being
  accessible, and this project never claims to be "compliant". Problems found by hand are fixed like any bug.
- **Feedback:** the app is built for one household, so there's no public feedback channel (issues are turned
  off on this repository). Security problems can be reported privately through GitHub's
  [private vulnerability reporting](https://github.com/benweese/home-budget/security/advisories/new).

## Rules

How text size, the font, Increase Contrast, forced colours and Smart Invert are handled, and why:
[ADR 0010](./adr/0010-typography-and-reader-settings).

home-budget targets **WCAG 2.2 AA**, plus the rules below. They apply to every page and component, and
automated checks (axe) plus a manual pass on real iPhones are part of "done". Automated checks cover only
part of WCAG, so nothing here is described as "compliant".

### Text and contrast

- Text follows the reader's settings: iOS Dynamic Type (`-apple-system-body` root, every size in `rem`) and
  the browser's font size and zoom.
- Self-hosted Atkinson Hyperlegible; tabular numerals for amounts.
- Always dark, with low-glare whites; every text and UI colour pair meets AA contrast.
- iOS settings honoured: Increase Contrast (muted text goes full white, borders get stronger), Smart Invert
  and forced colours.
- Amounts and cards wrap at the largest text sizes; nothing truncates.

### Interaction

- No animations or motion (loading is a plain "Loading…" line).
- Targets at least 44×44 px, generous spacing.
- No drag, no gestures, nothing that depends on sound.
- Every input has a visible label; native HTML controls first (native selects).
- Visible focus; full keyboard use (iPad keyboard and desktop).
- VoiceOver and Voice Control work: role and label first, the accessible name matches the visible label.
- Money changes ask for confirmation and can be undone.

### Content

- Plain language; no puns in verdicts, warnings, errors or screen-reader labels.
- Words before charts: every chart has the same information as text.
- Fewer things on screen at once.
