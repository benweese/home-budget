import type { ComponentChildren } from "preact";
import { Icon, type IconName } from "./Icon.tsx";

export type Tone = "good" | "tight" | "bad";

const toneIcon: Record<Tone, IconName> = { good: "check", tight: "alert", bad: "cross" };

export interface AnswerCardProps {
	tone: Tone;
	/** The answer in words, e.g. "Yes". The colour and icon only repeat it. */
	heading: string;
	children?: ComponentChildren;
	/** Heading level for the page outline (default 2). */
	level?: 2 | 3;
}

/** A dark card with a coloured left border, a coloured heading word and a decorative icon. */
export function AnswerCard({ tone, heading, children, level = 2 }: AnswerCardProps) {
	const H = level === 3 ? "h3" : "h2";
	return (
		<section class={`hb-answer hb-answer--${tone}`}>
			<H class="hb-answer-heading">
				<Icon name={toneIcon[tone]} />
				{heading}
			</H>
			{children && <div class="hb-answer-body">{children}</div>}
		</section>
	);
}
