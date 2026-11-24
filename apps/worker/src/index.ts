import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";

/**
 * The home-budget Worker. Static files (the built front end in apps/web/dist) are served by Workers Static
 * Assets before this code runs; only `/api/*` reaches the Worker (`run_worker_first` in wrangler.jsonc), and
 * any other unknown path falls back to the app's index.html.
 */
const app = new Hono();

app.use(
	"/api/*",
	secureHeaders({
		contentSecurityPolicy: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] },
		referrerPolicy: "no-referrer",
		crossOriginOpenerPolicy: "same-origin",
		permissionsPolicy: { camera: [], microphone: [], geolocation: [] },
	}),
);

/** Liveness check for the shell and the e2e smoke tests. Never cached. */
app.get("/api/health", (c) => {
	c.header("Cache-Control", "no-store");
	return c.json({ status: "ok" });
});

/** Unknown API paths are JSON 404s, never the HTML shell. */
app.all("/api/*", (c) => c.json({ error: "not found" }, 404));

export default app;
