import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: [
			"**/node_modules/",
			"**/dist/",
			"coverage/",
			"**/.wrangler/",
			"**/worker-configuration.d.ts",
			"docs/.vitepress/dist/",
			"docs/.vitepress/cache/",
		],
	},
	js.configs.recommended,
	tseslint.configs.strictTypeChecked,
	{
		languageOptions: {
			parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
		},
	},
	{
		files: ["**/*.mjs"],
		extends: [tseslint.configs.disableTypeChecked],
		languageOptions: { globals: globals.node },
	},
	// The docs axe script also runs code in the browser through page.evaluate().
	{ files: ["docs/scripts/**/*.mjs"], languageOptions: { globals: { ...globals.node, ...globals.browser } } },
	prettier,
);
