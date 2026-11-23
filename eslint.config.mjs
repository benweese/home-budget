import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{ ignores: ["**/node_modules/", "**/dist/", "coverage/", "**/.wrangler/", "**/worker-configuration.d.ts"] },
	js.configs.recommended,
	tseslint.configs.strictTypeChecked,
	{
		languageOptions: {
			parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
		},
	},
	{ files: ["**/*.mjs"], extends: [tseslint.configs.disableTypeChecked] },
	prettier,
);
