import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

// Builds the front end into dist/, which the Worker serves as static assets (see apps/worker/wrangler.jsonc).
export default defineConfig({
	plugins: [preact()],
	// One Preact in the bundle. The docs workspace pulls in Preact 10 (through VitePress) and npm hoists it to the
	// repo root, so without this @preact/signals resolves that copy and signal updates never re-render the app's
	// Preact 11 components.
	resolve: { dedupe: ["preact"] },
	build: { outDir: "dist", emptyOutDir: true, sourcemap: true },
});
