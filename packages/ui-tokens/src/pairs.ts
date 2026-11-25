import { MIN_TEXT, MIN_UI } from "./contrast.ts";
import type { ColorName } from "./tokens.ts";

/** A foreground/background pairing the UI uses, with the minimum contrast it must meet. */
export interface Pair {
	fg: ColorName;
	bg: ColorName;
	min: number;
	use: string;
}

const surfaces = ["bg", "surfaceRaised"] as const;
const textColours = ["text", "textMuted", "brand", "good", "tight", "bad"] as const;

/** Every pairing in use. Add a pair here whenever a new combination appears in the UI. */
export const pairs: readonly Pair[] = [
	...surfaces.flatMap((bg) =>
		textColours.map((fg) => ({ fg, bg, min: MIN_TEXT, use: `${fg} text on ${bg}` })),
	),
	{ fg: "onBrand", bg: "brand", min: MIN_TEXT, use: "button text on periwinkle" },
	{ fg: "onBrand", bg: "tight", min: MIN_TEXT, use: "caution banner text on amber" },
	...surfaces.flatMap((bg) => [
		{ fg: "border" as const, bg, min: MIN_UI, use: `control outline on ${bg}` },
		{ fg: "focus" as const, bg, min: MIN_UI, use: `focus ring on ${bg}` },
	]),
];
