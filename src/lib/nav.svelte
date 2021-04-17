<header class="nav">
	<h1 class="nav__title">8-bit-music</h1>
</header>

<style lang="scss">
	@use '../theme.scss';
	@use '../mixins.scss';

	.nav {
		@include mixins.elevation(4px, 0.03);
		z-index: 2;
		height: 54px;

		padding: 16px;
		margin: 0;
		box-sizing: border-box;

		background: theme.$nav;

		display: flex;
		align-items: center;
		justify-content: space-between;
		&__title {
			margin: 0;

			font-family: 'Rubik';
			font-weight: 500;
			font-size: 20px;
			text-transform: capitalize;

			color: white;
		}
	}
</style>
