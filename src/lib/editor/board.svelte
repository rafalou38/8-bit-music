<script lang="ts">
	import Labels from './labels.svelte';
	import DurationPopup from './durationPopup.svelte';
	import { uniqueID } from '$lib/helpers';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import * as Tone from 'tone';
	import { keys_count, notes } from '$lib/stores';
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
	function showContextMenu(
		x: number,
		y: number,
		target: 'key' | 'note',
		note?: INote,
		ky?: number
	) {
		contextmenuElement.style.display = 'block';
		contextmenuElement.style.left = x + 'px';
		contextmenuElement.style.top = y + 'px';
	}

	let contextmenuElement: HTMLUListElement;
	let copiedColumn = true;
	let longTimeout: NodeJS.Timeout;

	let durationPopup: DurationPopup;
</script>

<svelte:body
	on:mouseup={() => {
		sliding = false;
		contextmenuElement.style.display = 'none';
	}} />

{#if browser}
	<DurationPopup bind:this={durationPopup} />
{/if}

<ul class="context-menu" bind:this={contextmenuElement}>
	<li>
		<span class="iconify" data-icon="mdi:content-copy" data-inline="false" />copy column
	</li>
	{#if copiedColumn}
		<li>
			<span class="iconify" data-icon="mdi:content-paste" data-inline="false" />paste column
		</li>
	{/if}
	<li>
		<span class="iconify" data-icon="mdi:content-duplicate" data-inline="false" />duplicate column
	</li>
	<hr />
	<li>
		<span class="iconify" data-icon="mdi:table-column-remove" data-inline="false" /> remove column
	</li>
	<li>
		<span class="iconify" data-icon="mdi:table-column-plus-after" data-inline="false" />insert
		column after
	</li>
	<li>
		<span class="iconify" data-icon="mdi:table-column-plus-before" data-inline="false" />insert
		column before
	</li>
	<hr />
	<li
		on:click={async () => {
			console.log(await durationPopup.getDuration());
		}}
	>
		<span class="iconify" data-icon="mdi:timer-outline" data-inline="false" />set column duration
	</li>
	<hr />
	<li><span class="iconify" data-icon="mdi:table-row-remove" data-inline="false" />remove note</li>
	<li><span class="iconify" data-icon="mdi:wrench" data-inline="false" />edit note</li>
	<hr />
	<li>
		<span class="iconify" data-icon="mdi:dice-3-outline" data-inline="false" />randomize board
	</li>

	<li style="color: crimson;">
		<span class="iconify" data-icon="mdi:trash-can-outline" data-inline="false" />clear board
	</li>
</ul>

<div class="wrapper" style={`--key-progress: ${key_progess}%`}>
	<Labels bind:loop {looping} {current_row} {setProgress} />
	<table class="board" cellspacing="0" cellpadding="0">
		<tbody on:mousedown={() => (sliding = true)}>
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
							style={key.active ? `background: ${note.color};` : ''}
							in:fly={{ x: -20, duration: 100, delay: ky * 5 }}
							on:mouseenter={(e) => {
								if (sliding && e.buttons === 1) {
									toggle_key(ny, ky);
								}
							}}
							on:mouseup={(e) => {
								if (e.button === 0) {
									toggle_key(ny, ky);
								}
							}}
							on:touchstart={(e) => {
								longTimeout = setTimeout(
									() =>
										showContextMenu(e.touches[0]?.clientX, e.touches[0]?.clientY, 'key', note, ky),
									500
								);
							}}
							on:touchend={(e) => {
								clearTimeout(longTimeout);
							}}
							on:contextmenu|preventDefault={(e) => {
								showContextMenu(e.clientX, e.clientY, 'key', note, ky);
							}}
						/>{/each}
				</tr>
			{/each}
		</tbody>

		<div class="board__cell board__cell--add-keys">
			<div
				class="board__cell__label"
				on:click={() => {
					keys_count.update((keys_count_) => keys_count_ + 1);
				}}
			>
				+
			</div>
		</div>
	</table>
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
	.context-menu {
		position: fixed;
		z-index: 100;

		display: none;

		min-width: 100px;
		padding: 0;
		margin: 0;

		background-color: white;
		border: thin solid rgba(83, 83, 83, 0.424);
		border-radius: 0.25em;

		list-style: none;
		li {
			display: flex;
			align-items: center;

			padding: 0.5em;

			user-select: none;

			font-family: 'Roboto';
			&:last-child {
				border-bottom: none;
			}
			&:hover {
				background: rgba(83, 83, 83, 0.1);
			}
			.iconify {
				margin-right: 0.5em;
			}
		}
		hr {
			height: 0;
			margin: 5px 10px;
			border: none;
			border-bottom: inherit;
		}
	}
</style>
