<script lang="ts">
	import md5 from 'md5';

	import { TextField, Icon, Button } from 'svelte-materialify';
	import { mdiEyeOff, mdiEye } from '@mdi/js';
	import { goto } from '$app/navigation';
	import { sessionStore } from '$lib/stores';

	$: if ($sessionStore.authenticated) {
		goto('/profile');
	}

	let show = false;
	let register = false;

	let username = '';
	let password = '';
	let password_confirm = '';
	let error = '';

	async function sendForm(
		e: Event & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		error = '';
		const response = await fetch(register ? '/auth/register' : '/auth/login', {
			method: 'POST',
			body: JSON.stringify({ username, password: md5(password) }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (!response.ok) {
			error = await response.text();
		} else {
			sessionStore.fetch();
			goto('/profile');
		}
	}
</script>

<div class="login__bg">
	<div class="login__container">
		<h2>{register ? 'Register' : 'Login'}</h2>
		<p>{register ? 'Register' : 'Login'} to save and share your creations</p>
		<form on:submit|preventDefault={sendForm}>
			<TextField filled bind:value={username} id="username" on:change={() => (error = '')}
				>Username</TextField
			>
			<TextField
				filled
				bind:value={password}
				type={show ? 'text' : 'password'}
				id="password"
				error={error != ''}
				hint={error ? error : ''}
				on:change={() => (error = '')}
			>
				Password
				<div
					slot="append"
					on:click={() => {
						show = !show;
					}}
				>
					<Icon path={show ? mdiEyeOff : mdiEye} />
				</div>
			</TextField>
			{#if register}
				<TextField
					filled
					bind:value={password_confirm}
					error={password_confirm != password}
					type={show ? 'text' : 'password'}
					hint={password_confirm != password ? 'passwords do not match' : undefined}
					on:change={() => (error = '')}
				>
					Confirm Password
					<div
						slot="append"
						on:click={() => {
							show = !show;
						}}
					>
						<Icon path={show ? mdiEyeOff : mdiEye} />
					</div>
				</TextField>
			{/if}
			<Button
				type="submit"
				class="submit-btn"
				disabled={!!error && (register ? password_confirm == password : true)}
				>{register ? 'Register' : 'Login'}</Button
			>
		</form>
		{#if register}
			<p class="bottom-text">
				Already have an account? <button class="btn-link" on:click={() => (register = false)}
					>login</button
				>
			</p>
		{:else}
			<p class="bottom-text">
				Don't have an account? <button class="btn-link" on:click={() => (register = true)}
					>register</button
				>
			</p>
		{/if}
	</div>
</div>

<style lang="scss">
	@use "../mixins.scss";
	@use "../theme.scss";
	.login__bg {
		flex-grow: 1;
		width: 100%;
		background: whitesmoke;
	}
	.login__container {
		@include mixins.elevation;

		position: relative;

		width: clamp(400px, 60%, 600px);
		height: 100%;

		margin: 0 auto;
		padding: 1em;

		font-family: 'Roboto';
		background: #fafafa;
		@media (max-width: 500px) {
			width: 100%;
		}
		h2,
		p {
			text-align: center;
		}
		h2 {
			font-size: 2rem;
			font-weight: 700;
		}
		:global(.submit-btn) {
			display: block;
			margin: 1em auto;
			background: theme.$primary;
			color: white;
		}
		.btn-link {
			display: inline;
			border: none;
			background: none;
			padding: 0;
			margin: 0;
			color: blue;
			text-decoration: underline;
			cursor: pointer;
		}
		.bottom-text {
			margin-bottom: 2em;
			position: absolute;
			bottom: 0;
			width: 100%;
		}
	}
</style>
