<script>
	import { page } from '$app/stores';

	import '../app.scss';
	import Nav from '$lib/nav.svelte';
	import Sidebar from '$lib/sidebar.svelte';
</script>

<svelte:head>
	<title
		>8-Bit-Music | {$page.path
			.split('/')
			.filter((e) => e)
			.pop()}</title
	>
</svelte:head>

<div class="body">
	<Nav />
	<div class="wrapper">
		<Sidebar />
		<slot />
	</div>
</div>

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
</style>
