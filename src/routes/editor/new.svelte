<script lang="ts">
	import { Icon } from '@smui/icon-button';
	import Button, { Label } from '@smui/button';
	import Notes from '$lib/editor/notesEditor/settings/notes.svelte';
	import Color from '$lib/editor/notesEditor/settings/color.svelte';
	import { notes as notes_store } from '$lib/stores/notes';
	import { goto } from '$app/navigation';

	let current: number = 0;

	let notes: { id: string; note: string | number; name: string; color?: string }[] = [
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
	function save() {
		notes_store.set(
			notes.map((note) => {
				return {
					label: note.name,
					id: note.id,
					note: note.note,
					color: note.color,
					keys: []
				};
			})
		);
		goto('/editor');
	}
</script>

<div class="new__bg">
	<div class="new__container">
		<h2>Create a new Music</h2>

		{#if current == 0}
			<Notes bind:notes />
		{:else if current == 1}
			<Color bind:notes />
		{/if}

		<div class="next-button">
			{#if current !== 0}
				<Button variant="raised" color="secondary" on:click={() => current--}>
					<Label>previous</Label>
					<Icon class="material-icons">arrow_backward</Icon>
				</Button>
			{/if}

			{#if current == 1}
				<Button variant="raised" on:click={save}>
					<Label>save</Label>
					<Icon class="material-icons">save</Icon>
				</Button>
			{:else}
				<Button variant="raised" on:click={() => current++}>
					<Label>next</Label>
					<Icon class="material-icons">arrow_forward</Icon>
				</Button>
			{/if}
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
	.next-button {
		text-align: center;
		margin-top: 4em;
	}
</style>
