import { useEffect, useState } from "preact/hooks";
import { AnswerCard } from "./components/AnswerCard.tsx";
import { Banner } from "./components/Banner.tsx";
import { Button } from "./components/Button.tsx";
import { FooterLink } from "./components/FooterLink.tsx";
import { SelectField } from "./components/SelectField.tsx";
import { TextField } from "./components/TextField.tsx";

/**
 * Every component in every state, on one page, so the app CI job checks them all (axe, 44px targets, CSP,
 * largest text, forced colours). Not linked from the app; noindex. Made-up sample data only.
 */
export function Gallery() {
	const [name, setName] = useState("Weekend market");
	const [note, setNote] = useState("");
	const [choice, setChoice] = useState("weekly");
	const [presses, setPresses] = useState(0);

	useEffect(() => {
		document.title = "Component gallery";
		const meta = document.createElement("meta");
		meta.name = "robots";
		meta.content = "noindex";
		document.head.append(meta);
		return () => {
			meta.remove();
		};
	}, []);

	return (
		<>
			<h1 class="page-title">Component gallery</h1>

			<section class="card gallery-section" aria-labelledby="g-buttons">
				<h2 id="g-buttons">Buttons</h2>
				<div class="gallery-row">
					<Button
						onPress={() => {
							setPresses((n) => n + 1);
						}}
					>
						Save
					</Button>
					<Button variant="secondary" onPress={() => {}}>
						Cancel
					</Button>
				</div>
				<div class="gallery-row">
					<Button onPress={() => {}} unavailableReason="Fill in a name first.">
						Add it
					</Button>
				</div>
				<p>Pressed {presses} times.</p>
			</section>

			<section class="card gallery-section" aria-labelledby="g-fields">
				<h2 id="g-fields">Fields</h2>
				<TextField label="List name" value={name} onInput={setName} autoComplete="off" />
				<TextField
					label="Note"
					hint="Optional. Shown under the entry."
					value={note}
					onInput={setNote}
					autoComplete="off"
				/>
				<TextField label="Store" value="" onInput={() => {}} error="Type a store name." autoComplete="off" />
				<SelectField
					label="How often"
					hint="Pick the closest."
					value={choice}
					onChange={setChoice}
					options={[
						{ value: "weekly", label: "Every week" },
						{ value: "monthly", label: "Every month" },
						{ value: "once", label: "Just once" },
					]}
				/>
			</section>

			<section class="card gallery-section" aria-labelledby="g-answers">
				<h2 id="g-answers">Answer cards</h2>
				<AnswerCard tone="good" heading="Yes" level={3}>
					<p>There's room for this one.</p>
				</AnswerCard>
				<AnswerCard tone="tight" heading="Check first" level={3}>
					<p>It fits, but it's close.</p>
				</AnswerCard>
				<AnswerCard tone="bad" heading="Not right now" level={3}>
					<p>Try again after the next payday.</p>
				</AnswerCard>
			</section>

			<section class="card gallery-section" aria-labelledby="g-banners">
				<h2 id="g-banners">Banners</h2>
				<Banner tone="info" title="New: weekly summary">
					<p>It's on the home page.</p>
				</Banner>
				<Banner tone="caution" title="Numbers may be out of date">
					<p>The last update was a while ago.</p>
				</Banner>
				<Banner tone="bad" title="Couldn't save">
					<p>Check the connection and try again.</p>
				</Banner>
			</section>

			<section class="card gallery-section" aria-labelledby="g-links">
				<h2 id="g-links">Footer link</h2>
				<FooterLink href="/">Back to home</FooterLink>
			</section>
		</>
	);
}
