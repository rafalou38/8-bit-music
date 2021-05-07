<script lang="ts">
	import { browser } from '$app/env';
	import TextField from '@smui/textfield';
	import Button, { Label } from '@smui/button';
	import posible_notes from './notes.ts';
	import { uniqueID } from '$lib/helpers';

	export let notes: { id: string; note: string | number; name: string }[] = [];
	let name = '';
</script>

{#if browser}
	<TextField id="note" class="input" label="note" variant="outlined" bind:value={name} />
	{#key name}
		{#if name}
			{#each posible_notes as note}
				{#if note.toLowerCase().match(name.toLowerCase())}
					<Button
						color="secondary"
						on:click={() => {
							notes = [...notes, { id: uniqueID(), name: note, note }];
						}}
					>
						<Label>{note}</Label>
					</Button>
				{/if}
			{/each}
		{/if}
	{/key}
{/if}
