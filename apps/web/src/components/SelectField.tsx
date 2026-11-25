import { useId } from "preact/hooks";

export interface SelectOption {
	value: string;
	label: string;
}

export interface SelectFieldProps {
	label: string;
	value: string;
	options: readonly SelectOption[];
	onChange: (value: string) => void;
	hint?: string;
}

/** A native select: the platform picker on iPhone, full keyboard and screen-reader support everywhere. */
export function SelectField({ label, value, options, onChange, hint }: SelectFieldProps) {
	const id = useId();
	const hintId = `${id}-hint`;
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
			<select
				id={id}
				class="hb-select"
				value={value}
				onChange={(e) => {
					onChange(e.currentTarget.value);
				}}
				aria-describedby={hint ? hintId : undefined}
			>
				{options.map((o) => (
					<option key={o.value} value={o.value}>
						{o.label}
					</option>
				))}
			</select>
		</div>
	);
}
