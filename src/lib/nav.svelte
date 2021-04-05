<header class="nav">
	<h1 class="nav__title">8-bit-music</h1>
</header>

<style lang="scss">
	@import './theme.scss';

	.nav {
		height: 54px;

		padding: 16px;
		margin: 0;
		box-sizing: border-box;

		background: $primary;

		display: flex;
		align-items: center;
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
