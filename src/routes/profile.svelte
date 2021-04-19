<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ session }) => {
		if (!session.authenticated) {
			return {
				status: 302,
				redirect: '/login'
			};
		}
		return {
			props: {
				username: session.username
			}
		};
	};
</script>

<script lang="ts">
	export let username;
</script>

<p>you are {username}</p>
