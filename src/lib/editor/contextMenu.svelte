<script lang="ts">
	import { browser } from '$app/env';
	import { uniqueID } from '$lib/helpers';
	import { notes } from '$lib/stores';
	import { default_key } from '$lib/stores/notes';

	import DurationPopup from './durationPopup.svelte';
	import NoteEditPopup from './noteEditPopup.svelte';

	let copiedCollumns: IKey[][] = [];

	type Context =
		| {
				target: 'key';
				ny?: number;
				ky?: number;
		  }
		| {
				target: 'keys';
				selected?: number[];
		  }
		| {
				target: 'note';
				ny?: number;
		  };
	let context: Context;

	function hasHoles(list: number[]) {
		for (let i = 0; i < list.length; i++) {
			if (list[i + 1] !== undefined && list[i] !== list[i + 1] - 1) {
				return true;
			}
		}
		return false;
	}

	export function open(x: number, y: number, new_context: Context) {
		contextmenuElement.style.display = 'block';
		contextmenuElement.style.left = x + 'px';
		contextmenuElement.style.top = y + 'px';
		context = new_context;
	}

	// ==> DURATION
	async function setColumnDuration() {
		let new_duration = await durationPopup.getDuration(
			$notes[0]?.keys[context.target === 'key' ? context.ky : 0]?.duration || 1
		);
		notes.update((oldNotes) => {
			return oldNotes.map((note) => {
				if (context.target == 'key') note.keys[context.ky].duration = new_duration;
				if (context.target == 'keys')
					context.selected.forEach((ky) => {
						note.keys[ky].duration = new_duration;
					});
				return note;
			});
		});
	}

	async function resetColumnDuration() {
		notes.update((oldNotes) => {
			return oldNotes.map((note) => {
				if (context.target === 'key') note.keys[context.ky].duration = 1;
				if (context.target === 'keys')
					context.selected.forEach((ky) => {
						note.keys[ky].duration = 1;
					});

				return note;
			});
		});
	}
	async function reverse() {
		notes.update((oldNotes) => {
			oldNotes.reverse();
			return oldNotes;
		});
	}

	// ==> COLLUMNS EDIT
	async function insertCollumn(where: 'after' | 'before') {
		notes.update((oldNotes) => {
			return oldNotes.map((note) => {
				if (context.target === 'key')
					note.keys.splice(where == 'before' ? context.ky : context.ky + 1, 0, default_key());
				if (context.target === 'keys')
					context.selected.forEach((ky, i) => {
						note.keys.splice(where == 'before' ? ky + i : ky + i + 1, 0, default_key());
					});

				return note;
			});
		});
	}
	async function removeCollumn() {
		notes.update((oldNotes) => {
			const newNotes = [...oldNotes];
			return newNotes.map((note) => {
				if (context.target === 'key') note.keys.splice(context.ky, 1);
				if (context.target === 'keys')
					context.selected.forEach((ky) => {
						note.keys.splice(ky, 1);
					});
				return note;
			});
		});
	}

	//  ==> ACTION
	function duplicateCollumn() {
		notes.update((oldNotes) => {
			const newNotes = [...oldNotes];
			return newNotes.map((note) => {
				if (context.target === 'key')
					note.keys.splice(context.ky, 0, { ...note.keys[context.ky], id: uniqueID() });
				if (context.target === 'keys') {
					const selected = context.selected;
					selected.forEach((ky) => {
						note.keys.splice(ky + selected.length, 0, { ...note.keys[ky], id: uniqueID() });
					});
				}
				return note;
			});
		});
	}
	function copyCollumn() {
		copiedCollumns = [];
		if (context.target === 'key') {
			const ky = context.ky;
			const collumn = $notes.reduce((acc, note) => {
				acc.push(note.keys[ky]);
				return acc;
			}, []);
			copiedCollumns.push(collumn);
		} else if (context.target == 'keys') {
			context.selected.forEach((ky) => {
				const collumn = $notes.reduce((acc, note) => {
					acc.push(note.keys[ky]);
					return acc;
				}, []);
				copiedCollumns.push(collumn);
			});
		}
	}
	function pasteCollumn() {
		if (context.target === 'key') {
			const ky = context.ky;
			$notes = $notes.map((note, ny) => {
				const keys = copiedCollumns.map((collumn) => {
					return { ...collumn[ny], id: uniqueID() };
				});
				note.keys.splice(ky + 1, 0, ...keys);
				return note;
			});
		}
	}

	//  ==> MISC
	function randomize() {
		notes.update((oldNotes) => {
			oldNotes.forEach((note, ny) => {
				oldNotes[ny].keys.forEach((key, ky) => {
					oldNotes[ny].keys[ky].active = false;
				});
			});
			for (let i = 0; i < oldNotes[0].keys.length; i++) {
				oldNotes[Math.round(Math.random() * (oldNotes.length - 1))].keys[i].active = true;
			}
			return oldNotes;
		});
	}

	function clear() {
		notes.update((oldNotes) => {
			oldNotes.forEach((note, ny) => {
				oldNotes[ny].keys.forEach((key, ky) => {
					oldNotes[ny].keys[ky].active = false;
				});
			});
			return oldNotes;
		});
	}

	//   ==> NOTES
	function removeNote() {
		if (context.target === 'key') {
			$notes.splice(context.ky, 1);
		}
	}
	async function editNote() {
		if (context.target === 'key') {
			$notes[context.ny] = await noteEditPopup.editNote($notes[context.ny]);
		}
	}

	let contextmenuElement: HTMLUListElement;
	let durationPopup: DurationPopup;
	let noteEditPopup: NoteEditPopup;
