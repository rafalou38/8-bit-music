<script lang="ts">
	import { map } from '$lib/helpers';

	export let steps: [number, string][] = [
		[1, 'a'],
		[10, 'b'],
		[13, 'c'],
		[32, 'd'],
		[38, 'e'],
		[40.5, 'f'],
		[60, 'g'],
		[80, 'h'],
		[90, 'i']
	];
	export let min = 0;
	export let max = 100;
	export let value = 50;

	export let fontFamily: string;
	let dragging = false;
	let transition = false;

	function calculate_step(value: number) {
		return [...steps].sort((a, b) => {
			const diffA = Math.abs(value - a[0]);
			const diffB = Math.abs(value - b[0]);

			if (diffA > diffB) return 1;
			if (diffA < diffB) return -1;
			return 0;
		})[0][0];
	}

	function handleMouseMove(e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		if (!dragging) return;
		const rect = slider.getBoundingClientRect();
		const absValue = Math.min(Math.max(map(e.x - rect.left, 0, rect.width, min, max), min), max);

		if (steps.length > 0) {
			value = calculate_step(absValue);
		} else {
			value = absValue;
		}
	}
	function handleMouseClick(
		e: MouseEvent & {
			currentTarget: EventTarget & HTMLDivElement;
			target: EventTarget & HTMLDivElement;
		}
	) {
		if (e.target.className.includes('handle')) return;
		dragging = true;
		const rect = slider.getBoundingClientRect();
		const absValue = Math.min(Math.max(map(e.x - rect.left, 0, rect.width, min, max), min), max);
		if (steps.length > 0) {
			value = calculate_step(absValue);
		} else {
			value = absValue;
		}
	}

	let slider: HTMLDivElement;
</script>

<svelte:body on:mouseup={() => (dragging = false)} on:mousemove={handleMouseMove} />

<div
	class="slider"
	style={`--percent: ${map(value, min, max, 0, 100)}%`}
	on:mousedown={handleMouseClick}
	class:transition={transition || steps.length > 0}
	bind:this={slider}
>
	<div class="progress" />
	{#if dragging}
		<div class="marker" style={`font-family: ${fontFamily}`}>
			{@html steps.find((e) => e[0] == value)?.[1] || Math.round(value)}
		</div>
	{/if}
	<button class="handle" on:mousedown={() => (dragging = true)} />
	{#each steps as step}
		<div
			class="dot"
			class:covered={step[0] < value}
			style={`--value: ${map(step[0], min, max, 0, 100)}%`}
		/>
	{/each}
</div>

<style lang="scss">
	.slider {
		position: relative;
		z-index: 1;
		// overflow-x: hidden;
		// overflow-y: visible;

		display: flex;
		align-items: center;

		width: 100%;
		height: 6px;

		margin: 5em 0em 1em 0em;

		border-radius: 1000vh;

		// background: rgba(0, 0, 0, 0.2);
		color: deepskyblue;
		&.transition {
			.progress {
				transition: width 0.5s ease;
			}
			.handle,
			.marker {
				transition: margin-left 0.5s ease;
			}
			.dot {
				transition: background 0.5s ease;
			}
		}
		&::after {
			content: '';
			z-index: 0;
			background: currentColor;
			border-radius: 1000vh;
			opacity: 0.24;
			position: absolute;
			inset: 0;
		}
	}
	.progress {
		position: absolute;
		background: currentColor;
		height: 6px;
		width: var(--percent);
		border-radius: 1000vh;
	}
	.handle {
		// display: none;
		position: relative;
		z-index: 1;

		height: 20px;
		width: 20px;
		margin-left: calc(var(--percent) - 1em);

		border-radius: 1em;
		border: none;

		cursor: pointer;
		color: inherit;
		background: white;
		&:focus {
			outline: none;
		}
		&::before {
			content: '';
			z-index: 2;
			position: absolute;
			inset: 0;
			transform: scale(1);

			opacity: 0;

			border-radius: 1em;

			cursor: pointer;
			background: currentColor;

			transition: all 0.5s ease;
		}
		&:hover::before {
			transform: scale(2);
			opacity: 0.1;
		}
		&:focus::before {
			transform: scale(2);
			opacity: 0.2;
		}
		&:active::before {
			transform: scale(2);
			opacity: 0.3;
		}

		&::after {
			content: '';

			position: absolute;
			inset: 0;

			border-radius: 1em;

			background: currentColor;
		}
	}
	.dot {
		position: absolute;

		width: 2px;
		height: 2px;

		margin-left: var(--value);

		border-radius: 10px;

		background: deepskyblue;

		opacity: 0.6;
		&.covered {
			background: rgba(255, 255, 255);
		}
	}
	.marker {
		position: absolute;
		z-index: 4;
		margin-left: calc(var(--percent));
		transform: translateX(-50%);
		margin-top: -5.5em;
		padding: 0.5em 1em;
		border-radius: 5px;
		color: white;
		background: #6b696e;
		&::after {
			content: '';
			position: absolute;
			z-index: 4;
			bottom: -20px;
			left: calc(50% - 10px);
			width: 0;
			height: 0;
			border: 10px solid transparent;
			border-top-color: #6b696e;
		}
	}
</style>
