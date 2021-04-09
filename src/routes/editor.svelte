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
	let smooth = true;

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
	let last_notes = [];
	function loop() {
		if (playing) {
			let target = 0.3;

			if (current_row + 1 >= keys_count) {
				if (!looping) {
					playing = false;
				}
				current_row = -1;
			}

			if ((Date.now() - last_time) / 1000 >= target) {
				let next = [];
				notes.forEach((note, i) => {
					let key = note.keys[current_row + 1].active;
					if (key) {
						next.push(note.note);
					}
				});
				if (smooth) {
					synth.triggerRelease(last_notes);
					synth.triggerAttack(next);
				} else {
					synth.triggerAttackRelease(next, 0.2);
				}

				last_notes = next;
				last_time = Date.now();
				current_row += 1;
			}
		} else {
			if (synth) {
				if (synth.activeVoices) {
					synth.triggerRelease(last_notes);
				}
			}
		}
	}
	interval = setInterval(loop, 100);
</script>

<div class="wrapper">
	<ToolBar bind:this={EToolBar} bind:looping bind:playing />
	<input type="checkbox" bind:checked={multiple_alowed} />
	<pre>{keys_count}</pre>
	<Board bind:notes bind:keys_count {multiple_alowed} bind:current_row />
</div>

<style lang="scss">
	.wrapper {
		width: 100%;
		height: 100%;
		overflow: auto;
		position: absolute;
	}
</style>
