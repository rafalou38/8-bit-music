<script>
	import { MaterialAppMin } from 'svelte-materialify';

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

<MaterialAppMin>
	<div class="body">
		<Nav />
		<div class="wrapper">
			<Sidebar />
			<main>
				<slot />
			</main>
		</div>
	</div>
</MaterialAppMin>

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
</style>
