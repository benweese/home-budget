import { expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { SelectField } from "../../src/components/SelectField.tsx";
import { TextField } from "../../src/components/TextField.tsx";
import { mount } from "./render.tsx";

test("a text field is labelled, describes its hint, and reports typing", async () => {
	const onInput = vi.fn();
	mount(<TextField label="Note" hint="Optional." value="" onInput={onInput} />);
	const input = page.getByRole("textbox", { name: "Note" });
	await expect.element(input).toHaveAccessibleDescription("Optional.");
	await expect.element(input).not.toHaveAttribute("aria-invalid");
	await userEvent.type(input, "ab");
	expect(onInput).toHaveBeenLastCalledWith("ab");
});

test("an error sets aria-invalid, is part of the description, and sits in a live region", async () => {
	mount(<TextField label="Store" value="" onInput={() => {}} error="Type a store name." />);
	const input = page.getByRole("textbox", { name: "Store" });
	await expect.element(input).toHaveAttribute("aria-invalid", "true");
	await expect.element(input).toHaveAccessibleDescription("Type a store name.");
	const message = page.getByText("Type a store name.");
	await expect.element(message).toBeVisible();
	expect(message.element().closest("[aria-live='polite']")).not.toBeNull();
});

test("the live region exists before an error appears, so the error is announced", () => {
	const root = mount(<TextField label="Store" value="" onInput={() => {}} />);
	expect(root.querySelector("[aria-live='polite']")).not.toBeNull();
});

test("a select is a native, labelled combobox and reports changes", async () => {
	const onChange = vi.fn();
	mount(
		<SelectField
			label="How often"
			hint="Pick the closest."
			value="weekly"
			onChange={onChange}
			options={[
				{ value: "weekly", label: "Every week" },
				{ value: "monthly", label: "Every month" },
			]}
		/>,
	);
	const select = page.getByRole("combobox", { name: "How often" });
	await expect.element(select).toHaveAccessibleDescription("Pick the closest.");
	expect(select.element().tagName).toBe("SELECT");
	await userEvent.selectOptions(select, "monthly");
	expect(onChange).toHaveBeenCalledWith("monthly");
});
