<script lang="ts">
	import { map, uniqueID } from '$lib/helpers';
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
	export let looping = false;
	export let setProgress: (i: number) => void;

	export let loop: [number | null, number | null] = [1, 3];
	let curentLoopI = 0;
	function loopAction(e: HTMLElement, i: number) {
		if (loop[0] === null) {
			curentLoopI = 1;
		} else if (loop[1] === null) {
			curentLoopI = 0;
		}
		if (loop[curentLoopI] == i && looping) {
			curentLoopI = (curentLoopI + 1) % 2;
			e.classList.add('goto__btn--loop');
		} else {
			e.classList.remove('goto__btn--loop');
		}
	}

	function handleLabelClick(
		e: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		},
		i: number
	) {
		if (e.ctrlKey) {
			if (!looping) return;
			let newLoop: typeof loop = [...loop];
			if (newLoop.includes(i)) {
				newLoop[newLoop.indexOf(i)] = null;
			} else {
				if (newLoop.filter((e) => e !== null).length < 2) {
					if (newLoop[0] !== null) {
						if (i > newLoop[0]) {
							newLoop[1] = i;
						} else {
							let tmp = newLoop[0];
							newLoop[0] = i;
							newLoop[1] = tmp;
						}
					} else if (newLoop[1] !== null) {
						if (i < newLoop[1]) {
							newLoop[0] = i;
						} else {
							let tmp = newLoop[1];
							newLoop[1] = i;
							newLoop[0] = tmp;
						}
					} else {
						newLoop[1] = i;
					}
				}
			}
			curentLoopI = 0;
			loop = newLoop;
		} else {
			setProgress(i);
		}
	}
	onMount(() => {
		synth = new Tone.Synth().toDestination();
	});

	function default_key() {
		return { duration: 1, id: uniqueID(), active: false };
	}

	function toggle_key(ny: number, ky: number) {
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
	<div class="goto__container">
		{#key looping}
			{#key loop}
				{#each notes[0].keys as key, ky (key.id)}
					<div class="goto__container">
						<button
							class="goto__btn goto__btn--loop"
							class:goto__btn--active={current_row == ky}
							use:loopAction={ky}
							on:click={(e) => handleLabelClick(e, ky)}
						/>
					</div>
				{/each}
			{/key}
		{/key}
	</div>
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
	$goto_width: 20px;
	$goto_height: 20px;
	.goto__container {
		display: flex;
		.goto__container {
			&:first-child {
				margin-left: 64px;
			}
			width: 64px;
			.goto__btn {
				border: none;
				width: $goto_width;
				height: $goto_height;
				border-radius: 5px 5px 100% 100%;
				background: grey;
				transform: translateX(-($goto_width/2));
				margin-bottom: 3px;
				&--active {
					background: aqua;
				}
				&--loop {
					background: Orchid;
				}
				&:hover {
					filter: brightness(120%);
				}
				&:active {
					filter: brightness(140%);
				}
			}
		}
	}
</style>
