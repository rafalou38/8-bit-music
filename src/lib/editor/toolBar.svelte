<svelte:options accessors={true} />

<script lang="ts">
	export let playing = false;
	export let looping = false;

	export let onAction:
		| ((action: 'add' | 'delete' | 'settings' | 'clock' | 'play' | 'pause') => void)
		| undefined;
</script>

<div class="wrapper">
	<button on:click={() => onAction?.('add')}
		><span class="iconify" data-icon="mdi:table-column-plus-after" data-inline="false" /></button
	>
	<button on:click={() => onAction?.('delete')}
		><span class="iconify" data-icon="mdi:table-column-remove" data-inline="false" /></button
	>
	<button on:click={() => onAction?.('settings')}
		><span class="iconify" data-icon="mdi:cog" data-inline="false" /></button
	>
	<button on:click={() => onAction?.('clock')}
		><span class="iconify" data-icon="mdi:clock-time-four-outline" data-inline="false" /></button
	>
	<span class="divider" />
	<button
		class:active={playing}
		on:click={() => {
			playing = !playing;
			onAction?.(playing ? 'play' : 'pause');
		}}
	>
		{#if playing}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				aria-hidden="true"
				focusable="false"
				role="img"
				class="iconify iconify--mdi"
				width="1em"
				height="1em"
				preserveAspectRatio="xMidYMid meet"
				viewBox="0 0 24 24"
				style="transform: rotate(360deg);"
				><path d="M14 19h4V5h-4M6 19h4V5H6v14z" fill="currentColor" /></svg
			>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				aria-hidden="true"
				focusable="false"
				role="img"
				class="iconify iconify--mdi"
				width="1em"
				height="1em"
				preserveAspectRatio="xMidYMid meet"
				viewBox="0 0 24 24"
				style="transform: rotate(360deg);"
				><path d="M8 5.14v14l11-7l-11-7z" fill="currentColor" /></svg
			>
		{/if}
		<!-- <span class="iconify" data-icon={playing ? 'mdi:play' : 'mdi:pause'} data-inline="false" /> -->
	</button>
	<button on:click={() => (looping = !looping)} class:active={looping}>
		{#if looping}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				aria-hidden="true"
				focusable="false"
				role="img"
				class="iconify iconify--mdi"
				width="1em"
				height="1em"
				preserveAspectRatio="xMidYMid meet"
				viewBox="0 0 24 24"
				style="transform: rotate(360deg);"
				><path
					d="M17 17H7v-3l-4 4l4 4v-3h12v-6h-2M7 7h10v3l4-4l-4-4v3H5v6h2V7z"
					fill="currentColor"
				/></svg
			>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				aria-hidden="true"
				focusable="false"
				role="img"
				class="iconify iconify--mdi"
				width="1em"
				height="1em"
				preserveAspectRatio="xMidYMid meet"
				viewBox="0 0 24 24"
				style="transform: rotate(360deg);"
				><path
					d="M2 5.27L3.28 4L20 20.72L18.73 22l-3-3H7v3l-4-4l4-4v3h6.73L7 10.27V11H5V8.27l-3-3M17 13h2v4.18l-2-2V13m0-8V2l4 4l-4 4V7H8.82l-2-2H17z"
					fill="currentColor"
				/></svg
			>
		{/if}
	</button>
</div>

<style lang="scss">
	@import '../../theme.scss';
	.wrapper {
		background: darken($color: $primary, $amount: 5%);

		display: flex;
		padding: 5px;
		height: 40px;
		align-items: center;
	}
	.divider {
		flex-grow: 1;
	}
	button {
		font-size: 1.5em;
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		height: 100%;
		width: 50px;
		display: grid;
		place-items: center;
		text-decoration: none;
		color: #b2babb;
		&:hover,
		&.active {
			color: white;
		}
		& + & {
			border-left: 1px solid #263238;
		}
	}
</style>
