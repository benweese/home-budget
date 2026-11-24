import { expect, test } from "vitest";
import { APP_NAME } from "../src/app-name.ts";
import html from "../index.html?raw";

// index.html can't import APP_NAME, so this keeps the two copies in step when the name changes.

test("index.html's <title> matches APP_NAME", () => {
	const title = /<title>([^<]*)<\/title>/.exec(html);
	expect(title, "index.html has no plain <title>…</title>").not.toBeNull();
	expect(title?.[1]).toBe(APP_NAME);
});

test("index.html's <noscript> message uses APP_NAME", () => {
	const noscript = /<noscript>([^<]*)<\/noscript>/.exec(html);
	expect(noscript, "index.html has no plain <noscript>…</noscript>").not.toBeNull();
	expect(noscript?.[1]).toContain(APP_NAME);
});
