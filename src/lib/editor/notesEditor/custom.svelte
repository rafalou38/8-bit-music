<script lang="ts">
	import Button from '@smui/button';
	import TextField from '@smui/textfield';

	import { uniqueID } from '$lib/helpers';
	import { browser } from '$app/env';

	export let notes: { id: string; note: string | number; name: string }[] = [];

	let note = '';
	let name = '';
	function insertCustomNote() {
		notes = [
			...notes,
			{
				note: note.match(/^\d+$/) ? parseInt(note) : note,
				name: name,
				id: uniqueID()
			}
		];
	}
</script>

<p>insert a note or a frequency</p>

{#if browser}
	<TextField
		id="note"
		class="input"
		label="note/frequency"
		placeholder="you can also use latin notes"
		variant="outlined"
		bind:value={note}
	/>

	<TextField
		id="note"
		class="input"
		label="display name"
		placeholder={'leave empty ' + (note ? 'for ' + note : 'to be the same as the note')}
		variant="outlined"
		bind:value={name}
	/>
{/if}
<Button class="generate-btn" block depressed on:click={insertCustomNote}>Insert</Button>
