<script lang="ts">
	import Select, { Option } from '@smui/select';
	import Textfield from '@smui/textfield';
	import Select, { Option } from '@smui/select';

	import { Select, Button, TextField } from 'svelte-materialify';
	import scale from 'music-scale';
	import { uniqueID } from '$lib/helpers';

	// console.log(scale.names());

	const modes = ['basic', 'advanced', 'custom', 'import'];
	let mode = 'basic';

	export let notes: { id: string; note: string | number; name: string }[] = [];

	const intValidator = (e: number | string) => {
		return e !== '' ? true : 'please enter a number';
	};
	const minValidator = (v: number) => {
		return (e: string) => {
			return parseInt(e) < v ? `${e} is smaller than ${v}` : true;
		};
	};
	const maxValidator = (v: number) => {
		return (e: string) => {
			return parseInt(e) > v ? `${e} is bigger than ${v}` : true;
		};
	};

	let basicMin = '4';
	let basicMax = '4';
	let basicNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

	function generateBasic() {
		const min = parseInt(basicMin);
		const max = parseInt(basicMax);

		if (min < -1 || max > 9 || min > max) return;

		let newNotes = notes;
		for (let i = min; i <= max; i++) {
			basicNotes.forEach((note) => {
				newNotes.push({ name: note + i, note: note + i, id: uniqueID() });
			});
		}
		notes = newNotes;
	}

	let customNote = '';
	let customName = '';
	function insertCustomNote() {
		notes = [
			...notes,
			{
				note: customNote.match(/^\d+$/) ? parseInt(customNote) : customNote,
				name: customName,
				id: uniqueID()
			}
		];
	}
</script>

<Select
	solo
	items={modes.map((e) => {
		return { name: e, value: e };
	})}
	placeholder="mode"
	bind:value={mode}
/>

{#if mode == 'basic'}
	<label for="min-octave">min octave</label>
	<TextField
		id="min-octave"
		placeholder="number beetwen -1 and 9"
		solo
		type="number"
		max="9"
		min="-1"
		rules={[intValidator, minValidator(-1), maxValidator(9)]}
		bind:value={basicMin}
	/>
	<label for="max-octave">max octave</label>
	<TextField
		id="max-octave"
		placeholder="number beetwen -1 and 9"
		solo
		type="number"
		max="9"
		min="-1"
		rules={[intValidator, minValidator(-1), maxValidator(9)]}
		bind:value={basicMax}
	/>
	<Button class="generate-btn" block depressed on:click={generateBasic}>Insert</Button>
{:else if mode == 'advanced'}
	<!-- else if content here -->
{:else if mode == 'custom'}
	<p>insert a note/frequency</p>
	<label for="min-octave">note/frequency</label>
	<TextField id="note" placeholder="you can also use latin notes" solo bind:value={customNote} />
	<label for="min-octave">display name</label>
	<TextField
		id="note"
		placeholder={'leave empty ' + (customNote ? 'for ' + customNote : 'to be the same as the note')}
		solo
		bind:value={customName}
	/>
	<Button class="generate-btn" block depressed on:click={insertCustomNote}>Insert</Button>
{:else}
	<p>Choose a mode to insert notes</p>
{/if}

<style lang="scss">
	@use '../../theme.scss';
	@use '../../mixins.scss';

	label {
		margin-top: 5px;
		color: rgb(100, 100, 100);
	}
	:global(.generate-btn) {
		display: block;
		margin: 1em auto;
		background: theme.$primary !important;
		color: white !important;
	}
</style>
