<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	import IconButton, { Icon } from '@smui/icon-button';
	import Button, { Label } from '@smui/button';

	import Svg from '@smui/common/Svg.svelte';

	import { mdiTrashCan } from '@mdi/js';

	import NotesEditor from '$lib/editor/notesEditor/index.svelte';

	let notes: { id: string; note: string | number; name: string }[] = [
		{
			name: 'C4',
			note: 'C4',
			id: 'KQ6SFBKIXIWPS'
		},
		{
			name: 'D4',
			note: 'D4',
			id: 'KQ6SFBKIZ6ZKN'
		},
		{
			name: 'E4',
			note: 'E4',
			id: 'KQ6SFBKI5TYDW'
		},
		{
			name: 'F4',
			note: 'F4',
			id: 'KQ6SFBKI5MH9E'
		},
		{
			name: 'G4',
			note: 'G4',
			id: 'KQ6SFBKI8FAKW'
		},
		{
			name: 'A4',
			note: 'A4',
			id: 'KQ6SFBKI6QWZK'
		},
		{
			name: 'B4',
			note: 'B4',
			id: 'KQ6SFBKI9UA72'
		}
	];

	const flipDurationMs = 300;
	function handleDndConsider(e) {
		notes = e.detail.items;
	}
	function handleDndFinalize(e) {
		notes = e.detail.items;
	}
</script>

<div class="new__bg">
	<div class="new__container">
		<h2>Create a new Music</h2>
		<p>Choose your notes ♫</p>
		<NotesEditor bind:notes />
		{#if notes.length > 0}
			<IconButton
				class="btn-remove-all"
				title="Remove all notes"
				on:click={() => {
					notes = [];
				}}
			>
				<Icon component={Svg} viewBox="0 0 24 24">
					<path fill="currentColor" d={mdiTrashCan} />
				</Icon>
			</IconButton>
		{/if}
		<div
			class="notes-list"
			use:dndzone={{
				items: notes,
				flipDurationMs,
				dropTargetStyle: { 'background-color': '#00000010' }
			}}
			on:consider={handleDndConsider}
			on:finalize={handleDndFinalize}
		>
			{#each notes as note, i (note.id)}
				<div class="listItem" animate:flip={{ duration: flipDurationMs }}>
					<div class="listItem__left">
						<p class="listItem__title">{note.name}</p>
						<span class="listItem__2d">{note.note}</span>
					</div>

					<IconButton
						on:click={() => {
							notes = notes.filter((e) => e.id !== note.id);
						}}
						title="remove"
					>
						<Icon component={Svg} viewBox="0 0 24 24">
							<path fill="currentColor" d={mdiTrashCan} />
						</Icon>
					</IconButton>
				</div>
			{/each}
		</div>
		<div class="next-button">
			<Button variant="raised">
				<Label>next</Label>
				<Icon class="material-icons">arrow_forward</Icon>
			</Button>
		</div>
	</div>
</div>

<style lang="scss">
	@use "../../mixins.scss";
	@use "../../theme.scss";
	.new__bg {
		width: 100%;
		position: absolute;
		height: 100%;
		overflow-y: scroll;
		background: whitesmoke;
	}
	.new__container {
		@include mixins.elevation;

		position: relative;

		width: clamp(600px, 90%, 1000px);
		min-height: 100%;

		margin: 0 auto;
		padding: 1em;

		font-family: 'Roboto';
		background: #fafafa;

		@media (max-width: 700px) {
			width: 100%;
		}
	}
	h2 {
		font-size: 2em;
		font-weight: 400;
	}
	.notes-list {
		border: thin solid rgba(0, 0, 0, 0.12);
	}
	.listItem {
		background: white;
		height: 64px;
		padding: 16px;
		display: flex;
		box-sizing: border-box;
		justify-content: space-between;
		border-bottom: thin solid rgba(0, 0, 0, 0.12);
		&__title {
			font-size: 16px;
			margin: 0;
		}
		&__2d {
			font-size: 14px;
			margin: 0;
			color: rgba(0, 0, 0, 0.54);
		}
		:global(.mdc-icon-button) {
			margin-top: -8px;
		}
	}
	:global(.btn-remove-all) {
		display: block;
		margin: 10px;
		margin-left: auto;
	}
	.next-button {
		text-align: center;
		margin-top: 4em;
	}
</style>
