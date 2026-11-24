import {
	color,
	colorMoreContrast,
	focusWidth,
	fontFamily,
	lineHeight,
	radius,
	space,
	targetMin,
	text,
} from "./tokens.ts";

const kebab = (name: string): string => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const colorVars = (entries: [string, string][]): string[] =>
	entries.map(([name, value]) => `--hb-color-${kebab(name)}: ${value};`);

/** The generated stylesheet: every token as a custom property on :root, plus Increase Contrast overrides. */
export function renderCss(): string {
	const base = new Map<string, string>(Object.entries(color));
	const changed = Object.entries(colorMoreContrast).filter(([name, value]) => base.get(name) !== value);
	const lines = [
		"/* Generated from src/tokens.ts by scripts/build-css.ts. Don't edit by hand. */",
		":root {",
		"\tcolor-scheme: dark;",
		...colorVars(Object.entries(color)).map((l) => `\t${l}`),
		...Object.entries(space).map(([k, v]) => `\t--hb-space-${k}: ${v};`),
		...Object.entries(radius).map(([k, v]) => `\t--hb-radius-${k}: ${v};`),
		...Object.entries(text).map(([k, v]) => `\t--hb-text-${k}: ${v};`),
		`\t--hb-font-family: ${fontFamily};`,
		`\t--hb-line-height: ${lineHeight};`,
		`\t--hb-target-min: ${targetMin};`,
		`\t--hb-focus-width: ${focusWidth};`,
		"}",
		"",
		"@media (prefers-contrast: more) {",
		"\t:root {",
		...colorVars(changed).map((l) => `\t\t${l}`),
		"\t}",
		"}",
		"",
	];
	return lines.join("\n");
}
