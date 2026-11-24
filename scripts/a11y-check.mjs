// Shared accessibility and security checks, run in Chromium against a site that's already being served.
// Used by docs/scripts/axe.mjs (the docs site) and scripts/app-a11y.mjs (the app, under `wrangler dev`).
//
// For every page: axe (WCAG 2.2 AA rule tags) at desktop and iPhone widths, the project's 44px target rule
// (axe's WCAG 2.2 rule only checks 24px; links inside running text are exempt, as WCAG 2.5.8 allows), and no
// Content-Security-Policy violations (console or securitypolicyviolation events). Then: base styles (the root
// falls back to 16px and the self-hosted font loads), every page at the largest text size (310% root, iPhone
// width: no sideways scroll, nothing cut off), and forced colours.
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const VIEWPORTS = [
	{ name: "desktop", viewport: { width: 1280, height: 900 } },
	{ name: "iphone", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
];

/**
 * @typedef {object} Site
 * @property {string} origin e.g. "http://127.0.0.1:8788"
 * @property {string} base path prefix, e.g. "/" or "/home-budget/"
 * @property {string[]} pages paths under base ("" = home)
 * @property {string[]} forcedPages paths to check in forced colours
 * @property {string} inlineLinks selector for running text whose links are exempt from the 44px rule
 * @property {string} exemptTargets selector for targets exempt from the 44px rule (skip links, heading anchors)
 * @property {string} textSelector text that must not be cut off at the largest size
 * @property {string} chromeSelector fixed-height chrome (nav bars, sidebars) checked for clipping
 * @property {boolean} [requireCsp] fail if the page response has no Content-Security-Policy header
 */

/** Runs every check; returns { failures, checks }. Prints ✓ / ✗ lines as it goes. */
export async function runA11yChecks(/** @type {Site} */ site) {
	const browser = await chromium.launch();
	let failures = 0;
	let checks = 0;
	const url = (p) => `${site.origin}${site.base}${p}`;

	function extra(where, problems) {
		checks++;
		if (problems.length === 0) return console.log(`✓ ${where}`);
		failures++;
		console.log(`✗ ${where}`);
		for (const p of problems.slice(0, 5)) console.log(`    ${p}`);
	}

	/** Opens a page, collecting CSP violations from the console and securitypolicyviolation events. */
	async function open(context, p) {
		const page = await context.newPage();
		const csp = [];
		page.on("console", (m) => {
			if (/Content[- ]Security[- ]Policy/i.test(m.text())) csp.push(m.text().slice(0, 160));
		});
		await page.addInitScript(() => {
			document.addEventListener("securitypolicyviolation", (e) => {
				(window.__cspViolations ??= []).push(`${e.violatedDirective} blocked ${e.blockedURI || "inline"}`);
			});
		});
		const response = await page.goto(url(p));
		await page.waitForLoadState("networkidle");
		const fromEvents = await page.evaluate(() => window.__cspViolations ?? []);
		return { page, response, csp: [...new Set([...csp, ...fromEvents])] };
	}

	async function smallTargets(page) {
		return page.evaluate(
			({ inlineLinks, exemptTargets }) => {
				const out = [];
				for (const el of document.querySelectorAll(
					"a[href], button, input, select, textarea, [role=button], [tabindex]:not([tabindex='-1'])",
				)) {
					const r = el.getBoundingClientRect();
					const style = getComputedStyle(el);
					if (r.width === 0 || r.height === 0 || style.visibility === "hidden") continue;
					if (inlineLinks && el.closest(inlineLinks)) continue;
					if (exemptTargets && el.matches(exemptTargets)) continue;
					if (r.width < 44 || r.height < 44) {
						const label = (el.getAttribute("aria-label") || el.textContent || el.className || el.tagName)
							.trim()
							.replace(/\s+/g, " ")
							.slice(0, 40);
						out.push(`${el.tagName.toLowerCase()} "${label}" ${Math.round(r.width)}×${Math.round(r.height)}`);
					}
				}
				return out;
			},
			{ inlineLinks: site.inlineLinks, exemptTargets: site.exemptTargets },
		);
	}

	async function report(where, page, skipRules = []) {
		checks++;
		const { violations } = await new AxeBuilder({ page }).withTags(TAGS).disableRules(skipRules).analyze();
		const small = await smallTargets(page);
		if (violations.length === 0 && small.length === 0) return console.log(`✓ ${where}`);
		for (const v of violations) {
			failures++;
			console.log(`✗ ${where}: ${v.id} (${v.impact}) — ${v.help}`);
			for (const n of v.nodes.slice(0, 3))
				console.log(`    ${n.target.join(" ")}: ${n.failureSummary?.split("\n")[1]?.trim() ?? ""}`);
		}
		if (small.length) {
			failures++;
			console.log(`✗ ${where}: ${small.length} target(s) under 44×44px`);
			for (const t of process.env.A11Y_ALL ? small : small.slice(0, 5)) console.log(`    ${t}`);
		}
	}

	// Every page at both widths: axe + 44px targets + no CSP violations (+ the CSP header itself, if required).
	for (const vp of VIEWPORTS) {
		const context = await browser.newContext({
			colorScheme: "dark",
			viewport: vp.viewport,
			isMobile: vp.isMobile ?? false,
			hasTouch: vp.hasTouch ?? false,
		});
		for (const p of site.pages) {
			const where = `[${vp.name}] ${site.base}${p}`;
			const { page, response, csp } = await open(context, p);
			if (!response || !response.ok()) {
				extra(where, [`HTTP ${response?.status() ?? "no response"}`]);
				await page.close();
				continue;
			}
			await report(where, page);
			const cspProblems = [...csp];
			if (site.requireCsp && !response.headers()["content-security-policy"])
				cspProblems.unshift("no Content-Security-Policy header on the page");
			extra(`${where} CSP`, cspProblems);
			await page.close();
		}
		await context.close();
	}

	// Base styles in Chromium: -apple-system-body is Safari-only, so the root must fall back to 16px, and the
	// self-hosted font must load and be used.
	{
		const context = await browser.newContext({ colorScheme: "dark" });
		const { page } = await open(context, site.pages[0] ?? "");
		await page.evaluate(() => document.fonts.ready);
		const base = await page.evaluate(() => ({
			rootSize: getComputedStyle(document.documentElement).fontSize,
			fontLoaded: document.fonts.check('16px "Atkinson Hyperlegible Next Variable"'),
			family: getComputedStyle(document.body).fontFamily,
		}));
		extra(
			"[chromium] root font-size falls back to 16px",
			base.rootSize === "16px" ? [] : [`root font-size is ${base.rootSize}`],
		);
		extra(
			"[chromium] Atkinson Hyperlegible Next is loaded and used",
			base.fontLoaded && base.family.includes("Atkinson Hyperlegible Next")
				? []
				: [`loaded=${base.fontLoaded}, body font-family=${base.family}`],
		);
		await context.close();
	}

	// Largest text: root font at 310% (about iOS's biggest Accessibility size) at iPhone width.
	{
		const context = await browser.newContext({
			colorScheme: "dark",
			viewport: { width: 390, height: 844 },
			isMobile: true,
			hasTouch: true,
		});
		for (const p of site.pages) {
			const { page } = await open(context, p);
			// Through the CSSOM, not an injected <style>: the app's strict CSP (style-src 'self') blocks inline styles.
			await page.evaluate(() => document.documentElement.style.setProperty("font-size", "310%", "important"));
			const problems = await page.evaluate(
				({ textSelector, chromeSelector }) => {
					const out = [];
					const doc = document.documentElement;
					if (doc.scrollWidth > doc.clientWidth + 1)
						out.push(`page scrolls sideways (${doc.scrollWidth}px > ${doc.clientWidth}px)`);
					for (const el of document.querySelectorAll(textSelector)) {
						const style = getComputedStyle(el);
						const clips = ["hidden", "clip"].includes(style.overflowX) || style.textOverflow === "ellipsis";
						if (clips && el.scrollWidth > el.clientWidth + 1)
							out.push(`text cut off: "${(el.textContent ?? "").trim().slice(0, 40)}"`);
					}
					// Fixed-height chrome: any clipping box whose content is taller or wider than the box.
					for (const el of chromeSelector ? document.querySelectorAll(chromeSelector) : []) {
						const style = getComputedStyle(el);
						const r = el.getBoundingClientRect();
						if (r.width === 0 || r.height === 0 || style.visibility === "hidden") continue;
						// Screen-reader-only text is clipped on purpose; a box with no text hides nothing readable.
						if (el.matches(".visually-hidden, .sr-only") || !(el.textContent ?? "").trim()) continue;
						const clipsY = ["hidden", "clip"].includes(style.overflowY);
						const clipsX = ["hidden", "clip"].includes(style.overflowX);
						if (
							(clipsY && el.scrollHeight > el.clientHeight + 1) ||
							(clipsX && el.scrollWidth > el.clientWidth + 1)
						)
							out.push(
								`clipped in ${el.className || el.tagName}: "${(el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40)}"`,
							);
					}
					return out;
				},
				{ textSelector: site.textSelector, chromeSelector: site.chromeSelector },
			);
			extra(`[largest text] ${site.base}${p}`, problems);
			await page.close();
		}
		await context.close();
	}

	// Forced colours (Windows High Contrast and similar).
	{
		const context = await browser.newContext({
			forcedColors: "active",
			viewport: { width: 1280, height: 900 },
		});
		for (const p of site.forcedPages) {
			const { page } = await open(context, p);
			// axe's color-contrast rule reads the author colours, not the forced system palette Chromium actually
			// draws (e.g. LinkText on Canvas), so it reports false failures here. In forced colours the system sets
			// contrast; every other rule still runs.
			await report(`[forced colours] ${site.base}${p}`, page, ["color-contrast"]);
			await page.close();
		}
		await context.close();
	}

	await browser.close();
	return { failures, checks };
}

/** Prints the summary line and exits with 1 on any failure. */
export function finish({ failures, checks }, what) {
	console.log(
		failures
			? `\n${failures} problem(s) in ${checks} checks.`
			: `\nNo automated violations found in ${checks} checks (${what}; WCAG 2.2 AA rules, 44px targets, CSP, largest text, forced colours, base styles).`,
	);
	process.exit(failures ? 1 : 0);
}
