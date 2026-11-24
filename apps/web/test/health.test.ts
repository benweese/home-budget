import { expect, test } from "vitest";
import { checkHealth, statusText } from "../src/health.ts";

const reply =
	(status: number, body: unknown): typeof fetch =>
	() =>
		Promise.resolve(new Response(JSON.stringify(body), { status }));

const offline: typeof fetch = () => Promise.reject(new Error("offline"));

test("ok only when the health route answers { status: 'ok' }", async () => {
	expect(await checkHealth(reply(200, { status: "ok" }))).toBe("ok");
	expect(await checkHealth(reply(200, { status: "down" }))).toBe("unavailable");
	expect(await checkHealth(reply(500, { status: "ok" }))).toBe("unavailable");
	expect(await checkHealth(reply(200, null))).toBe("unavailable");
});

test("a network failure is unavailable, not a crash", async () => {
	expect(await checkHealth(offline)).toBe("unavailable");
});

test("every status has words (never colour alone)", () => {
	for (const text of Object.values(statusText)) expect(text.length).toBeGreaterThan(0);
});
