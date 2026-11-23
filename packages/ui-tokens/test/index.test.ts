import { expect, test } from "vitest";
import { tokenPackage } from "../src/index.ts";

test("the package loads", () => {
	expect(tokenPackage).toBe("@home-budget/ui-tokens");
});
