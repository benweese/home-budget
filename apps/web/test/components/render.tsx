import "@home-budget/ui-tokens/tokens.css";
import "@home-budget/ui-tokens/base.css";
import "../../src/components/components.css";
import { render, type ComponentChild } from "preact";
import { afterEach } from "vitest";

const roots: HTMLElement[] = [];

/** Renders into a fresh container in the real document; cleaned up after each test. */
export function mount(ui: ComponentChild): HTMLElement {
	const root = document.createElement("div");
	document.body.append(root);
	roots.push(root);
	render(ui, root);
	return root;
}

afterEach(() => {
	for (const root of roots.splice(0)) {
		render(null, root);
		root.remove();
	}
});
