<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { getToken, requiresAuthentication } from '$lib/api';

	let { children } = $props();

	onMount(() => {
		if (requiresAuthentication(window.location.pathname, getToken())) goto('/login');
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
