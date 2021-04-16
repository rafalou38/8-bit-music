<script lang="ts">
	import { browser } from '$app/env';

	import { encode } from '$lib/serialization';
	import { notes } from '$lib/stores';

	let link = '';
	function generateLink() {
		link =
			(document.URL + '/').replace(/(https?:\/\/.+?\/).*/i, '$1') +
			'editor?notes=' +
			encode($notes);
	}
</script>

<div class="wrapper">
	<div class="info">
		<h2>Share your creation with the world!</h2>
		<p>there are lot of ways to share your creation</p>
	</div>
	<div class="section">
		<h3>Direct link:</h3>
		<p>use this to get a link with all the song in one url, no setup required</p>
		<button class="btn btn--secondary btn-link" on:click={generateLink}>Generate Link</button>
		{#if link && browser}
			<input class="generated-link" type="text" readonly value={link} />
		{/if}
	</div>
</div>

<style lang="scss">
	@use '../theme.scss';
	@use '../mixins.scss';

	.wrapper {
		flex-grow: 1;
		color: white;
		padding: 2em 5em;
	}

	.info {
		text-align: center;
		height: 30%;
	}

	.section {
		h3 {
			font-weight: 600;
			margin: 0;
		}
		p {
			margin: 0.5em;
		}
		.btn-link {
			margin: 1em auto;
		}
		.generated-link {
			width: 100%;
			padding: 0.5em 0.7em;
			border-radius: 5px;
			border: none;
			background: lighten($color: theme.$primary-light, $amount: 20);
		}
	}
	.btn {
		border: none;
		padding: 0.7em 1.3em;
		border-radius: 5px;
		font-family: 'Roboto';
		font-weight: 600;
		display: block;
		@include mixins.ez-btn;
		&--secondary {
			background: theme.$secondary;
		}
	}
</style>
