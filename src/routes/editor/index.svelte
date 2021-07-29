<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { decode } from '$lib/serialization';

	export const load: Load = ({ page }) => {
		const encoded_notes: string | null = page.query.get('notes');
		if (encoded_notes === null) return {};

		const decoded = decode(encoded_notes.replace(/\s+/g, '+'));
		return { props: { decoded_notes: decoded.data } };
	};
</script>

<script lang="ts">
	import Board from '$lib/editor/board.svelte';
	import ToolBar from '$lib/editor/toolBar.svelte';
	import Player from '$lib/editor/player.svelte';
	import { map, uniqueID } from '$lib/helpers';
	import { addKey, notes } from '$lib/stores';
	import { default_key } from '$lib/stores/notes';

	let multiple_alowed = false;
	let current_row = -1;
	let key_progess = 0;

	let playing: boolean;
	let looping: boolean;
	let loop_positions: [number, number];
	let smooth = true;
	let speed = 1;

	let rawNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];

	export let decoded_notes: INote[] | undefined = undefined;

	if (decoded_notes) {
		notes.set(decoded_notes);
	}
	notes.update((notes_) => {
		if (notes_.length !== 0) return notes_;

		return rawNotes.reduce((acc, note, i) => {
			acc.push({
				label: note,
				note: note,
				id: uniqueID(),
				color: `hsl(${map(i, 0, rawNotes.length, 0, 360)}, 100%, 71%)`,
				keys: Array(5).fill(null).map(default_key)
			});
			return acc;
		}, []);
	});

	let EToolBar: ToolBar;
	let EPlayer: Player;

	function handleAction(actionType: 'add' | 'delete' | 'settings' | 'clock' | 'play' | 'pause') {
		if (actionType == 'play') {
			EPlayer?.play();
		} else if (actionType == 'pause') {
			EPlayer?.pause();
		} else if (actionType == 'clock') {
			speed = parseFloat(prompt('new speed', speed.toString()));
		}
	}
	function handleShortcut(event: KeyboardEvent & { currentTarget: EventTarget & HTMLElement }) {
		if (event.key === 'ArrowRight') {
			EPlayer?.pause();
			key_progess = 0;
			current_row++;
			EPlayer?.play();
		} else if (event.key === 'ArrowLeft') {
			EPlayer?.pause();
			key_progess = 0;
			current_row--;
			EPlayer?.play();
		} else if (event.key === ' ') {
			if (playing) {
				playing = false;
				EPlayer?.pause();
			} else {
				playing = true;
				EPlayer?.play();
			}
		} else if (event.key === '+') {
			addKey();
		}
		current_row = Math.min(Math.max(current_row, -1), $notes[0]?.keys.length);
	}
</script>

<Player
	bind:this={EPlayer}
	bind:current_row
	bind:key_progess
	bind:playing
	{speed}
	{loop_positions}
	{looping}
	{smooth}
/>

<svelte:body on:keydown={handleShortcut} />

<ToolBar bind:this={EToolBar} bind:looping bind:playing bind:speed onAction={handleAction} />
<div class="wrapper">
	<Board
		bind:loop={loop_positions}
		bind:looping
		{multiple_alowed}
		bind:current_row
		bind:key_progess
		setProgress={EPlayer?.setProgress}
	/>
</div>
<slot />

<style lang="scss">
	@use '../../theme.scss';
	.wrapper {
		width: 100%;
		height: calc(100% - 50px);
		margin-top: 50px;
		overflow: auto;
		position: absolute;

		background: theme.$editor-bg;
	}
</style>
