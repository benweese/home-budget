import { expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { Button } from "../../src/components/Button.tsx";
import { mount } from "./render.tsx";

test("click, Enter and Space all press an available button", async () => {
	const onPress = vi.fn();
	mount(<Button onPress={onPress}>Save</Button>);
	const button = page.getByRole("button", { name: "Save" });
	await button.click();
	button.element().focus();
	await userEvent.keyboard("{Enter}");
	await userEvent.keyboard(" ");
	expect(onPress).toHaveBeenCalledTimes(3);
});

test("an unavailable button never calls its handler: click, Enter or Space", async () => {
	const onPress = vi.fn();
	mount(
		<Button onPress={onPress} unavailableReason="Fill in a name first.">
			Add it
		</Button>,
	);
	const button = page.getByRole("button", { name: "Add it" });
	await button.click({ force: true });
	button.element().focus();
	await userEvent.keyboard("{Enter}");
	await userEvent.keyboard(" ");
	expect(onPress).not.toHaveBeenCalled();
});

test("an unavailable button stays focusable, is aria-disabled and has its reason linked and visible", async () => {
	mount(
		<Button onPress={() => {}} unavailableReason="Fill in a name first.">
			Add it
		</Button>,
	);
	const button = page.getByRole("button", { name: "Add it" });
	await expect.element(button).toHaveAttribute("aria-disabled", "true");
	await expect.element(button).not.toHaveAttribute("disabled");
	await expect.element(button).toHaveAccessibleDescription("Fill in a name first.");
	await expect.element(page.getByText("Fill in a name first.")).toBeVisible();
	button.element().focus();
	expect(document.activeElement).toBe(button.element());
});

test("an available button has no aria-disabled and no description", async () => {
	mount(<Button onPress={() => {}}>Save</Button>);
	const button = page.getByRole("button", { name: "Save" });
	await expect.element(button).not.toHaveAttribute("aria-disabled");
	await expect.element(button).not.toHaveAttribute("aria-describedby");
});
