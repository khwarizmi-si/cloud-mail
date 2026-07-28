<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { ApiError, listAccounts, setForwardEmail, type Account } from '$lib/api';

	let accounts = $state<Account[]>([]);
	let accountId = $state(0);
	let forwardEmail = $state('');
	let error = $state('');
	let success = $state('');
	let saving = $state(false);

	function chooseAccount() {
		forwardEmail = accounts.find((account) => account.accountId === accountId)?.forwardEmail ?? '';
	}

	onMount(async () => { accounts = await listAccounts(); accountId = accounts[0]?.accountId ?? 0; chooseAccount(); });

	async function save() {
		error = ''; success = '';
		if (forwardEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forwardEmail)) { error = 'Masukkan alamat Gmail yang valid.'; return; }
		saving = true;
		try { await setForwardEmail(accountId, forwardEmail.trim()); success = forwardEmail ? 'Penerusan email disimpan.' : 'Penerusan email dinonaktifkan.'; }
		catch (cause) { error = cause instanceof ApiError ? cause.message : 'Pengaturan gagal disimpan.'; }
		finally { saving = false; }
	}
</script>

<svelte:head><title>Pengaturan — Khwarizmi Mail</title></svelte:head>
<main><button class="back" onclick={() => goto('/inbox')}>← Kotak Masuk</button><h1>Penerusan Email</h1><p>Setiap alamat email dapat meneruskan pesan masuk ke satu Gmail pemiliknya.</p>
	<form onsubmit={(event) => { event.preventDefault(); save(); }}>
		<label>Alamat Khwarizmi <select bind:value={accountId} onchange={chooseAccount}>{#each accounts as account}<option value={account.accountId}>{account.email}</option>{/each}</select></label>
		<label>Gmail tujuan <input bind:value={forwardEmail} type="email" placeholder="nama@gmail.com" /></label>
		<small>Kosongkan kolom untuk menonaktifkan penerusan. Gmail tujuan harus sudah diverifikasi di Cloudflare Email Routing.</small>
		{#if error}<p class="error" role="alert">{error}</p>{/if}{#if success}<p class="success">{success}</p>{/if}
		<button disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</button>
	</form>
</main>
<style>
	main { max-width: 640px; margin: 0 auto; padding: 48px 24px; color: #123a35; } .back { border: 0; background: transparent; color: #087b71; font: inherit; font-weight: 700; cursor: pointer; } form { display: grid; gap: 16px; margin-top: 24px; } label { display: grid; gap: 6px; font-weight: 650; } input, select { box-sizing: border-box; width: 100%; border: 1px solid #bfd0ca; border-radius: 8px; padding: 11px; font: inherit; } small { color: #60756e; line-height: 1.5; } form > button { border: 0; border-radius: 8px; padding: 12px; background: #087b71; color: white; font: inherit; font-weight: 700; } .error { color: #b42318; } .success { color: #087b71; }
</style>
