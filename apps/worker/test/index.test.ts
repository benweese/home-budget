import { exports } from "cloudflare:workers";
import { describe, expect, test } from "vitest";

describe("/api/health", () => {
	test("answers ok as JSON and is never cached", async () => {
		const res = await exports.default.fetch("https://example.com/api/health");
		expect(res.status).toBe(200);
		expect(res.headers.get("content-type")).toMatch(/^application\/json/);
		expect(res.headers.get("cache-control")).toBe("no-store");
		expect(await res.json()).toEqual({ status: "ok" });
	});

	test("sends the security headers", async () => {
		const res = await exports.default.fetch("https://example.com/api/health");
		expect(res.headers.get("content-security-policy")).toContain("default-src 'none'");
		expect(res.headers.get("content-security-policy")).toContain("frame-ancestors 'none'");
		expect(res.headers.get("x-content-type-options")).toBe("nosniff");
		expect(res.headers.get("referrer-policy")).toBe("no-referrer");
	});
});

test("unknown API paths are JSON 404s, for any method", async () => {
	for (const method of ["GET", "POST"]) {
		const res = await exports.default.fetch("https://example.com/api/nope", { method });
		expect(res.status).toBe(404);
		expect(await res.json()).toEqual({ error: "not found" });
	}
});
