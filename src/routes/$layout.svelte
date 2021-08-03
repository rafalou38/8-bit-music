<script>
	import Fab, { Icon } from '@smui/fab';
	import Button, { Label } from '@smui/button';
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
<div class="add">
	<a href="/editor/import" title="create a new song">
		<Button variant="raised" class="button-shaped-round">
			<Icon class="material-icons">file_upload</Icon>
			<Label>Import</Label>
		</Button>
		<!-- <Fab extended color="primary">
			<Icon class="material-icons">file_upload</Icon>
			<Label>Import</Label>
		</Fab> -->
	</a>
	<a href="/editor/new" title="create a new song">
		<Button variant="raised" class="button-shaped-round">
			<Icon class="material-icons">create</Icon>
			<Label>Create</Label>
		</Button>
		<!-- <Fab extended color="primary">
			<Icon class="material-icons">create</Icon>
			<Label>Create</Label>
		</Fab> -->
	</a>
	<div class="add-fab">
		<Fab color="primary" title="create a new song">
			<Icon component={Svg} viewBox="4 4 16 16"><path fill="currentColor" d={mdiPlus} /></Icon>
		</Fab>
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
	main {
		display: flex;
		flex-grow: 1;

		position: relative;
	}
	.add {
		position: fixed;
		right: 16px;
		bottom: 16px;
		text-align: right;
		&:hover {
			.add-fab {
				display: none;
			}
			& > *:not(.add-fab) {
				// &:first-child {
				// 	background: red;
				// }
				// &:last-child {
				// 	background: green;
				// }
				&:nth-child(1) {
					animation: slide-top 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0ms forwards;
				}
				&:nth-child(2) {
					animation: slide-top 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 100ms forwards;
				}
			}
		}
		& > *:not(.add-fab) {
			margin-top: 0.5em;
			opacity: 0;
			display: block;
		}
	}

	@keyframes slide-top {
		0% {
			transform: translateY(20px);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
