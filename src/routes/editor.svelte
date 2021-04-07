<script lang="ts">
	import { fly } from 'svelte/transition';

	import { uniqueID } from '$lib/helpers';

	function default_key() {
		return { duration: 1, id: uniqueID(), active: false };
	}

	let keys_count = 5;
	let notes = [
		{
			label: 'fa',
			frequency: 400,
			id: uniqueID(),
			color: '#ffa46a',
			keys: []
		},
		{
			label: 'do',
			frequency: 600,
			id: uniqueID(),
			color: '#afa4ea',
			keys: []
		},
		{
			label: 'sol',
			frequency: 700,
			id: uniqueID(),
			color: '#f0a4aa',
			keys: []
		},
		{
			label: 'mi',
			frequency: 500,
			id: uniqueID(),
			color: '#00a46a',
			keys: []
		},
		{
			label: 're',
			frequency: 750,
			id: uniqueID(),
			color: '#ff046a',
			keys: []
		}
	];

	$: {
		for (let i = 0; i < notes.length; i++) {
			const newNote = { ...notes[i] };
			while (newNote.keys.length !== keys_count) {
				if (newNote.keys.length < keys_count) newNote.keys.push(default_key());
				if (newNote.keys.length > keys_count) newNote.keys.pop();
			}
			notes[i] = newNote;
		}
	}
</script>

<div class="wrapper">
	<table class="board" cellspacing="0">
		<tbody>
			{#each notes as note (note.id)}
				<tr>
					<th
						class="board__cell board__cell--note"
						style="color: {note.color}"
						in:fly={{ x: -20, duration: 100 }}
						out:fly={{ x: -20, duration: 100 }}
						on:click={() => {
							notes = notes.filter((e) => e.id != note.id);
						}}><div class="board__cell__label">{note.label}</div></th
					>{#each note.keys as key, i (key.id)}
						<td
							class="board__cell board__cell--key"
							style={key.active ? `background: ${note.color};` : ''}
							in:fly={{ x: -20, duration: 100, delay: i * 5 }}
							out:fly={{ x: -20, duration: 100, delay: i * 5 }}
							on:click={() => {
								key.active = !key.active;
							}}
						/>{/each}
				</tr>
			{/each}
		</tbody>

		<div class="board__cell board__cell--add-keys">
			<div
				class="board__cell__label"
				on:click={() => {
					keys_count = keys_count + 1;
				}}
			>
				+
			</div>
		</div>
	</table>
	<div class="board__cell board__cell--round">
		<div
			class="board__cell__label"
			on:click={() => {
				notes = [
					...notes,
					{
						label: 're',
						frequency: 750,
						id: uniqueID(),
						color: '#ff046a',
						keys: []
					}
				];
			}}
		>
			+
		</div>
	</div>
</div>

<style lang="scss">
	.wrapper {
		width: 100%;
		height: 100%;
		overflow: auto;
		position: absolute;
	}
	.board {
		display: flex;
		height: max-content;
		tbody {
			width: min-content;
		}
		tr {
			width: max-content;
			display: inline-block;
		}
		&__cell {
			width: 64px;
			height: 64px;

			box-shadow: inset -2px -2px 0px rgba(0, 0, 0, 0.25);

			user-select: none;
			cursor: pointer;
			&__label {
				width: 100%;
				height: 100%;

				display: grid;
				place-items: center;
			}
			&:hover {
				filter: brightness(120%);
			}
			&:active {
				filter: brightness(140%);
			}
			&--note {
				background-color: #263238;
				font-size: 1.5em;
				font-weight: 400;
				font-family: 'Roboto';
			}
			&--key {
				background-color: #4f5b62;
			}
			&--round {
				background-color: #263238;
				font-size: 2em;
				font-weight: 500;
				font-family: 'Roboto';
				border-radius: 50px;
				border: 5px solid transparent;
				box-sizing: border-box;
				background-clip: content-box;
				color: #6746c3;
			}
			&--add-keys {
				height: auto;
				background-color: #4f5b62;
				font-size: 2em;
				font-weight: 500;
				font-family: 'Roboto';
				box-sizing: border-box;
				color: white;
				flex-shrink: 0;
			}
		}
	}
</style>
