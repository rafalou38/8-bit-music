<script>
	import Fab, { Icon } from '@smui/fab';
	import Svg from '@smui/common/Svg.svelte';
	import { page } from '$app/stores';

	import '../app.scss';
	import Nav from '$lib/nav.svelte';
	import Sidebar from '$lib/sidebar.svelte';
	import { mdiPlus } from '@mdi/js';
</script>

<svelte:head>
	<title
		>8-Bit-Music | {$page.path
			.split('/')
			.filter((e) => e)
			.pop()}</title
	>
</svelte:head>

<div class="body ">
	<Nav />
	<div class="wrapper">
		<Sidebar />
		<main>
			<slot />
		</main>
	</div>
</div>
<a href="/editor/new" class="add-fab">
	<Fab color="primary">
		<Icon component={Svg} viewBox="4 4 16 16"><path fill="currentColor" d={mdiPlus} /></Icon>
	</Fab>
</a>

<style lang="scss">
	.body {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.wrapper {
		display: flex;
		flex-grow: 1;
	}
	main {
		display: flex;
		flex-grow: 1;

		position: relative;
	}
	.add-fab {
		position: fixed;
		right: 16px;
		bottom: 16px;
	}
</style>
