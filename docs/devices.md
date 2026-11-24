# Supported devices

The app is phone-first. Every device below has to work and look right, with the reader's own text size.

| Device  | How it's used                                  | Browser engine  | Layout      |
| ------- | ---------------------------------------------- | --------------- | ----------- |
| iPhone  | Installed as a Home Screen app (PWA)           | WebKit (Safari) | 1 column    |
| iPad    | Bookmark in Safari, with or without a keyboard | WebKit (Safari) | 2 columns   |
| Desktop | Bookmark in a Chromium browser (Linux, macOS)  | Chromium        | 2–3 columns |

- **Text size:** iOS Dynamic Type on iPhone and iPad; the browser's font size and zoom on desktop.
- **Keyboard:** everything works from an iPad keyboard and on desktop.
- **Automated tests** cover all three: an `iphone` project (WebKit, full suite + accessibility), and `ipad` and
  `desktop` projects (smoke + accessibility + layout). A manual pass on real iPhones is part of "done" for any
  phone-facing change.
