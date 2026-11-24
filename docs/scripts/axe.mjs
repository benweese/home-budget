// Accessibility checks for the built docs site: serves docs/.vitepress/dist under /home-budget/ with a tiny
// static server (no network) and runs the shared checks (scripts/a11y-check.mjs). GitHub Pages can't send a
// CSP header, so only CSP violations are checked here, not the header. Run after `npm run docs:build`.
import { readdir, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { finish, runA11yChecks } from "../../scripts/a11y-check.mjs";

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".vitepress", "dist");
const BASE = "/home-budget/";
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

const list = await pages(dist);
const result = await runA11yChecks({
	origin: `http://127.0.0.1:${server.address().port}`,
	base: BASE,
	pages: list,
	forcedPages: ["", "adr/0005-unit-test-runner"],
	inlineLinks: ".vp-doc p, .vp-doc li, .vp-doc td, .vp-doc th, .vp-doc blockquote, .custom-block p",
	exemptTargets: ".header-anchor, .VPSkipLink",
	textSelector: ".vp-doc p, .vp-doc li, .vp-doc h1, .vp-doc h2, .vp-doc h3, .vp-doc td, .VPSidebarItem .text",
	chromeSelector: ".VPNav *, .VPLocalNav *, .VPSidebar *",
});
server.close();
finish(result, `${list.length} docs pages × desktop + iPhone widths`);
