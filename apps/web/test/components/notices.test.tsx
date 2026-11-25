import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { AnswerCard } from "../../src/components/AnswerCard.tsx";
import { Banner } from "../../src/components/Banner.tsx";
import { FooterLink } from "../../src/components/FooterLink.tsx";
import { mount } from "./render.tsx";

test.each(["good", "tight", "bad"] as const)(
	"a %s answer card says its answer in words; the icon is hidden",
	async (tone) => {
		const root = mount(<AnswerCard tone={tone} heading="Some answer" />);
		await expect.element(page.getByRole("heading", { level: 2, name: "Some answer" })).toBeVisible();
		const svg = root.querySelector("svg");
		expect(svg?.getAttribute("aria-hidden")).toBe("true");
		expect(svg?.getAttribute("focusable")).toBe("false");
	},
);

test("an answer card can sit lower in the outline", async () => {
	mount(<AnswerCard tone="good" heading="Yes" level={3} />);
	await expect.element(page.getByRole("heading", { level: 3, name: "Yes" })).toBeVisible();
});

test("a banner is announced only when it's live", () => {
	const staticRoot = mount(<Banner tone="info" title="Static" />);
	const liveRoot = mount(<Banner tone="caution" title="Live" live />);
	expect(staticRoot.querySelector("[role='status']")).toBeNull();
	expect(liveRoot.querySelector("[role='status']")?.textContent).toContain("Live");
});

test("a footer link is a real link at least 44px tall", async () => {
	mount(<FooterLink href="/">Back to home</FooterLink>);
	const link = page.getByRole("link", { name: "Back to home" });
	await expect.element(link).toHaveAttribute("href", "/");
	expect(link.element().getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
});
