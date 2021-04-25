<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	import { List, ListItem, Icon, Button, Divider } from 'svelte-materialify';
	import { mdiTrashCan } from '@mdi/js';

	import NotesEditor from '$lib/editor/notesEditor.svelte';

	let notes: { id: string; note: string | number; name: string }[] = [];

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
			<Button
				icon
				on:click={() => {
					notes = [];
				}}
			>
				<Icon path={mdiTrashCan} />
			</Button>
		{/if}
		<List class="notes-list">
			<div
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
						<ListItem>
							{note.name}
							<span slot="append">
								<Button
									icon
									on:click={() => {
										notes = notes.filter((e) => e.id !== note.id);
									}}
								>
									<Icon path={mdiTrashCan} />
								</Button>
							</span>
							<span slot="subtitle"> {note.note}</span>
						</ListItem>
						<Divider />
					</div>
				{/each}
			</div>
		</List>
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
	:global(.notes-list) {
		padding: 0;
		border: thin solid rgba(0, 0, 0, 0.12);
	}
	.listItem {
		background: white;
	}
</style>
