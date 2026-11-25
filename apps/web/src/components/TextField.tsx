import { useId } from "preact/hooks";
import { Icon } from "./Icon.tsx";

export interface TextFieldProps {
	label: string;
	value: string;
	onInput: (value: string) => void;
	/** Extra help under the label, read out with the field. */
	hint?: string;
	/** An error in words. Sets aria-invalid; the message sits in a live region so it's announced when it appears. */
	error?: string;
	inputMode?: "text" | "decimal" | "numeric" | "email" | "search";
	autoComplete?: string;
}

export function TextField({ label, value, onInput, hint, error, inputMode, autoComplete }: TextFieldProps) {
	const id = useId();
	const hintId = `${id}-hint`;
	const errorId = `${id}-error`;
	const describedBy = [hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined;
	return (
		<div class="hb-field">
			<label class="hb-label" for={id}>
				{label}
			</label>
			{hint && (
				<p id={hintId} class="hb-hint">
					{hint}
				</p>
			)}
			<input
				id={id}
				class="hb-input"
				type="text"
				value={value}
				onInput={(e) => {
					onInput(e.currentTarget.value);
				}}
				inputMode={inputMode}
				autoComplete={autoComplete}
				aria-invalid={error ? "true" : undefined}
				aria-describedby={describedBy}
			/>
			<p class="hb-error" aria-live="polite">
				{error && (
					<span id={errorId} class="hb-error-text">
						<Icon name="alert" />
						{error}
					</span>
				)}
			</p>
		</div>
	);
}
