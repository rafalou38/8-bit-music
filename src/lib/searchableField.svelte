<script lang="ts">
	import TextField from '@smui/textfield';
	import Button, { Label } from '@smui/button';

	export let choices: string[] = [];
	export let value = '';
	export let valid = false;
	export let label = '';

	$: valid = choices.indexOf(value) !== -1;
</script>

<TextField id="search" class="input" {label} variant="outlined" bind:value />
{#key value}
	{#if !valid}
		{#each choices.slice(0, 30) as e}
			{#if e.toLowerCase().match(value.toLowerCase())}
				<Button
					color="secondary"
					on:click={() => {
						value = e;
					}}
				>
					<Label>{e}</Label>
				</Button>
			{/if}
		{/each}
	{/if}
{/key}
