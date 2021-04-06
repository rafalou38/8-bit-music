<script lang="ts">
	import { page } from '$app/stores';
	function url(node: HTMLElement, path: string) {
		node.setAttribute('href', path);
		node.setAttribute('title', path);
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
			<a class="sidebar__link sidebar__link--active" use:url={'editor'}
				><span class="iconify" data-icon="mdi:playlist-music" /></a
			>
		</li>
		<li class="sidebar__element">
			<a class="sidebar__link" use:url={'export'}
				><span class="iconify" data-icon="mdi:export-variant" /></a
			>
		</li>
		<li class="sidebar__element">
			<a class="sidebar__link" use:url={'comunity'}
				><span class="iconify" data-icon="mdi:cloud-search" /></a
			>
		</li>
		<li class="sidebar__element">
			<a class="sidebar__link" use:url={'settings'}><span class="iconify" data-icon="mdi:cog" /></a>
		</li>
	</ul>
</nav>

<style lang="scss">
	@import '../theme.scss';
	.sidebar {
		background: lighten($color: $primary, $amount: 3%);
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
			color: #b2babb;

			width: 100%;
			height: 100%;

			display: grid;
			place-items: center;

			font-size: 200%;
			&--active,
			&:hover {
				color: white;
			}
		}
	}
</style>
