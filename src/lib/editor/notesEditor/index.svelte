<script lang="ts">
	import BasicEditor from './basic.svelte';
	import CustomEditor from './custom.svelte';
	import SearchEditor from './search.svelte';
	import AdvancedEditor from './advanced.svelte';

	import Select, { Option } from '@smui/select';

	const modes = ['basic', 'advanced', 'custom', 'import', 'search note'];
	let mode = '';

	export let notes: { id: string; note: string | number; name: string }[] = [];
</script>

<Select class="input" placeholder="mode" variant="outlined" bind:value={mode} label="insert mode">
	<Option value="" />
	{#each modes as mode}
		<Option value={mode}>{mode}</Option>
	{/each}
</Select>

{#if mode == 'basic'}
	<!-- <label for="min-octave">min octave</label> -->
	<BasicEditor bind:notes />
{:else if mode == 'advanced'}
	<!-- else if content here -->
	<AdvancedEditor bind:notes />
{:else if mode == 'search note'}
	<SearchEditor bind:notes />
{:else if mode == 'custom'}
	<CustomEditor bind:notes />
{:else}
	<p>Choose a mode to insert notes</p>
{/if}

<style lang="scss">
	@use '../../../theme.scss';
	@use '../../../mixins.scss';

	:global(.generate-btn) {
		display: block;
		margin: 1em auto;
		background: theme.$primary !important;
		color: white !important;
	}
	:global(.input) {
		display: flex;
		margin-bottom: 8px;
	}
</style>
