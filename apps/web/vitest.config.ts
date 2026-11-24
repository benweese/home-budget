import { defineProject } from "vitest/config";

// Pure helpers only for now; Preact component tests are set up with the component kit.
export default defineProject({
	test: { name: "web", environment: "node" },
});
