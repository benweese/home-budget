import preact from "@preact/preset-vite";
import { playwright } from "@vitest/browser-playwright";
import { defineProject } from "vitest/config";

// Component tests in a real browser (Vitest browser mode, Playwright's Chromium): behaviour, keyboard and
// accessibility wiring. Pure helpers stay in the Node project (vitest.config.ts).
export default defineProject({
	plugins: [preact({ prefreshEnabled: false })],
	resolve: { dedupe: ["preact"] },
	test: {
		name: "web-components",
		include: ["test/components/**/*.test.tsx"],
		browser: {
			enabled: true,
			headless: true,
			provider: playwright(),
			instances: [{ browser: "chromium" }],
		},
	},
});
