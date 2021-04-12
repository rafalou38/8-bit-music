<script lang="ts">
	export let loop: [number | null, number | null] = [1, 3];
	export let looping = false;

	export let notes: INote[] = [];
	export let current_row = -1;

	export let setProgress: (i: number) => void;

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
</script>

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

<style lang="scss">
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
