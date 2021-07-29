<script lang="ts">
	import Labels from './labels.svelte';
	import ContextMenu from './contextMenu.svelte';
	import { uniqueID } from '$lib/helpers';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import * as Tone from 'tone';
	import { addKey, notes } from '$lib/stores';
	import { browser } from '$app/env';
	let synth: Tone.Synth<Tone.SynthOptions>;
	let sliding = false;
	export let multiple_alowed = false;
	export let current_row = -1;
	export let key_progess = 0;

	export let setProgress: (i: number) => void;

	export let loop: [number | null, number | null] = [1, 3];
	export let looping = false;
	onMount(() => {
		synth = new Tone.Synth().toDestination();
	});

	async function toggle_key(ny: number, ky: number) {
		await Tone.start();
		notes.update((oldNotes) => {
			const key = oldNotes[ny].keys[ky];
			if (!multiple_alowed) {
				for (let i = 0; i < oldNotes.length; i++) {
					if (i !== ny) {
						oldNotes[i].keys[ky].active = false;
					}
				}
			}
			key.active = !key.active;
			if (key.active) {
				synth.triggerAttackRelease(oldNotes[ny].note, 0.1);
			}
			return oldNotes;
		});
	}

	let selected = [0, 1, 3];
	function toggleSelection(ky: number) {
		let newSelected = [...selected];
		if (selected.includes(ky)) {
			newSelected = newSelected.filter((e) => e !== ky);
		} else {
			newSelected.push(ky);
		}
		selected = newSelected.sort();
	}

	let longTimeout: NodeJS.Timeout;

	let contextMenu: ContextMenu;
</script>

<svelte:body
	on:mousedown={(e) => {
		if (!e.ctrlKey && e.button !== 2) selected = [];
	}}
	on:mouseup={() => {
		sliding = false;
	}} />

<ContextMenu bind:this={contextMenu} />

<div class="wrapper" style={`--key-progress: ${key_progess}%`}>
	<Labels bind:loop {looping} {current_row} {setProgress} />
	<table class="board" cellspacing="0" cellpadding="0">
		<tbody
			on:mousedown={(e) => {
				sliding = true;
			}}
		>
			{#each $notes as note, ny (note.id)}
				<tr>
					<th
						class="board__cell board__cell--note"
						style="color: {note.color}"
						in:fly={{ x: -20, duration: 100 }}
						on:click={() => {
							notes.update((notes_) => notes_.filter((e) => e.id != note.id));
						}}><div class="board__cell__label">{note.label}</div></th
					>{#each note.keys as key, ky (key.id)}
						<td
							class="board__cell board__cell--key"
							class:board__cell--key--active={current_row == ky}
							style={(key.active ? `background: ${note.color};` : '') +
								`--duration: ${key.duration}`}
							in:fly={{ x: -20, duration: 100, delay: ky * 5 }}
							on:mousedown={(e) => {
								if (e.ctrlKey) return toggleSelection(ky);
							}}
							on:mouseenter={(e) => {
								if (e.ctrlKey && sliding) return toggleSelection(ky);
								if (sliding && e.buttons === 1) {
									toggle_key(ny, ky);
								}
							}}
							on:mouseup={(e) => {
								if (e.button === 0 && !e.ctrlKey) {
									toggle_key(ny, ky);
								}
							}}
							on:touchstart={(e) => {
								longTimeout = setTimeout(
									() =>
										contextMenu.open(e.touches[0]?.clientX, e.touches[0]?.clientY, {
											target: 'key',
											ny,
											ky
										}),
									500
								);
							}}
							on:touchend={(e) => {
								clearTimeout(longTimeout);
							}}
							on:contextmenu|preventDefault={(e) => {
								if (selected.length > 0) {
									contextMenu.open(e.clientX, e.clientY, { target: 'keys', selected });
								} else {
									contextMenu.open(e.clientX, e.clientY, { target: 'key', ny, ky });
								}
							}}
						/>{/each}
				</tr>
			{/each}
		</tbody>

		<div class="board__cell board__cell--add-keys">
			<div
				class="board__cell__label"
				on:click={() => {
					addKey();
				}}
			>
				+
			</div>
		</div>
	</table>
	<div class="selection-container">
		{#each $notes[0]?.keys as key, ky}
			<div
				class="selection"
				class:selected={selected.includes(ky)}
				class:left={!selected.includes(ky - 1)}
				class:right={!selected.includes(ky + 1)}
				style={`width: ${64 * key.duration}px;`}
			/>
		{/each}
	</div>
	<div class="board__cell board__cell--round">
		<div class="board__cell__label">+</div>
	</div>
</div>

<style lang="scss">
	@use '../../theme.scss';
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
			width: calc(64px * var(--duration, 1));
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
					background: theme.$editor-active;
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
	.selection-container {
		position: relative;
		display: flex;

		padding-left: 64px;
		width: 100%;
		height: 10px;
		// opacity: 0;
		pointer-events: none;
	}
	.selection {
		// position: absolute;
		height: 12px;
		margin-top: -10px;
		box-sizing: border-box;
		background: transparent;
		flex-grow: 0;
		flex-shrink: 0;
		&.selected {
			border: 4px solid deepskyblue;
			border-top: none;
			border-left: none;
			border-right: none;
			&.left {
				border-left: 4px solid deepskyblue;
			}
			&.right {
				border-right: 4px solid deepskyblue;
			}
		}
	}
</style>
