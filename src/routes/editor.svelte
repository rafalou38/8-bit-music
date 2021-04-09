<script lang="ts">
	import Board from '$lib/editor/board.svelte';
	import ToolBar from '$lib/editor/toolBar.svelte';
	import { map, uniqueID } from '$lib/helpers';
	import { onDestroy, onMount } from 'svelte';

	import * as Tone from 'tone';
	let synth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>;
	onMount(() => {
		if (!synth) {
			synth = new Tone.PolySynth().toDestination();
		}
	});

	let keys_count = 5;
	let multiple_alowed = false;
	let current_row = -1;
	let playing: boolean;
	let looping: boolean;

	let interval: NodeJS.Timeout;

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

	onDestroy(() => {
		playing = false;
	});

	let last_time = 0;
	let i = 0;
	function loop() {
		if (playing) {
			let target = 0.3;

			if (i >= keys_count) {
				if (!looping) {
					playing = false;
					current_row = -1;
				}
				i = 0;
			}

			if ((Date.now() - last_time) / 1000 >= target) {
				let next = [];
				current_row = i % keys_count;
				notes.forEach((note, i) => {
					let key = note.keys[current_row].active;
					if (key) {
						next.push(note.note);
					}
				});
				synth.triggerAttackRelease(next, 0.2);
				last_time = Date.now();
				i += 1;
			}
		}
	}
	interval = setInterval(loop, 100);
	async function play() {
		// debugger;
		// if (playing) {
		// 	i = 0;
		// 	last_time = 0;
		// }
	}

	function handleAction(action: 'add' | 'delete' | 'settings' | 'clock' | 'play' | 'pause') {
		switch (action) {
			case 'play':
				play();
				break;

			default:
				break;
		}
	}
</script>

<div class="wrapper">
	<ToolBar onAction={handleAction} bind:this={EToolBar} bind:looping bind:playing />
	<input type="checkbox" bind:checked={multiple_alowed} />
	<pre>{keys_count}</pre>
	<Board bind:notes bind:keys_count {multiple_alowed} {current_row} />
</div>

<style lang="scss">
	.wrapper {
		width: 100%;
		height: 100%;
		overflow: auto;
		position: absolute;
	}
</style>
