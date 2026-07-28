<script lang="ts">
	import { goto } from '$app/navigation';
	import { clearToken, getToken } from '$lib/api';

	if (!getToken()) goto('/login');
	function logout() { clearToken(); goto('/login'); }
</script>

<svelte:head><title>Kotak Masuk — Khwarizmi Mail</title></svelte:head>

<main>
	<p class="eyebrow">KHWARIZMI MAIL</p>
	<h1>Kotak Masuk</h1>
	<p>Fondasi SvelteKit aktif. Daftar email dimigrasikan pada slice berikutnya.</p>
	<button onclick={logout}>Keluar</button>
</main>

<style>
	main { max-width: 720px; margin: 0 auto; padding: 64px 24px; color: #123a35; }
	.eyebrow { color: #e96424; font-weight: 800; letter-spacing: .12em; font-size: .75rem; }
	button { border: 0; border-radius: 8px; padding: 10px 14px; background: #087b71; color: white; font-weight: 700; }
</style>
