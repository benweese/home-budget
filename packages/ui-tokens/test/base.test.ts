import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

const css = readFileSync(new URL("../base.css", import.meta.url), "utf8");
const htmlRule = /\nhtml \{([^}]*)\}/.exec(css)?.[1] ?? "";

test("the root font is declared in the safe order: 100%, then -apple-system-body, then family + line height", () => {
	const order = ["font-size: 100%", "font: -apple-system-body", "font-family:", "line-height:"].map((d) =>
		htmlRule.indexOf(d),
	);
	expect(order.every((i) => i >= 0)).toBe(true);
	expect([...order].sort((a, b) => a - b)).toEqual(order);
});

test("the font is self-hosted from the npm package, Latin only, never a remote URL", () => {
	expect(css).toContain(
		"@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-normal.woff2",
	);
	expect(css).not.toMatch(/url\(["']?https?:/);
});

test("amounts use tabular numerals and Smart Invert has no special rules", () => {
	expect(css).toMatch(/\.hb-amount \{\s*font-variant-numeric: tabular-nums;/);
	expect(css).not.toMatch(/@media[^{]*inverted-colors/);
});
