import { color, colorMoreContrast, focusWidth, radius, space, targetMin, type ColorName } from "./tokens.ts";

const kebab = (name: string): string => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const colorVars = (palette: Record<ColorName, string>, only?: ColorName[]): string[] =>
	(Object.keys(palette) as ColorName[])
		.filter((name) => !only || only.includes(name))
		.map((name) => `--hb-color-${kebab(name)}: ${palette[name]};`);

/** The generated stylesheet: every token as a custom property on :root, plus Increase Contrast overrides. */
export function renderCss(): string {
	const changed = (Object.keys(color) as ColorName[]).filter(
		(name) => colorMoreContrast[name] !== color[name],
	);
	const lines = [
		"/* Generated from src/tokens.ts by scripts/build-css.ts. Don't edit by hand. */",
		":root {",
		"\tcolor-scheme: dark;",
		...colorVars(color).map((l) => `\t${l}`),
		...Object.entries(space).map(([k, v]) => `\t--hb-space-${k}: ${v};`),
		...Object.entries(radius).map(([k, v]) => `\t--hb-radius-${k}: ${v};`),
		`\t--hb-target-min: ${targetMin};`,
		`\t--hb-focus-width: ${focusWidth};`,
		"}",
		"",
		"@media (prefers-contrast: more) {",
		"\t:root {",
		...colorVars(colorMoreContrast, changed).map((l) => `\t\t${l}`),
		"\t}",
		"}",
		"",
	];
	return lines.join("\n");
}
