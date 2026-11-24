import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineProject } from "vitest/config";

// Runs tests inside workerd with the bindings from wrangler.jsonc.
export default defineProject({
	plugins: [cloudflareTest({ wrangler: { configPath: "./wrangler.jsonc" } })],
	test: { name: "worker" },
});
