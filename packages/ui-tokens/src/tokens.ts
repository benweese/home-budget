/**
 * Design tokens for home-budget: the single source of truth. `tokens.css` is generated from this file
 * (`npm run build:css -w @home-budget/ui-tokens`) and a test fails if the committed CSS drifts.
 * Always dark. Colours from docs/brand.md (base, text, muted, brand, status) plus the surface, border and
 * focus colours added with this package.
 */

/** Colours in the default (dark) theme. */
export const color = {
	/** App background (charcoal, not pure black). */
	bg: "#16181d",
	/** Cards and inputs, one step lighter than the background. */
	surfaceRaised: "#1e2128",
	/** Primary text (softened off-white, low glare). */
	text: "#efece6",
	/** Labels and secondary text. */
	textMuted: "#9aa3ad",
	/** Periwinkle: buttons, links, focus accents. */
	brand: "#8b9cf4",
	/** Text on periwinkle (white on periwinkle fails contrast). */
	onBrand: "#16181d",
	/** Status: good. Always paired with an icon and words. */
	good: "#7fbf8e",
	/** Status: caution. Always paired with an icon and words. */
	tight: "#e0b25a",
	/** Status: bad (soft coral-red, never neon). Always paired with an icon and words. */
	bad: "#e07a6f",
	/** Outlines of inputs and controls (meets 3:1 against bg and surfaceRaised). */
	border: "#6b7280",
	/** Stronger outline, used under Increase Contrast. */
	borderStrong: "#9aa3ad",
	/** Decorative dividers only: never the only sign of a control or a state. */
	divider: "#2c3039",
	/** Focus ring colour (drawn 3px wide). */
	focus: "#8b9cf4",
} as const;

export type ColorName = keyof typeof color;

/** Overrides under `prefers-contrast: more` (iOS Increase Contrast): muted text goes full white, borders strong. */
export const colorMoreContrast = {
	...color,
	textMuted: color.text,
	border: color.borderStrong,
	divider: color.border,
} as const satisfies Record<ColorName, string>;

/** Spacing scale on a 4px (0.25rem) base, in rem so it grows with the reader's text size. */
export const space = {
	1: "0.25rem",
	2: "0.5rem",
	3: "0.75rem",
	4: "1rem",
	5: "1.5rem",
	6: "2rem",
	7: "3rem",
} as const;

/** Corner radii. */
export const radius = {
	control: "0.5rem",
	card: "0.75rem",
	pill: "999px",
} as const;

/** Smallest touch target: 44px, growing with Dynamic Type (2.75rem = 44px at the default 16px root). */
export const targetMin = "max(44px, 2.75rem)";

/** Focus ring width. */
export const focusWidth = "3px";
