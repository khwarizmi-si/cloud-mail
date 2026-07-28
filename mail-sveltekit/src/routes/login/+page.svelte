<script lang="ts">
	import { goto } from '$app/navigation';
	import { ApiError, login, setToken } from '$lib/api';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function submit() {
		error = '';
		if (!email || !password) {
			error = 'Email dan kata sandi wajib diisi.';
			return;
		}

		loading = true;
		try {
			const { token } = await login(email, password);
			setToken(token);
			await goto('/inbox');
		} catch (cause) {
			error = cause instanceof ApiError ? cause.message : 'Koneksi ke server gagal.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head><title>Masuk — Khwarizmi Mail</title></svelte:head>

<main>
	<form onsubmit={(event) => { event.preventDefault(); submit(); }}>
		<p class="eyebrow">KHWARIZMI MAIL</p>
		<h1>Masuk ke email Anda</h1>
		<label>Email <input bind:value={email} type="email" autocomplete="username" /></label>
		<label>Kata sandi <input bind:value={password} type="password" autocomplete="current-password" /></label>
		{#if error}<p class="error" role="alert">{error}</p>{/if}
		<button disabled={loading}>{loading ? 'Memproses…' : 'Masuk'}</button>
	</form>
</main>

<style>
	main { min-height: 100vh; display: grid; place-items: center; background: #f5f7f4; color: #123a35; }
	form { display: grid; gap: 16px; width: min(100% - 48px, 380px); padding: 32px; border-radius: 20px; background: white; box-shadow: 0 16px 50px #123a351a; }
	.eyebrow { margin: 0; color: #e96424; font-size: .75rem; font-weight: 800; letter-spacing: .12em; }
	h1 { margin: 0 0 8px; font-size: 1.7rem; }
	label { display: grid; gap: 6px; font-weight: 650; }
	input { padding: 12px; border: 1px solid #bfd0ca; border-radius: 10px; font: inherit; }
	button { border: 0; border-radius: 10px; padding: 12px; background: #087b71; color: white; font: inherit; font-weight: 700; cursor: pointer; }
	button:disabled { opacity: .6; cursor: wait; }
	.error { margin: 0; color: #b42318; }
</style>
