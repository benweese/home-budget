import { exports } from "cloudflare:workers";
import { expect, test } from "vitest";

test("the stub Worker answers ok", async () => {
	const response = await exports.default.fetch("https://example.com/");
	expect(response.status).toBe(200);
	expect(await response.text()).toBe("ok");
});
