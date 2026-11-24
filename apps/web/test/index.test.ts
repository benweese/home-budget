import { expect, test } from "vitest";
import { appName } from "../src/index.ts";

test("the placeholder loads", () => {
	expect(appName).toBe("home-budget");
});
