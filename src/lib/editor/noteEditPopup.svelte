<script lang="ts">
	import Textfield from '@smui/textfield';
	import Dialog, { Title, Content, Actions, InitialFocus } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import { uniqueID } from '$lib/helpers';
	import { isNumber } from 'tone';

	let open = false;
	let resolve: ((value: INote | PromiseLike<INote>) => void) | undefined;
	let note: INote = {
		label: '',
		note: '',
		id: uniqueID(),
		color: `hsl(360, 100%, 71%)`,
		keys: []
	};

	export function editNote(default_note: INote) {
		note = default_note;
		if (!note.color.startsWith('#'))
			note.color = hslToHex(
				...(note.color
					.replace('%', '')
					.replace('%', '')
					.replace('hsl(', '')
					.replace(')', '')
					.split(', ')
					.map((e) => parseInt(e)) as [number, number, number])
			);
		console.log(note);
		open = true;
		return new Promise<INote>((resolve_) => (resolve = resolve_));
	}

	function hslToHex(h, s, l) {
		l /= 100;
		const a = (s * Math.min(l, 1 - l)) / 100;
		const f = (n) => {
			const k = (n + h / 30) % 12;
			const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
			return Math.round(255 * color)
				.toString(16)
				.padStart(2, '0'); // convert to Hex and prefix "0" if needed
		};
		return `#${f(0)}${f(8)}${f(4)}`;
	}
</script>

<Dialog bind:open aria-labelledby="row-duration" aria-describedby="chose a duration for this row">
	<Title id="slider-title">row duration</Title>
	<Content id="slider-content">
		<Textfield variant="outlined" bind:value={note.label} label="Note label" />

		{#if isNumber(note.note)}
			<Textfield variant="outlined" bind:value={note.note} type="number" label="Note label" />
		{:else}
			<Textfield variant="outlined" bind:value={note.note} label="Note label" />
		{/if}

		<Textfield variant="outlined" bind:value={note.color} type="color" label="Note color" />
	</Content>
	<Actions>
		<Button action="accept" on:click={() => resolve?.(note)}>
			<Label>Done</Label>
		</Button>
	</Actions>
</Dialog>

<style lang="scss">
	// :global(.mdc-dialog .mdc-dialog__surface) {
	// 	width: 350px;
	// }
	:global(.mdc-text-field) {
		margin-top: 1em !important;
		width: 100%;
	}
</style>
