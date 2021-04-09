<script lang="ts">
	import Board from '$lib/editor/board.svelte';
	import ToolBar from '$lib/editor/toolBar.svelte';
	import Player from '$lib/editor/player.svelte';
	import { map, uniqueID } from '$lib/helpers';

	let keys_count = 5;
	let multiple_alowed = false;
	let current_row = -1;
	let key_progess = 0;

	let playing: boolean;
	let looping: boolean;
	let smooth = true;

	let rawNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
	let notes: INote[] = [];
	for (let i = 0; i < rawNotes.length; i++) {
		const note = rawNotes[i];
		notes.push({
			label: note,
			note: note,
			id: uniqueID(),
			color: `hsl(${map(i, 0, rawNotes.length, 0, 360)}, 100%, 71%)`,
			keys: []
		});
	}

	let EToolBar: ToolBar;
	let EPlayer: Player;

	function handleAction(actionType: 'add' | 'delete' | 'settings' | 'clock' | 'play' | 'pause') {
		if (actionType == 'play') {
			EPlayer?.play();
		} else if (actionType == 'pause') {
			EPlayer?.pause();
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
		} else {
			console.log(event.key);
		}
		current_row = Math.min(Math.max(current_row, -1), keys_count);
	}
</script>

<Player
	bind:this={EPlayer}
	bind:current_row
	bind:key_progess
	bind:playing
	{keys_count}
	{looping}
	{smooth}
	{notes}
/>

<svelte:body on:keydown={handleShortcut} />

<div class="wrapper">
	<ToolBar bind:this={EToolBar} bind:looping bind:playing onAction={handleAction} />
	<input type="checkbox" bind:checked={multiple_alowed} />
	<pre>{keys_count}</pre>
	<Board
		bind:notes
		bind:keys_count
		{multiple_alowed}
		bind:current_row
		bind:key_progess
		setProgress={EPlayer?.setProgress}
	/>
</div>

<style lang="scss">
	.wrapper {
		width: 100%;
		height: 100%;
		overflow: auto;
		position: absolute;
	}
</style>
