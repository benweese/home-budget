import { defineConfig } from "vitest/config";

// Each workspace has its own vitest.config.ts (Worker code runs in workerd via
// @cloudflare/vitest-plugin; build-time packages run in Node). Coverage is
// Istanbul: the Workers integration doesn't support V8 coverage.
export default defineConfig({
	test: {
		projects: ["packages/*", "apps/*", "apps/web/vitest.components.config.ts"],
		coverage: {
			provider: "istanbul",
			reporter: ["text", "lcov"],
			include: ["packages/*/src/**", "apps/*/src/**"],
		},
	},
});
