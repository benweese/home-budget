// Runs axe (WCAG 2.2 AA rule tags) on every page of the built docs site, in Chromium, at desktop and iPhone
// widths. Also checks the project's 44px target rule (axe's WCAG 2.2
// rule only checks 24px); links inside running text are exempt, as WCAG 2.5.8 allows.
// Serves docs/.vitepress/dist under /home-budget/ with a tiny static server (no network), then fails on any
// problem and lists it in plain text. Run after `npm run build -w @home-budget/docs`.
import { readdir, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".vitepress", "dist");
const BASE = "/home-budget/";
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const TYPES = {
	".html": "text/html",
	".js": "text/javascript",
	".css": "text/css",
	".svg": "image/svg+xml",
	".json": "application/json",
	".woff2": "font/woff2",
};

/** Every built .html page, as a path under BASE. */
async function pages(dir, rel = "") {
	const out = [];
	for (const e of await readdir(dir, { withFileTypes: true })) {
		const r = path.posix.join(rel, e.name);
		if (e.isDirectory()) out.push(...(await pages(path.join(dir, e.name), r)));
		else if (e.name.endsWith(".html") && e.name !== "404.html")
			out.push(r.replace(/index\.html$/, "").replace(/\.html$/, ""));
	}
	return out;
}

const server = createServer(async (req, res) => {
	const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
	if (!url.startsWith(BASE)) return res.writeHead(404).end();
	let file = path.join(dist, url.slice(BASE.length));
	if (!path.extname(file)) file = url.endsWith("/") ? path.join(file, "index.html") : `${file}.html`;
	try {
		const body = await readFile(file);
		res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" }).end(body);
	} catch {
		res.writeHead(404).end();
	}
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const origin = `http://127.0.0.1:${server.address().port}`;

const list = await pages(dist);
const VIEWPORTS = [
	{ name: "desktop", viewport: { width: 1280, height: 900 } },
	{ name: "iphone", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
];
const browser = await chromium.launch();
let failures = 0;
let checks = 0;

/** Interactive elements smaller than 44×44 CSS px, skipping links inside running text. */
async function smallTargets(page) {
	return page.evaluate(() => {
		const out = [];
		for (const el of document.querySelectorAll(
			"a[href], button, input, select, textarea, [role=button], [tabindex]:not([tabindex='-1'])",
		)) {
			const r = el.getBoundingClientRect();
			const style = getComputedStyle(el);
			if (r.width === 0 || r.height === 0 || style.visibility === "hidden") continue;
			if (el.closest(".vp-doc p, .vp-doc li, .vp-doc td, .vp-doc th, .vp-doc blockquote, .custom-block p"))
				continue;
			if (el.matches(".header-anchor, .VPSkipLink")) continue;
			if (r.width < 44 || r.height < 44) {
				const label = (el.getAttribute("aria-label") || el.textContent || el.className || el.tagName)
					.trim()
					.replace(/\s+/g, " ")
					.slice(0, 40);
				out.push(`${el.tagName.toLowerCase()} "${label}" ${Math.round(r.width)}×${Math.round(r.height)}`);
			}
		}
		return out;
	});
}

async function report(where, page) {
	checks++;
	const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
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

for (const vp of VIEWPORTS) {
	const context = await browser.newContext({
		colorScheme: "dark",
		viewport: vp.viewport,
		isMobile: vp.isMobile ?? false,
		hasTouch: vp.hasTouch ?? false,
	});
	for (const p of list) {
		const page = await context.newPage();
		const response = await page.goto(`${origin}${BASE}${p}`);
		if (!response || !response.ok()) {
			console.log(`✗ [${vp.name}] ${BASE}${p}: HTTP ${response?.status() ?? "no response"}`);
			failures++;
			await page.close();
			continue;
		}
		await report(`[${vp.name}] ${BASE}${p}`, page);
		await page.close();
	}
	await context.close();
}
await browser.close();
server.close();
console.log(
	failures
		? `\n${failures} problem(s) in ${checks} checks.`
		: `\nNo automated violations found in ${checks} checks (${list.length} pages × desktop + iPhone widths; WCAG 2.2 AA rules + 44px targets).`,
);
process.exit(failures ? 1 : 0);
