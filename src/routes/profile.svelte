<script lang="ts">
	import { goto } from '$app/navigation';

	import { sessionStore } from '$lib/stores';

	$: if ($sessionStore.authenticated) {
		goto('/profile');
	}
</script>

<p>you are {$sessionStore.username}</p>
<slot />
