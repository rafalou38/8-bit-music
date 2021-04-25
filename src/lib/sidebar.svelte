<script lang="ts">
	import { page } from '$app/stores';
	import { sessionStore } from './stores';
	function url(node: HTMLElement, { path, title }: { path: string; title?: string }) {
		node.setAttribute('href', "/" + path);
		node.setAttribute('title', title ? title : path);
		page.subscribe((newPage) => {
			if ('/' + path == newPage.path) {
				node.classList.add('sidebar__link--active');
			} else {
				node.classList.remove('sidebar__link--active');
			}
		});
	}
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<nav class="sidebar">
	<ul class="sidebar__list">
		<li class="sidebar__element">
			<a class="sidebar__link sidebar__link--active" use:url={{ path: 'editor' }}
				><span class="iconify" data-icon="mdi:playlist-music" /></a
			>
		</li>
		<li class="sidebar__element">
			<a class="sidebar__link" use:url={{ path: 'export' }}
				><span class="iconify" data-icon="mdi:export-variant" /></a
			>
		</li>
		<li class="sidebar__element">
			<a class="sidebar__link" use:url={{ path: 'comunity' }}
				><span class="iconify" data-icon="mdi:cloud-search" /></a
			>
		</li>
		<li class="sidebar__element">
			<a class="sidebar__link" use:url={{ path: 'settings' }}
				><span class="iconify" data-icon="mdi:cog" /></a
			>
		</li>
	</ul>
	<div class="sidebar__auth">
		{#if $sessionStore.authenticated}
			<a
				class="sidebar__element sidebar__link--active"
				use:url={{ path: 'profile', title: $sessionStore.username }}
			>
				<span class="iconify account-btn" data-icon="mdi:account" />
				<span class="account-label">{$sessionStore.username}</span>
			</a>
		{:else}
			<a href="/login" class="sidebar__auth--login">login</a>
		{/if}
	</div>
</nav>

<style lang="scss">
	@use '../theme.scss';
	@use '../mixins.scss';
	.sidebar {
		background: theme.$sidebar;
		@include mixins.elevation(8px, 0.2);
		z-index: 2;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		&__list {
			padding: 0;
			margin: 0;
			margin-top: 8px;

			list-style: none;
		}
		&__element {
			width: 72px;
			height: 72px;
		}
		&__link {
			text-decoration: none;
			color: theme.$sidebar-icons;

			width: 100%;
			height: 100%;

			display: grid;
			place-items: center;

			font-size: 200%;
			&--active {
				color: theme.$sidebar-icons--active !important;
			}
			&:hover {
				color: theme.$sidebar-icons--hover;
			}
		}
		&__auth {
			&--login {
				font-weight: 500;
				color: whitesmoke;
				background: lighten($color: theme.$nav, $amount: 10);

				text-decoration: none;
				font-family: 'Roboto';
				border-radius: 5px;

				padding: 0.5em;
				display: block;
				box-sizing: border-box;
				text-align: center;
				margin: 0.5em;
			}
			& .sidebar__element {
				padding: 0.5em;
				font-family: 'Roboto';
				box-sizing: border-box;
				text-align: center;
				text-decoration: none;
				color: theme.$sidebar-icons;
				display: block;
				height: max-content;
				& .account-btn {
					font-size: 3em;
					display: block;
					width: 100%;
				}
				& .account-label {
					display: block;
					margin: 0 auto;
					width: 80%;
					line-height: 1.5ch;
					overflow: hidden;
				}
				&:hover {
					color: theme.$sidebar-icons--hover;
				}
			}
		}
	}
</style>
