<script lang="ts">
	import Button, { Label, Icon } from '@smui/button';
	import Svg from '@smui/common/Svg.svelte';
	import { mdiLogoutVariant } from '@mdi/js';
	import jsCookies from 'js-cookie';

	import { goto } from '$app/navigation';

	import { sessionStore } from '$lib/stores';
	import { browser } from '$app/env';

	$: if (!$sessionStore.authenticated && browser) {
		goto('/login');
	}

	function logout() {
		jsCookies.remove('session');
		sessionStore.set({ authenticated: false });
		goto('/');
	}
</script>

<div class="wrapper">
	<div class="main">
		<h2>Profile</h2>
		<h3>you are <b>{$sessionStore.username}</b></h3>
		<Button color="primary" on:click={logout} variant="raised">
			<Label>Logout</Label>
			<Icon component={Svg} viewBox="0 0 24 24"
				><path fill="currentColor" d={mdiLogoutVariant} /></Icon
			>
		</Button>
	</div>
</div>

<slot />

<style lang="scss">
	@use "../theme.scss";
	@use "../mixins.scss";
	h2 {
		font-size: 2.25rem;
		font-weight: 500;
	}
	h3 {
		font-size: 1.5rem;
		font-weight: 400;
		margin-bottom: 1em;
	}
	.wrapper {
		flex-grow: 1;
		width: 100%;
		background: whitesmoke;
	}
	.main {
		@include mixins.elevation;

		position: relative;

		width: clamp(400px, 60%, 600px);
		height: 100%;

		margin: 0 auto;
		padding: 1em;

		font-family: 'Roboto';
		background: #fafafa;

		display: flex;

		flex-direction: column;
		align-items: center;
	}
	:global(.logout-btn) {
		background: theme.$primary;
		color: white;
	}
</style>
