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
	let key_progess = 0;
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

	let last_time: number | undefined;
	let last_notes = [];
	function loop() {
		if (playing) {
			let target = 1;
			current_row = Math.max(current_row, 0);

			let elapsed_seconds = (Date.now() - last_time) / 1000;
			key_progess = Math.min(Math.max((elapsed_seconds / target) * 100, 0), 100);
			if (elapsed_seconds >= target || last_time === undefined) {
				if (current_row >= keys_count) {
					if (!looping) {
						playing = false;
					}
					current_row = -1;
					return;
				}
				let next = [];
				notes.forEach((note, i) => {
					let key = note.keys[Math.min(current_row, keys_count - 1)].active;
					if (key) {
						next.push(note.note);
					}
				});
				if (smooth) {
					synth.triggerRelease(last_notes);
					synth.triggerAttack(next);
				} else {
					synth.triggerAttackRelease(next, target);
				}

				last_notes = next;
				last_time = Date.now();
				current_row += 1;
				key_progess = 0;
			}
		} else {
			if (synth) {
				if (synth.activeVoices) {
					synth.triggerRelease(last_notes);
				}
			}
		}
	}
	interval = setInterval(loop, 10);
</script>

<div class="wrapper">
	<ToolBar bind:this={EToolBar} bind:looping bind:playing />
	<input type="checkbox" bind:checked={multiple_alowed} />
	<pre>{keys_count}</pre>
	<Board
		bind:notes
		bind:keys_count
		{multiple_alowed}
		bind:current_row
		bind:key_progess
		setProgress={(i) => {
			key_progess = 0;
			current_row = i;
			last_time = undefined;
		}}
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
