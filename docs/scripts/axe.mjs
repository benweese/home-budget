// Runs axe (WCAG 2.2 AA rule tags) on every page of the built docs site, in Chromium.
// Serves docs/.vitepress/dist under /home-budget/ with a tiny static server (no network), then fails on any
// violation and lists them in plain text. Run after `npm run build -w @home-budget/docs`.
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
const browser = await chromium.launch();
const context = await browser.newContext({ colorScheme: "dark" });
let failures = 0;
for (const p of list) {
	const page = await context.newPage();
	const response = await page.goto(`${origin}${BASE}${p}`);
	if (!response || !response.ok()) {
		console.log(`✗ ${BASE}${p}: HTTP ${response?.status() ?? "no response"}`);
		failures++;
		continue;
	}
	const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
	if (violations.length === 0) console.log(`✓ ${BASE}${p}`);
	for (const v of violations) {
		failures++;
		console.log(`✗ ${BASE}${p}: ${v.id} (${v.impact}) — ${v.help}`);
		for (const n of v.nodes.slice(0, 3))
			console.log(`    ${n.target.join(" ")}: ${n.failureSummary?.split("\n")[1]?.trim() ?? ""}`);
	}
	await page.close();
}
await browser.close();
server.close();
console.log(
	failures
		? `\n${failures} problem(s) on ${list.length} pages.`
		: `\nNo automated violations found on ${list.length} pages (WCAG 2.2 AA rules).`,
);
process.exit(failures ? 1 : 0);
