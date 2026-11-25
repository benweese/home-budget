import { color } from "@home-budget/ui-tokens";
import { expect, test } from "vitest";
import { APP_NAME } from "../src/app-name.ts";
import html from "../index.html?raw";
import manifestText from "../public/manifest.webmanifest?raw";

interface ManifestIcon {
	src: string;
	sizes: string;
	type: string;
	purpose: string;
}

function isIcon(x: unknown): x is ManifestIcon {
	return (
		typeof x === "object" &&
		x !== null &&
		["src", "sizes", "type", "purpose"].every((k) => typeof Reflect.get(x, k) === "string")
	);
}

const manifest: unknown = JSON.parse(manifestText);
const field = (key: string): unknown =>
	typeof manifest === "object" && manifest !== null ? Reflect.get(manifest, key) : undefined;
const rawIcons = field("icons");
const icons: ManifestIcon[] = Array.isArray(rawIcons) ? rawIcons.filter(isIcon) : [];

// Every icon in public/icons as a base64 data URL (Vite inlines them), so no Node file APIs are needed.
const iconFiles = import.meta.glob<string>("../public/icons/*", {
	query: "?inline",
	import: "default",
	eager: true,
});
const iconData = (src: string): string | undefined => iconFiles[`../public${src}`];

/** Width × height from a PNG's IHDR chunk (bytes 16–23). */
function pngSize(src: string): string {
	const data = iconData(src) ?? "";
	const bytes = Uint8Array.from(atob(data.slice(data.indexOf(",") + 1, data.indexOf(",") + 1 + 44)), (c) =>
		c.charCodeAt(0),
	);
	const view = new DataView(bytes.buffer);
	return `${String(view.getUint32(16))}x${String(view.getUint32(20))}`;
}

test("the manifest's icons all parse", () => {
	expect(Array.isArray(rawIcons) && icons.length === rawIcons.length).toBe(true);
});

test("names, start, scope and display", () => {
	expect(field("name")).toBe(APP_NAME);
	expect(field("short_name")).toBe(APP_NAME);
	expect(APP_NAME.length).toBeLessThanOrEqual(12);
	expect(field("id")).toBe("/");
	expect(field("start_url")).toBe("/");
	expect(field("scope")).toBe("/");
	expect(field("display")).toBe("standalone");
});

test("no orientation lock (the app turns with the phone)", () => {
	expect(field("orientation")).toBeUndefined();
});

test("colours come from the tokens", () => {
	expect(field("background_color")).toBe(color.bg);
	expect(field("theme_color")).toBe(color.bg);
	expect(html).toContain(`<meta name="theme-color" content="${color.bg}" />`);
});

test("every icon file exists, and each PNG's real size matches its declared size", () => {
	for (const icon of icons) {
		expect(iconData(icon.src), icon.src).toBeDefined();
		if (icon.type === "image/png") expect(pngSize(icon.src), icon.src).toBe(icon.sizes);
	}
});

test("purposes: 192 and 512 as 'any', the maskable 512 on its own, never 'any maskable' on one icon", () => {
	for (const icon of icons) expect(["any", "maskable"]).toContain(icon.purpose);
	expect(icons.filter((i) => i.purpose === "any").map((i) => i.sizes)).toEqual(
		expect.arrayContaining(["192x192", "512x512"]),
	);
	expect(icons.filter((i) => i.purpose === "maskable").map((i) => i.sizes)).toEqual(["512x512"]);
});

test("index.html links the manifest, the icons and the iOS title", () => {
	expect(html).toContain('<link rel="manifest" href="/manifest.webmanifest" />');
	expect(html).toContain('<link rel="apple-touch-icon" href="/icons/budget-ben-icon-180.png" />');
	expect(pngSize("/icons/budget-ben-icon-180.png")).toBe("180x180");
	expect(html).toContain(`<meta name="apple-mobile-web-app-title" content="${APP_NAME}" />`);
});
