<script lang="ts">
	import Labels from './labels.svelte';

	import { uniqueID } from '$lib/helpers';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import * as Tone from 'tone';
	let synth: Tone.Synth<Tone.SynthOptions>;
	let sliding = false;
	export let keys_count = 5;
	export let multiple_alowed = false;
	export let notes: INote[] = [];
	export let current_row = -1;
	export let key_progess = 0;

	export let setProgress: (i: number) => void;

	export let loop: [number | null, number | null] = [1, 3];
	export let looping = false;
	onMount(() => {
		synth = new Tone.Synth().toDestination();
	});

	function default_key() {
		return { duration: 1, id: uniqueID(), active: false };
	}

	async function toggle_key(ny: number, ky: number) {
		await Tone.start();
		let newNotes = notes;
		const key = notes[ny].keys[ky];
		if (!multiple_alowed) {
			for (let i = 0; i < newNotes.length; i++) {
				if (i !== ny) {
					newNotes[i].keys[ky].active = false;
				}
			}
		}
		key.active = !key.active;
		if (key.active) {
			synth.triggerAttackRelease(notes[ny].note, 0.1);
		}
		notes = newNotes;
	}

	$: {
		for (let i = 0; i < notes.length; i++) {
			const newNote = { ...notes[i] };
			while (newNote.keys.length !== keys_count) {
				if (newNote.keys.length < keys_count) newNote.keys.push(default_key());
				if (newNote.keys.length > keys_count) newNote.keys.pop();
			}
			notes[i] = newNote;
		}
	}
</script>

<svelte:body on:mouseup={() => (sliding = false)} />
<div class="wrapper" style={`--key-progress: ${key_progess}%`}>
	<Labels bind:loop {looping} {notes} {current_row} {setProgress} />
	<table class="board" cellspacing="0" cellpadding="0">
		<tbody on:mousedown={() => (sliding = true)}>
			{#each notes as note, ny (note.id)}
				<tr>
					<th
						class="board__cell board__cell--note"
						style="color: {note.color}"
						in:fly={{ x: -20, duration: 100 }}
						out:fly={{ x: -20, duration: 100 }}
						on:click={() => {
							notes = notes.filter((e) => e.id != note.id);
						}}><div class="board__cell__label">{note.label}</div></th
					>{#each note.keys as key, ky (key.id)}
						<td
							class="board__cell board__cell--key"
							class:board__cell--key--active={current_row == ky}
							style={key.active ? `background: ${note.color};` : ''}
							in:fly={{ x: -20, duration: 100, delay: ky * 5 }}
							out:fly={{ x: -20, duration: 100, delay: ky * 5 }}
							on:mouseenter={() => {
								if (sliding) {
									toggle_key(ny, ky);
								}
							}}
							on:mousedown={() => {
								toggle_key(ny, ky);
							}}
						/>{/each}
				</tr>
			{/each}
		</tbody>

		<div class="board__cell board__cell--add-keys">
			<div
				class="board__cell__label"
				on:click={() => {
					keys_count = keys_count + 1;
				}}
			>
				+
			</div>
		</div>
	</table>
	<div class="board__cell board__cell--round">
		<div
			class="board__cell__label"
			on:click={() => {
				notes = [
					...notes,
					{
						label: 're',
						note: 750,
						id: uniqueID(),
						color: '#ff046a',
						keys: []
					}
				];
			}}
		>
			+
		</div>
	</div>
</div>

<style lang="scss">
	.wrapper {
		width: max-content;
		padding: 20px;
		padding-right: 60%;
	}
	.board {
		display: flex;
		height: max-content;

		tbody {
			width: min-content;
		}
		tr {
			width: max-content;
			display: inline-block;
		}
		&__cell {
			width: 64px;
			height: 64px;

			box-shadow: inset -2px -2px 0px rgba(0, 0, 0, 0.25);

			user-select: none;
			cursor: pointer;

			position: relative;
			&__label {
				width: 100%;
				height: 100%;

				display: grid;
				place-items: center;
			}
			&:hover {
				filter: brightness(120%);
			}
			&:active {
				filter: brightness(140%);
			}
			&--note {
				background-color: #263238;
				font-size: 1.5em;
				font-weight: 400;
				font-family: 'Roboto';
			}
			&--key {
				background-color: #4f5b62;
				&::after {
					content: '';
					height: 100%;
					width: 5px;
					display: block;
				}
				&--active::after {
					background: aqua;
					margin-left: calc(var(--key-progress) - 2.5px);
				}
			}
			&--round {
				background-color: #263238;
				font-size: 2em;
				font-weight: 500;
				font-family: 'Roboto';
				border-radius: 50px;
				border: 5px solid transparent;
				box-sizing: border-box;
				background-clip: content-box;
				color: #6746c3;
			}
			&--add-keys {
				height: auto;
				background-color: #4f5b62;
				font-size: 2em;
				font-weight: 500;
				font-family: 'Roboto';
				box-sizing: border-box;
				color: white;
				flex-shrink: 0;
			}
		}
	}
</style>
