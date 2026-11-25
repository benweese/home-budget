import type { ComponentChildren } from "preact";
import { useId } from "preact/hooks";

export interface ButtonProps {
	children: ComponentChildren;
	/** Called on click, Enter or Space, but never while the button is unavailable. */
	onPress: () => void;
	variant?: "primary" | "secondary";
	/**
	 * Why the button can't act yet. When set, the button stays focusable but is `aria-disabled`, the reason is
	 * shown next to it (linked with aria-describedby), and presses do nothing. There's no greyed-out disabled
	 * style: it can't be focused, gives no reason and fails contrast.
	 */
	unavailableReason?: string;
}

export function Button({ children, onPress, variant = "primary", unavailableReason }: ButtonProps) {
	const reasonId = useId();
	const unavailable = unavailableReason !== undefined && unavailableReason !== "";
	return (
		<span class="hb-button-wrap">
			<button
				type="button"
				class={`hb-button hb-button--${variant}`}
				aria-disabled={unavailable ? "true" : undefined}
				aria-describedby={unavailable ? reasonId : undefined}
				onClick={(event) => {
					if (unavailable) {
						event.preventDefault();
						return;
					}
					onPress();
				}}
			>
				{children}
			</button>
			{unavailable && (
				<span id={reasonId} class="hb-button-reason">
					{unavailableReason}
				</span>
			)}
		</span>
	);
}
