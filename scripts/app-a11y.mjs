// Accessibility and security checks for the app shell, served the way it really runs: starts `wrangler dev`
// for apps/worker (Workers Static Assets serves apps/web/dist with its _headers, the Worker answers /api/*),
// waits for /api/health, runs the shared checks (scripts/a11y-check.mjs) including the CSP header, then
// stops wrangler. Run after `npm run app:build`.
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { finish, runA11yChecks } from "./a11y-check.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8799;
const origin = `http://127.0.0.1:${PORT}`;

const wrangler = spawn(
	"npx",
	["--no-install", "wrangler", "dev", "--port", String(PORT), "--ip", "127.0.0.1", "--log-level", "warn"],
	{
		cwd: path.join(root, "apps/worker"),
		env: { ...process.env, WRANGLER_SEND_METRICS: "false", CI: "true" },
		stdio: "inherit",
	},
);
const stop = () => wrangler.kill("SIGTERM");
process.on("exit", stop);

// Wait up to 60 s for the Worker to answer.
let ready = false;
for (let i = 0; i < 120 && !ready; i++) {
	try {
		const res = await fetch(`${origin}/api/health`);
		ready = res.ok;
	} catch {
		await new Promise((r) => setTimeout(r, 500));
	}
}
if (!ready) {
	console.log("✗ wrangler dev didn't answer /api/health within 60 s");
	stop();
	process.exit(1);
}

// The SPA fallback must serve the shell for an unknown, non-API path.
const fallback = await fetch(`${origin}/some/unknown/page`);
const fallbackOk = fallback.ok && (await fallback.text()).includes('id="app"');
console.log(
	fallbackOk
		? "✓ unknown paths get the app shell (SPA fallback)"
		: `✗ unknown path returned HTTP ${fallback.status} without the shell`,
);

// The shell must reach the Worker: its status line turns to "Connected".
const { chromium } = await import("playwright");
const smoke = await chromium.launch();
const smokePage = await smoke.newPage();
await smokePage.goto(`${origin}/`);
const connected = await smokePage
	.locator('[data-api-status="ok"]')
	.waitFor({ timeout: 10_000 })
	.then(() => true)
	.catch(() => false);
console.log(
	connected ? "✓ the shell reaches the API (status: Connected)" : "✗ the shell never showed Connected",
);

// Installable. Chromium must find and parse the manifest (DevTools Page.getAppManifest: URL found, no parse
// errors), and the parsed manifest must meet Chrome's install criteria: a name, start_url, a standalone-type
// display, and 192px + 512px "any" icons that load. (Page.getInstallabilityErrors isn't usable: in headless
// Chromium it returns no errors even with no manifest. Lighthouse dropped its PWA audit in v12.)
const installProblems = [];
const cdp = await smokePage.context().newCDPSession(smokePage);
const appManifest = await cdp.send("Page.getAppManifest");
if (!appManifest.url) installProblems.push("Chromium found no manifest link on the page");
for (const e of appManifest.errors ?? []) installProblems.push(`manifest parse error: ${e.message}`);
let parsed = {};
if (appManifest.url) {
	try {
		parsed = JSON.parse(appManifest.data);
	} catch {
		installProblems.push("manifest isn't valid JSON");
	}
}
const manifestRes = appManifest.url ? await fetch(appManifest.url) : undefined;
const manifestType = manifestRes?.headers.get("content-type") ?? "";
if (manifestRes && !/json/.test(manifestType)) installProblems.push(`manifest served as "${manifestType}"`);
if (!parsed.name && !parsed.short_name) installProblems.push("manifest has no name");
if (!parsed.start_url) installProblems.push("manifest has no start_url");
if (!["standalone", "fullscreen", "minimal-ui"].includes(parsed.display))
	installProblems.push(`display is "${parsed.display}", not standalone`);
const icons = Array.isArray(parsed.icons) ? parsed.icons : [];
for (const size of ["192x192", "512x512"]) {
	const icon = icons.find((i) => i.sizes === size && (i.purpose ?? "any").split(" ").includes("any"));
	if (!icon) installProblems.push(`no ${size} icon with purpose "any"`);
}
for (const icon of icons) {
	const res = await fetch(new URL(icon.src, appManifest.url || origin));
	if (!res.ok) installProblems.push(`icon ${icon.src}: HTTP ${res.status}`);
}
await smoke.close();
console.log(
	installProblems.length === 0
		? "✓ installable (Chromium finds and parses the manifest; name, start_url, standalone, 192 + 512 icons load)"
		: `✗ not installable:\n    ${installProblems.join("\n    ")}`,
);

const result = await runA11yChecks({
	origin,
	base: "/",
	pages: ["", "gallery", "some/unknown/page"],
	forcedPages: ["", "gallery"],
	inlineLinks: "main p",
	exemptTargets: ".skip-link",
	textSelector: "main h1, main h2, main h3, main p, main label, .site-header p, .site-footer p",
	chromeSelector: ".site-header *, .site-footer *",
	requireCsp: true,
});
stop();
finish(
	{
		failures:
			result.failures + (fallbackOk ? 0 : 1) + (connected ? 0 : 1) + (installProblems.length === 0 ? 0 : 1),
		checks: result.checks + 3,
	},
	"app shell under wrangler dev × desktop + iPhone widths",
);
