<script lang="ts">
	import NotesByDuration from './svgsByNotesDuration';
	import MySlider from '$lib/components/slider.svelte';

	import Dialog, { Title, Content, Actions, InitialFocus } from '@smui/dialog';
	import Button, { Label } from '@smui/button';

	let duration = 1;
	let open = true;
	let resolve: ((value: number | PromiseLike<number>) => void) | undefined;

	export function getDuration(default_value?: number) {
		if (default_value) duration = default_value;
		open = true;
		return new Promise<number>((resolve_) => (resolve = resolve_));
	}
</script>

<Dialog bind:open aria-labelledby="row-duration" aria-describedby="chose a duration for this row">
	<Title id="slider-title">row duration</Title>
	<Content id="slider-content">
		<div class="flex">
			<input class="manual-input" bind:value={duration} />
			<MySlider fontFamily="Notes" steps={NotesByDuration} max={8} min={0} bind:value={duration} />
			<p class="note-preview">{@html NotesByDuration.find((n) => n[0] === duration)?.[1] || ''}</p>
		</div>
		<div class="btn-notes-container">
			{#each NotesByDuration as [value, text]}
				<button class:active={duration === value} on:click={() => (duration = value)}
					>{@html text}</button
				>
			{/each}
		</div>
	</Content>
	<Actions>
		<Button action="accept" on:click={() => resolve?.(duration)}>
			<Label>Done</Label>
		</Button>
	</Actions>
</Dialog>

<style lang="scss">
	:global(.mdc-dialog .mdc-dialog__surface) {
		width: 350px;
	}
	.manual-input {
		border: none;
		background: transparent;
		width: 4ch;
		margin: auto 0 1em 0;
	}
	.note-preview {
		font-family: Notes;
		font-size: 70px;
		width: 30%;
		height: 100%;
		flex-shrink: 0;
		text-align: center;
		margin: 0;
	}
	.flex {
		display: flex;
		align-items: center;
		gap: 1em;
	}
	.btn-notes-container {
		margin-top: 1em;
		button {
			font-family: Notes;
			height: 50px;
			width: 50px;
			font-size: 35px;
			box-sizing: border-box;
			background: transparent;
			border: none;
			position: relative;
			// &.active {
			// 	border-width: 5px;
			// }
			&::before {
				border-radius: 5px;
				content: '';
				position: absolute;
				inset: 0;
				background: deepskyblue;
				opacity: 0;
			}
			&:hover::before {
				opacity: 0.1;
			}
			&:active::before,
			&.active::before {
				opacity: 0.2;
			}
		}
	}
</style>
