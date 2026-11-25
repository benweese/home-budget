/** Small inline icons drawn in currentColor, so they follow the text colour and forced colours. Always
 * decorative here (aria-hidden): the words next to them carry the meaning. */
export type IconName = "check" | "alert" | "cross" | "info";

const paths: Record<IconName, string> = {
	check: "M5 12.5l4.5 4.5L19 7.5",
	alert: "M12 6v8M12 18h.01",
	cross: "M7 7l10 10M17 7L7 17",
	info: "M12 11v7M12 6h.01",
};

export function Icon({ name }: { name: IconName }) {
	return (
		<svg
			class="hb-icon"
			viewBox="0 0 24 24"
			width="1em"
			height="1em"
			aria-hidden="true"
			focusable="false"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d={paths[name]} />
		</svg>
	);
}
