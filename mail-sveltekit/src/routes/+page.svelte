<script lang="ts">
	import { goto } from '$app/navigation';
	import { getToken } from '$lib/api';

	goto(getToken() ? '/inbox' : '/login');
</script>
