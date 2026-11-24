import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { APP_NAME } from "./app-name.ts";
import { checkHealth, statusText, type ApiStatus } from "./health.ts";

const apiStatus = signal<ApiStatus>("checking");

/** The app shell: skip link, header, main content and footer. No business logic yet. */
export function App() {
	useEffect(() => {
		document.title = APP_NAME;
		void checkHealth().then((s) => (apiStatus.value = s));
	}, []);

	return (
		<>
			<a class="skip-link" href="#main">
				Skip to main content
			</a>
			<header class="site-header">
				<p class="app-name">{APP_NAME}</p>
			</header>
			<main id="main" tabIndex={-1} class="layout">
				<h1 class="page-title">Home</h1>
				<section class="card" aria-labelledby="empty-title">
					<h2 id="empty-title">Nothing here yet</h2>
					<p>This is the app's starting point. Features arrive in later steps.</p>
				</section>
				<section class="card" aria-labelledby="status-title">
					<h2 id="status-title">Status</h2>
					<p role="status" data-api-status={apiStatus.value}>
						{statusText[apiStatus.value]}
					</p>
				</section>
			</main>
			<footer class="site-footer">
				<p>
					<a href="https://github.com/benweese/home-budget">Source code</a>
				</p>
			</footer>
		</>
	);
}
