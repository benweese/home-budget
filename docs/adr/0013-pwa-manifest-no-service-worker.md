# 0013. Installable PWA: a manifest and icons, no service worker yet

- **Status:** Accepted
- **Date:** 2026-11-24

## Context

The app has to install to the iPhone Home Screen and as a desktop app. Neither iOS Safari nor current Chromium
needs a service worker to install, and a caching service worker in a money app risks showing stale numbers.

## Decision

- A hand-written `apps/web/public/manifest.webmanifest` (no plugin): name and short name from `APP_NAME`,
  `id` / `start_url` / `scope` `/`, `display: standalone`, **no orientation lock**, colours from the tokens,
  category `finance`.
- **Icons** live in `apps/web/public/icons/` (this repo is the icon source from now on): 192 and 512 PNGs and
  the SVG with purpose `any`; the maskable 512 as its own entry with purpose `maskable` (never `any maskable`
  on one icon). iOS gets a 180px `apple-touch-icon` and `apple-mobile-web-app-title`.
- **No service worker** until there's a reason: web push or offline mode. `vite-plugin-pwa` comes with it.
- **Checked automatically:** unit tests read the manifest and the icons (real PNG sizes match the declared
  sizes, purposes, token colours, the `<head>` links). The `app` CI job asks Chromium for the manifest
  (DevTools `Page.getAppManifest`: found, parsed, no errors) and checks Chrome's install criteria against what
  Chromium parsed, plus that every icon loads.

## Consequences

- Without a service worker the app needs a connection; offline it shows the browser's own error page.
- `Page.getInstallabilityErrors` isn't used: headless Chromium returns no errors even when there's no manifest.
  Lighthouse removed its PWA audit in version 12.
- The real iPhone Home Screen install is checked on the demo deploy (environments phase).

## Sources

- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
- https://web.dev/articles/maskable-icon
- https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-getAppManifest
