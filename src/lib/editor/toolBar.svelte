<svelte:options accessors={true} />

<script lang="ts">
	export let playing = false;
	export let looping = false;
	export let speed = 1;
	export let onAction:
		| ((action: 'add' | 'delete' | 'settings' | 'clock' | 'play' | 'pause') => void)
		| undefined;
	let inteval: NodeJS.Timeout;
	function normalize(i: number) {
		return Math.max(0.1, Math.round(i * 100) / 100);
	}
	let dropdown_visible = false;
</script>

<svelte:body on:touchstart />

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
	<div class="dropdown__container">
		<button on:click={() => (dropdown_visible = !dropdown_visible)}
			><span class="iconify" data-icon="mdi:clock-time-four-outline" data-inline="false" /></button
		>
		<div class="dropdown__body" class:dropdown_visible>
			<button
				on:click={() => {
					speed = normalize(speed - 0.2);
				}}>-</button
			>
			<p>{speed}x</p>
			<button
				on:click={() => {
					speed = normalize(speed + 0.2);
				}}>+</button
			>
		</div>
	</div>
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
	@use '../../theme.scss';
	@use '../../mixins.scss';

	$arrow-size: 10px;
	.dropdown__container {
		display: flex;
		justify-content: center;
	}
	.dropdown__body {
		display: none;
	}
	.dropdown__body.dropdown_visible {
		width: min-content;
		margin-top: 30px + $arrow-size;
		height: 50px;
		z-index: 100;
		position: absolute;
		background: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		&::before {
			content: '';
			border-left: $arrow-size solid transparent;
			border-right: $arrow-size solid transparent;
			border-bottom: $arrow-size solid #fff;
			position: absolute;
			top: -$arrow-size;
		}
		& button {
			cursor: pointer;
		}
		& button:hover {
			color: #666a6b;
		}
		& button:active {
			color: #474a4b;
		}
	}
	.wrapper {
		@include mixins.elevation(4px, 0.14);
		z-index: 1;

		background: theme.$toolbar;

		display: flex;
		padding: 5px;
		height: 40px;
		align-items: center;
		width: 100%;
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
		color: theme.$toolbar-icon;
		&:hover {
			color: theme.$toolbar-icon--hover;
		}
		&.active {
			color: theme.$toolbar-icon--active;
		}
	}
</style>
