<script lang="ts">
	import sc from 'music-scale';
	import dict from 'scale-dictionary';
	import { basic as basic_notes } from './notes';

	import TextField from '@smui/textfield';
	import Button from '@smui/button';

	import SearchableField from '$lib/searchableField.svelte';
	import { uniqueID } from '$lib/helpers';
	let scale_name = '';
	let scale_name_valid = false;
	let base_note = '';
	let base_note_valid = false;

	let octaveMin = '4';
	let octaveMax = '4';

	export let notes: { id: string; note: string | number; name: string }[] = [];

	function generate() {
		let scale: string[] = sc(scale_name, base_note);
		let final: { id: string; note: string | number; name: string }[] = [];
		for (let i = parseInt(octaveMin); i <= parseInt(octaveMax); i++) {
			scale.forEach((e) => {
				final.push({ id: uniqueID(), name: e + i, note: e + i });
			});
		}
		notes = [...notes, ...final];
	}
</script>

<SearchableField
	label="scale"
	bind:value={scale_name}
	choices={Object.keys(dict)}
	bind:valid={scale_name_valid}
/>

{#if scale_name_valid}
	<SearchableField
		label="base note"
		bind:value={base_note}
		choices={basic_notes}
		bind:valid={base_note_valid}
	/>
{/if}
{#if scale_name_valid && base_note_valid && base_note && scale_name}
	<p>{sc(scale_name, base_note).join('\t')}</p>
	<div class="inline-wrapper">
		<TextField
			id="min-octave"
			class="input inline"
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
			class="input inline"
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
	</div>
	<Button class="generate-btn" block depressed on:click={generate}>Insert</Button>
{/if}

<style lang="scss">
	:global(.mdc-text-field.inline) {
		display: inline-block;
		width: 100%;
	}
	.inline-wrapper {
		display: flex;
		gap: 0.5em;
	}
	p {
		color: #000000a6;
	}
</style>
