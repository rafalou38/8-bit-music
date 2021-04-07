<script lang="ts">
	import Board from '$lib/editor/board.svelte';
	import ToolBar from '$lib/editor/topBar.svelte';
	import { map, uniqueID } from '$lib/helpers';

	let keys_count = 30;
	let multiple_alowed = false;
	let rawNotes = [
		'C1',
		'D1',
		'E1',
		'F1',
		'G1',
		'A1',
		'B1',
		'C2',
		'D2',
		'E2',
		'F2',
		'G2',
		'A2',
		'B2',
		'C3',
		'D3',
		'E3',
		'F3',
		'G3',
		'A3',
		'B3',
		'C4',
		'D4',
		'E4',
		'F4',
		'G4',
		'A4',
		'B4',
		'C5',
		'D5',
		'E5',
		'F5',
		'G5',
		'A5'
	];
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
	function handleAction(action: 'add' | 'delete' | 'settings' | 'clock' | 'play' | 'pause') {
		console.log({ action, playing: EToolBar.playing, looping: EToolBar.looping });
	}
</script>

<div class="wrapper">
	<ToolBar onAction={handleAction} bind:this={EToolBar} />
	<input type="checkbox" bind:checked={multiple_alowed} />

	<Board {notes} {keys_count} {multiple_alowed} />
</div>

<style lang="scss">
	.wrapper {
		width: 100%;
		height: 100%;
		overflow: auto;
		position: absolute;
	}
</style>
