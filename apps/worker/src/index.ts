/** Stub Worker. The Hono app that serves the front end replaces this later. */
export default {
	fetch(): Response {
		return new Response("ok");
	},
} satisfies ExportedHandler;
