import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { renderCss } from "../src/css.ts";
import { space, targetMin, text } from "../src/tokens.ts";

test("the committed tokens.css matches src/tokens.ts (run npm run build:css after changing tokens)", () => {
	expect(readFileSync(new URL("../tokens.css", import.meta.url), "utf8")).toBe(renderCss());
});

test("the stylesheet sets every token family and the Increase Contrast overrides", () => {
	const css = renderCss();
	expect(css).toContain("--hb-color-bg: #16181d;");
	expect(css).toContain("--hb-space-4: 1rem;");
	expect(css).toContain("--hb-radius-card: 0.75rem;");
	expect(css).toContain(`--hb-target-min: ${targetMin};`);
	expect(css).toMatch(
		/@media \(prefers-contrast: more\) \{\n\t:root \{\n\t\t--hb-color-text-muted: #efece6;/,
	);
});

test("every type and spacing size is in rem, so it follows Dynamic Type and the browser's font size", () => {
	for (const value of [...Object.values(text), ...Object.values(space)])
		expect(value).toMatch(/^\d+(\.\d+)?rem$/);
});
