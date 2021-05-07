<script lang="ts">
	import BasicEditor from './basic.svelte';

	import Select, { Option } from '@smui/select';
	import Button from '@smui/button';
	import TextField from '@smui/textfield';

	import { uniqueID } from '$lib/helpers';
	import { browser } from '$app/env';

	// console.log(scale.names());

	const modes = ['basic', 'advanced', 'custom', 'import'];
	let mode = '';

	export let notes: { id: string; note: string | number; name: string }[] = [];

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

<Select class="input" placeholder="mode" variant="outlined" bind:value={mode} label="insert mode">
	<Option value="" />
	{#each modes as mode}
		<Option value={mode}>{mode}</Option>
	{/each}
</Select>

{#if mode == 'basic'}
	<!-- <label for="min-octave">min octave</label> -->
	<BasicEditor />
{:else if mode == 'advanced'}
	<!-- else if content here -->
{:else if mode == 'custom'}
	<p>insert a note/frequency</p>
	<label for="min-octave">note/frequency</label>
	{#if browser}
		<TextField
			id="note"
			class="input"
			placeholder="you can also use latin notes"
			solo
			bind:value={customNote}
		/>
		<label for="min-octave">display name</label>
		<TextField
			id="note"
			class="input"
			placeholder={'leave empty ' +
				(customNote ? 'for ' + customNote : 'to be the same as the note')}
			solo
			bind:value={customName}
		/>
	{/if}
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
	:global(.input) {
		display: flex;
		margin-bottom: 8px;
	}
</style>
