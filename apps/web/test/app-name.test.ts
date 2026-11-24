import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { APP_NAME } from "../src/app-name.ts";

// index.html can't import APP_NAME, so this keeps the two copies in step when the name changes.
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("index.html's <title> matches APP_NAME", () => {
	expect(/<title>([^<]*)<\/title>/.exec(html)?.[1]).toBe(APP_NAME);
});

test("index.html's <noscript> message uses APP_NAME", () => {
	expect(/<noscript>([^<]*)<\/noscript>/.exec(html)?.[1]).toContain(APP_NAME);
});
