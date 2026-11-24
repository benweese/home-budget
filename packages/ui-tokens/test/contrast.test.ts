import { describe, expect, test } from "vitest";
import { contrastRatio, MIN_TEXT, MIN_UI } from "../src/contrast.ts";
import { pairs } from "../src/pairs.ts";
import { color, colorMoreContrast } from "../src/tokens.ts";

describe("contrastRatio", () => {
	test("matches the WCAG reference values", () => {
		expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
		expect(contrastRatio("#777777", "#777777")).toBe(1);
		expect(contrastRatio("#767676", "#ffffff")).toBeCloseTo(4.54, 2);
	});

	test("rejects colours that aren't #rrggbb", () => {
		expect(() => contrastRatio("red", "#ffffff")).toThrow(/Not a #rrggbb/);
	});

	test("a pair too close in lightness fails the text threshold (the check can fail)", () => {
		expect(contrastRatio("#777777", "#888888")).toBeLessThan(MIN_TEXT);
	});
});

describe.each([
	["default", color],
	["Increase Contrast", colorMoreContrast],
])("every pairing in use meets its minimum (%s)", (_mode, palette) => {
	test.each(pairs.map((p) => [p.use, p] as const))("%s", (_use, p) => {
		expect(contrastRatio(palette[p.fg], palette[p.bg])).toBeGreaterThanOrEqual(p.min);
	});
});

describe("explicit checks", () => {
	test.each([
		["border", "bg"],
		["border", "surfaceRaised"],
		["focus", "bg"],
		["focus", "surfaceRaised"],
	] as const)("%s clears 3:1 on %s", (fg, bg) => {
		expect(contrastRatio(color[fg], color[bg])).toBeGreaterThanOrEqual(MIN_UI);
	});

	test("Increase Contrast only makes things stronger", () => {
		expect(colorMoreContrast.textMuted).toBe(color.text);
		expect(contrastRatio(colorMoreContrast.border, color.surfaceRaised)).toBeGreaterThan(
			contrastRatio(color.border, color.surfaceRaised),
		);
	});
});
