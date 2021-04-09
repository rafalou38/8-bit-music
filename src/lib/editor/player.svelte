<svelte:options accessors={true} />

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import * as Tone from 'tone';
	let synth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>;
	onMount(() => {
		if (!synth) {
			synth = new Tone.PolySynth().toDestination();
		}
	});

	export let keys_count = 5;
	export let current_row = -1;
	export let key_progess = 0;
	export let playing: boolean;
	export let looping: boolean;
	export let smooth = true;

	export let notes: INote[] = [];

	let last_time: number | undefined;
	let last_notes = [];
	let paused = false;

	onDestroy(() => {
		playing = false;
	});

	export function setProgress(index: number) {
		current_row = index - 1;
		key_progess = 0;
		last_time = -1;
		playing = true;
		paused = false;
	}
	export function play() {
		playing = true;
	}
	export function pause() {
		paused = true;

		synth?.triggerRelease(last_notes);
	}
	function loop() {
		if (playing) {
			let target = 1;

			let elapsed_seconds = (Date.now() - last_time) / 1000;
			key_progess = Math.min(Math.max((elapsed_seconds / target) * 100, 0), 100);
			if (elapsed_seconds >= target || last_time === undefined || paused) {
				if (paused) {
					current_row -= 1;
				}
				current_row += 1;

				if (current_row >= keys_count) {
					if (!looping) {
						playing = false;
						synth?.triggerRelease(last_notes);
					}
					current_row = -1;
					return;
				}
				let next = [];
				notes.forEach((note, i) => {
					let key = note.keys[current_row].active;
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

				key_progess = 0;
				paused = false;
			}
		}
	}
	setInterval(loop, 10);
</script>
