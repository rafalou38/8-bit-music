<script lang="ts">
	import Button from '@smui/button';
	import TextField from '@smui/textfield';

	import { uniqueID } from '$lib/helpers';
	import { browser } from '$app/env';

	export let notes: { id: string; note: string | number; name: string }[] = [];

	let octaveMin = '4';
	let octaveMax = '4';
	let basicNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

	function generate() {
		const min = parseInt(octaveMin);
		const max = parseInt(octaveMax);

		if (min < -1 || max > 9 || min > max) return;

		let newNotes = notes;
		for (let i = min; i <= max; i++) {
			basicNotes.forEach((note) => {
				newNotes.push({ name: note + i, note: note + i, id: uniqueID() });
			});
		}
		notes = newNotes;
	}
</script>

{#if browser}
	<TextField
		id="min-octave"
		class="input"
		label="min octave"
		variant="outlined"
		placeholder="number beetwen -1 and 9"
		type="number"
		input$max="9"
		input$min="-1"
		on:change={() => {
			if (octaveMin > octaveMax) octaveMax = octaveMin;
		}}
		bind:value={octaveMin}
	/>

	<!-- <label for="max-octave">max octave</label> -->
	<TextField
		id="max-octave"
		class="input"
		label="max octave"
		variant="outlined"
		placeholder="number beetwen -1 and 9"
		type="number"
		input$max="9"
		input$min="-1"
		on:change={() => {
			if (octaveMin > octaveMax) octaveMin = octaveMax;
		}}
		bind:value={octaveMax}
	/>
{/if}
<Button class="generate-btn" block depressed on:click={generate}>Insert</Button>
