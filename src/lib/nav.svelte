<header class="nav">
	<h1 class="nav__title">8-bit-music</h1>

	<div class="auth">
		<a href="/login" class="login">login</a>
	</div>
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
	.login {
		font-weight: 500;
		color: whitesmoke;
		background: lighten($color: theme.$nav, $amount: 10);
		padding: 0.5em 1em;
		text-decoration: none;
		font-family: 'Roboto';
		border-radius: 5px;
	}
</style>
