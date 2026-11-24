// Writes tokens.css from src/tokens.ts. Run: npm run build:css -w @home-budget/ui-tokens
import { writeFileSync } from "node:fs";
import { renderCss } from "../src/css.ts";

writeFileSync(new URL("../tokens.css", import.meta.url), renderCss());
console.log("Wrote tokens.css");
