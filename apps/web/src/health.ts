/** What the shell shows about the API. */
export type ApiStatus = "checking" | "ok" | "unavailable";

/** Asks the Worker's health route. Anything but `{ status: "ok" }` counts as unavailable. */
export async function checkHealth(fetchFn: typeof fetch = fetch): Promise<ApiStatus> {
	try {
		const res = await fetchFn("/api/health", { cache: "no-store" });
		if (!res.ok) return "unavailable";
		const body: unknown = await res.json();
		return typeof body === "object" && body !== null && "status" in body && body.status === "ok"
			? "ok"
			: "unavailable";
	} catch {
		return "unavailable";
	}
}

/** The words for each status (never colour alone). */
export const statusText: Record<ApiStatus, string> = {
	checking: "Checking the connection…",
	ok: "Connected",
	unavailable: "Can't reach the server right now",
};
