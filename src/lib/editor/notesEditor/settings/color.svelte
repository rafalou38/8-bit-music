<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	import IconButton, { Icon } from '@smui/icon-button';
	import Button, { Label } from '@smui/button';

	import Svg from '@smui/common/Svg.svelte';

	import { mdiTrashCan } from '@mdi/js';

	import NotesEditor from '$lib/editor/notesEditor/index.svelte';
	import { map } from '$lib/helpers';

	import convert from 'color-convert';

	export let notes: { id: string; note: string | number; name: string; color?: string }[] = [];

	function autoColor() {
		notes = notes.map((note, i) => {
			return {
				...note,
				color: '#' + convert.hsl.hex(Math.floor(map(i, 0, notes.length, 0, 360)), 100, 71)
			};
		});
		console.log(notes);
	}
</script>

<p>set color 🎨</p>

<Button variant="raised" color="secondary" on:click={autoColor}>Auto color 🖌️</Button>

<div class="notes-list">
	{#each notes as note}
		<div class="listItem">
			<div class="listItem__left">
				<p class="listItem__title">{note.name}</p>
			</div>

			<input type="color" bind:value={note.color} />
		</div>
	{/each}
</div>

<style lang="scss">
	.notes-list {
		margin-top: 2em;
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
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
		:global(.mdc-icon-button) {
			margin-top: -8px;
		}
	}
</style>
