<script context="module">
	export const ssr = false;
</script>

<script lang="ts">
	import md5 from 'md5';
	import IconButton from '@smui/icon-button';
	import Button, { Label, Icon } from '@smui/button';
	import Svg from '@smui/common/Svg.svelte';
	import Textfield from '@smui/textfield';
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
	let errorPassword = '';

	$: {
		errorPassword = register ? (password_confirm !== password ? 'paswords do not match' : '') : '';
	}

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
			<Textfield
				variant="filled"
				required
				bind:value={username}
				invalid={!!error}
				id="username"
				on:change={() => (error = '')}
				label="Username"
			/>

			<p class="helper error">{error}</p>
			<Textfield
				variant="filled"
				required
				bind:value={password}
				invalid={!!errorPassword}
				type={show ? 'text' : 'password'}
				on:change={() => (error = '')}
				label="Password"
			>
				<IconButton
					slot="trailingIcon"
					on:click={(e) => {
						e.preventDefault();
						show = !show;
					}}
				>
					{#if show}
						<Icon component={Svg} viewBox="0 0 24 24"
							><path fill="currentColor" d={mdiEyeOff} /></Icon
						>
					{:else}
						<Icon component={Svg} viewBox="0 0 24 24"><path fill="currentColor" d={mdiEye} /></Icon>
					{/if}
				</IconButton>
			</Textfield>

			{#if register}
				<Textfield
					variant="filled"
					required
					bind:value={password_confirm}
					invalid={!!errorPassword}
					type={show ? 'text' : 'password'}
					on:change={() => (error = '')}
					label="Confirm Password"
				>
					<IconButton
						slot="trailingIcon"
						on:click={(e) => {
							e.preventDefault();
							show = !show;
						}}
					>
						{#if show}
							<Icon component={Svg} viewBox="0 0 24 24"
								><path fill="currentColor" d={mdiEyeOff} /></Icon
							>
						{:else}
							<Icon component={Svg} viewBox="0 0 24 24"
								><path fill="currentColor" d={mdiEye} /></Icon
							>
						{/if}
					</IconButton>
				</Textfield>
				<p class="helper error">{errorPassword}</p>
			{/if}
			<Button
				variant="raised"
				type="submit"
				class="submit-btn"
				disabled={!!error || !!errorPassword}
			>
				<Label>{register ? 'Register' : 'Login'}</Label>
			</Button>
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
<slot />

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
		:global(.submit-btn[disabled]) {
			background: rgba(0, 0, 0, 0.26);
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
		form {
			display: flex;
			flex-direction: column;
			& .helper {
				color: rgba(0, 0, 0, 0.6);
				font-size: 12px;
				display: flex;
				flex-direction: column-reverse;
				height: 16px;
				padding: 0 12px 0 16px;
				line-height: 12px;
				letter-spacing: 0.4px;
				font-weight: 400;
				margin: 0;
				margin-bottom: 1em;
				text-align: start;
				&.error {
					color: #b71c1c;
				}
			}
		}
	}
</style>
