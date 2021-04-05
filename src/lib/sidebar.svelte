<nav class="sidebar">
	<ul class="sidebar__list">
		<li class="sidebar__element">
			<a class="sidebar__link" href="/editor"
				><span class="iconify" data-icon="mdi:playlist-music" /></a
			>
		</li>
		<li class="sidebar__element">
			<a class="sidebar__link" href="/export"
				><span class="iconify" data-icon="mdi:export-variant" /></a
			>
		</li>
		<li class="sidebar__element">
			<a class="sidebar__link" href="/comunity"
				><span class="iconify" data-icon="mdi:cloud-search" /></a
			>
		</li>
		<li class="sidebar__element">
			<a class="sidebar__link" href="/settings"><span class="iconify" data-icon="mdi:cog" /></a>
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

			&:hover {
				color: white;
			}
		}
	}
</style>
