import { defineProject } from "vitest/config";

// Pure helpers in Node. Component tests run in a real browser: vitest.components.config.ts.
export default defineProject({
	test: { name: "web", environment: "node", include: ["test/*.test.ts"] },
});
