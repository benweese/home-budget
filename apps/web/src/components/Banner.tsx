import type { ComponentChildren } from "preact";
import { Icon, type IconName } from "./Icon.tsx";

export type BannerTone = "info" | "caution" | "bad";

const bannerIcon: Record<BannerTone, IconName> = { info: "info", caution: "alert", bad: "cross" };

export interface BannerProps {
	tone: BannerTone;
	title: string;
	children?: ComponentChildren;
	/** True when the banner appears after the page has loaded, so it's announced (role="status"). */
	live?: boolean;
}

/** A page-wide notice. Only caution gets a full coloured fill (with charcoal text); the others use a border. */
export function Banner({ tone, title, children, live = false }: BannerProps) {
	return (
		<div class={`hb-banner hb-banner--${tone}`} role={live ? "status" : undefined}>
			<p class="hb-banner-title">
				<Icon name={bannerIcon[tone]} />
				{title}
			</p>
			{children && <div class="hb-banner-body">{children}</div>}
		</div>
	);
}
