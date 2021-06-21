<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	import IconButton, { Icon } from '@smui/icon-button';
	import Button, { Label } from '@smui/button';

	import Svg from '@smui/common/Svg.svelte';

	import { mdiTrashCan } from '@mdi/js';

	import NotesEditor from '$lib/editor/notesEditor/index.svelte';

	export let notes: { id: string; note: string | number; name: string; color?: string }[] = [];

	const flipDurationMs = 300;
	function handleDndConsider(e) {
		notes = e.detail.items;
	}
	function handleDndFinalize(e) {
		notes = e.detail.items;
	}
</script>

<p>Choose your notes ♫</p>
<NotesEditor bind:notes />
{#if notes.length > 0}
	<IconButton
		class="btn-remove-all"
		title="Remove all notes"
		on:click={() => {
			notes = [];
		}}
	>
		<Icon component={Svg} viewBox="0 0 24 24">
			<path fill="currentColor" d={mdiTrashCan} />
		</Icon>
	</IconButton>
{/if}
<div
	class="notes-list"
	use:dndzone={{
		items: notes,
		flipDurationMs,
		dropTargetStyle: { 'background-color': '#00000010' }
	}}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each notes as note, i (note.id)}
		<div class="listItem" animate:flip={{ duration: flipDurationMs }}>
			<div class="listItem__left">
				<p class="listItem__title">{note.name}</p>
				<span class="listItem__2d">{note.note}</span>
			</div>

			<IconButton
				on:click={() => {
					notes = notes.filter((e) => e.id !== note.id);
				}}
				title="remove"
			>
				<Icon component={Svg} viewBox="0 0 24 24">
					<path fill="currentColor" d={mdiTrashCan} />
				</Icon>
			</IconButton>
		</div>
	{/each}
</div>

<style lang="scss">
	@use "../../../../mixins.scss";
	@use "../../../../theme.scss";

	.notes-list {
		border: thin solid rgba(0, 0, 0, 0.12);
	}
	.listItem {
		background: white;
		height: 64px;
		padding: 16px;
		display: flex;
		box-sizing: border-box;
		justify-content: space-between;
		border-bottom: thin solid rgba(0, 0, 0, 0.12);
		&__title {
			font-size: 16px;
			margin: 0;
		}
		&__2d {
			font-size: 14px;
			margin: 0;
			color: rgba(0, 0, 0, 0.54);
		}
		:global(.mdc-icon-button) {
			margin-top: -8px;
		}
	}
	:global(.btn-remove-all) {
		display: block;
		margin: 10px;
		margin-left: auto;
	}
</style>
