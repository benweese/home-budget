import { defineConfig } from "vitepress";

// Docs site (= the project wiki), published to GitHub Pages under /home-budget/. Always dark (brand tokens in
// theme/custom.css). Edited only through pull requests.
export default defineConfig({
	title: "home-budget",
	description: "A simple family cash-flow app on Cloudflare Workers + D1, accessible by default.",
	lang: "en-US",
	base: "/home-budget/",
	cleanUrls: true,
	lastUpdated: true,
	appearance: "force-dark",
	srcExclude: ["README.md", "scripts/**"],
	head: [["meta", { name: "color-scheme", content: "dark" }]],
	themeConfig: {
		nav: [
			{ text: "Overview", link: "/" },
			{ text: "Decisions", link: "/adr/" },
			{ text: "Accessibility", link: "/accessibility" },
		],
		sidebar: [
			{
				text: "About",
				items: [
					{ text: "Overview", link: "/" },
					{ text: "Supported devices", link: "/devices" },
					{ text: "Accessibility", link: "/accessibility" },
				],
			},
			{
				text: "Decisions (ADRs)",
				link: "/adr/",
				items: [
					{ text: "0001 Record decisions", link: "/adr/0001-record-architecture-decisions" },
					{ text: "0002 Stack", link: "/adr/0002-stack" },
					{ text: "0003 npm workspaces", link: "/adr/0003-npm-workspaces" },
					{ text: "0004 Plain CSS custom properties", link: "/adr/0004-css-custom-properties" },
					{ text: "0005 Unit test runner", link: "/adr/0005-unit-test-runner" },
					{ text: "0006 Money in integer cents", link: "/adr/0006-money-integer-cents" },
					{ text: "0007 TypeScript strictness", link: "/adr/0007-typescript-strictness" },
					{
						text: "0008 Squash merge + releases",
						link: "/adr/0008-squash-conventional-commits-release-please",
					},
					{ text: "0009 Actions supply chain", link: "/adr/0009-actions-supply-chain" },
					{ text: "0010 Typography", link: "/adr/0010-typography-and-reader-settings" },
					{ text: "0011 Serving + CSP", link: "/adr/0011-serving-and-security-headers" },
				],
			},
		],
		// No search for now: VitePress's local search dialog fails axe (nested interactive controls, label/name
		// mismatch), and the sidebar covers a site this size. Revisit with VitePress 2.
		socialLinks: [
			{ icon: "github", link: "https://github.com/benweese/home-budget", ariaLabel: "home-budget on GitHub" },
		],
		editLink: {
			pattern: "https://github.com/benweese/home-budget/edit/main/docs/:path",
			text: "Suggest a change to this page",
		},
		outline: { level: [2, 3] },
	},
});