</script>

{#if browser}
	<DurationPopup bind:this={durationPopup} />
	<NoteEditPopup bind:this={noteEditPopup} />
{/if}

<svelte:body
	on:mouseup={() => {
		contextmenuElement.style.display = 'none';
	}} />

<ul class="context-menu" bind:this={contextmenuElement}>
	<li on:click={copyCollumn}>
		<span class="iconify" data-icon="mdi:content-copy" data-inline="false" />copy column{context?.target ===
		'keys'
			? 's'
			: ''}
	</li>
	{#if copiedCollumns.length > 0}
		<li on:click={pasteCollumn}>
			<span class="iconify" data-icon="mdi:content-paste" data-inline="false" />paste column{context?.target ===
			'keys'
				? 's'
				: ''}
		</li>
	{/if}
	{#if context?.target === 'key' || (context?.target === 'keys' && !hasHoles(context?.selected))}
		<li on:click={duplicateCollumn}>
			<span class="iconify" data-icon="mdi:content-duplicate" data-inline="false" />duplicate column{context?.target ===
			'keys'
				? 's'
				: ''}
		</li>
	{/if}
	<hr />
	<li on:click={removeCollumn}>
		<span class="iconify" data-icon="mdi:table-column-remove" data-inline="false" />
		remove column{context?.target === 'keys' ? 's' : ''}
	</li>
	<li on:click={() => insertCollumn('after')}>
		<span class="iconify" data-icon="mdi:table-column-plus-after" data-inline="false" />insert
		column after
	</li>
	<li on:click={() => insertCollumn('before')}>
		<span class="iconify" data-icon="mdi:table-column-plus-before" data-inline="false" />insert
		column before
	</li>
	<hr />
	<li on:click={setColumnDuration}>
		<span class="iconify" data-icon="mdi:timer-outline" data-inline="false" />set column{context?.target ===
		'keys'
			? 's'
			: ''} duration
	</li>
	<li on:click={resetColumnDuration}>
		<span class="iconify" data-icon="mdi:timer-off-outline" data-inline="false" />reset column{context?.target ===
		'keys'
			? 's'
			: ''}
		duration
	</li>
	<hr />
	<li on:click={removeNote}>
		<span class="iconify" data-icon="mdi:table-row-remove" data-inline="false" />remove note
	</li>
	<li on:click={editNote}>
		<span class="iconify" data-icon="mdi:wrench" data-inline="false" />edit note
	</li>
	<hr />
	<li on:click={reverse}>
		<span class="iconify" data-icon="mdi:table-refresh" data-inline="false" />reverse notes order
	</li>

	<li on:click={randomize} class="randomize">
		<span class="iconify" data-icon="mdi:dice-3-outline" data-inline="false" />randomize board
	</li>

	<li on:click={clear} class="clear">
		<span class="iconify" data-icon="mdi:trash-can-outline" data-inline="false" />clear board
	</li>
</ul>

<style lang="scss">
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
		.randomize:hover {
			background-image: linear-gradient(
				to right,
				hsla(0, 70%, 70%, 50%),
				hsla(39, 70%, 70%, 50%),
				hsla(60, 70%, 70%, 50%),
				hsla(120, 70%, 70%, 50%),
				hsla(240, 70%, 70%, 50%),
				hsla(275, 70%, 70%, 50%),
				hsla(300, 70%, 70%, 50%)
			);

			color: black;
			.iconify {
				color: black;
			}
		}
		.clear {
			color: crimson;
			&:hover {
				background-color: crimson;
				color: white;
			}
		}
	}
</style>
