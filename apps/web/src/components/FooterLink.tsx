import type { ComponentChildren } from "preact";

/** A link sized as a 44px target, for footers and lists of links (not for links inside running text). */
export function FooterLink({ href, children }: { href: string; children: ComponentChildren }) {
	return (
		<a class="hb-footer-link" href={href}>
			{children}
		</a>
	);
}
