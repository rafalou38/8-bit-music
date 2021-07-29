<script lang="ts">
	import { browser } from '$app/env';
	import { notes } from '$lib/stores';

	import DurationPopup from './durationPopup.svelte';

	let copiedColumn = true;

	let context:
		| {
				target: 'key';
				note?: INote;
				ky?: number;
		  }
		| {
				target: 'keys';
				selected?: number[];
		  }
		| {
				target: 'note';
				note?: INote;
		  };

	export function open(x: number, y: number, new_context: any) {
		console.log(new_context);

		contextmenuElement.style.display = 'block';
		contextmenuElement.style.left = x + 'px';
		contextmenuElement.style.top = y + 'px';
		context = new_context;
	}
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

	let contextmenuElement: HTMLUListElement;
	let durationPopup: DurationPopup;
</script>

{#if browser}
	<DurationPopup bind:this={durationPopup} />
{/if}

<svelte:body
	on:mouseup={() => {
		contextmenuElement.style.display = 'none';
	}} />

<ul class="context-menu" bind:this={contextmenuElement}>
	<li>
		<span class="iconify" data-icon="mdi:content-copy" data-inline="false" />copy column{context?.target ===
		'keys'
			? 's'
			: ''}
	</li>
	{#if copiedColumn}
		<li>
			<span class="iconify" data-icon="mdi:content-paste" data-inline="false" />paste column{context?.target ===
			'keys'
				? 's'
				: ''}
		</li>
	{/if}
	<li>
		<span class="iconify" data-icon="mdi:content-duplicate" data-inline="false" />duplicate column{context?.target ===
		'keys'
			? 's'
			: ''}
	</li>
	<hr />
	<li>
		<span class="iconify" data-icon="mdi:table-column-remove" data-inline="false" /> remove column{context?.target ===
		'keys'
			? 's'
			: ''}
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
	}
</style>
