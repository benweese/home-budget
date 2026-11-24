/** WCAG 2.x contrast ratio between two `#rrggbb` colours (1 to 21). */
export function contrastRatio(a: string, b: string): number {
	const la = relativeLuminance(a);
	const lb = relativeLuminance(b);
	return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** WCAG 2.x relative luminance of a `#rrggbb` colour. */
export function relativeLuminance(hex: string): number {
	const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
	if (!m) throw new Error(`Not a #rrggbb colour: ${hex}`);
	const r = channel(m[1]);
	const g = channel(m[2]);
	const b = channel(m[3]);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Minimum ratios: text (WCAG 1.4.3 AA) and UI components / graphics (WCAG 1.4.11). */
export const MIN_TEXT = 4.5;
export const MIN_UI = 3;

/** One sRGB channel ("00"–"ff") to linear light. */
function channel(part: string | undefined): number {
	const c = parseInt(part ?? "0", 16) / 255;
	return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}
