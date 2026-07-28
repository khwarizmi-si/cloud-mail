<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { ApiError, clearToken, getToken, listAccounts, listInbox, type Account, type Mail } from '$lib/api';

	let accounts = $state<Account[]>([]);
	let activeAccount = $state<Account | null>(null);
	let messages = $state<Mail[]>([]);
	let total = $state(0);
	let loading = $state(true);
	let error = $state('');

	async function load(account = activeAccount) {
		if (!account) return;
		loading = true;
		error = '';
		try {
			const result = await listInbox(account);
			messages = result.list;
			total = result.total;
		} catch (cause) {
			if (cause instanceof ApiError && cause.code === 401) return logout();
			error = cause instanceof Error ? cause.message : 'Kotak masuk tidak dapat dimuat.';
		} finally {
			loading = false;
		}
	}

	async function selectAccount(event: Event) {
		activeAccount = accounts.find((account) => account.accountId === Number((event.target as HTMLSelectElement).value)) ?? null;
		await load();
	}

	function logout() { clearToken(); goto('/login'); }

	onMount(async () => {
		if (!getToken()) return logout();
		try {
			accounts = await listAccounts();
			activeAccount = accounts[0] ?? null;
			await load();
		} catch (cause) {
			error = cause instanceof Error ? cause.message : 'Akun email tidak dapat dimuat.';
			loading = false;
		}
	});
</script>

<svelte:head><title>Kotak Masuk — Khwarizmi Mail</title></svelte:head>

<main>
	<header>
		<div><p class="eyebrow">KHWARIZMI MAIL</p><h1>Kotak Masuk</h1></div>
		<button onclick={logout}>Keluar</button>
	</header>
	{#if accounts.length > 1}
		<label class="account">Alamat email
			<select value={activeAccount?.accountId} onchange={selectAccount}>
				{#each accounts as account}<option value={account.accountId}>{account.email}</option>{/each}
			</select>
		</label>
	{/if}
	<section>
		<div class="toolbar"><strong>{total} email</strong><button onclick={() => load()}>Muat ulang</button></div>
		{#if loading}<p class="state">Memuat email…</p>
		{:else if error}<p class="state error" role="alert">{error}</p>
		{:else if messages.length === 0}<p class="state">Tidak ada email ditemukan.</p>
		{:else}<ul>{#each messages as message}<li>
			<div><strong>{message.name || message.sendEmail || 'Pengirim'}</strong><span>{message.subject || '(Tanpa subjek)'}</span><small>{message.text || ''}</small></div>
			<time>{message.createTime ? new Date(message.createTime).toLocaleString('id-ID') : ''}</time>
		</li>{/each}</ul>{/if}
	</section>
</main>

<style>
	main { max-width: 920px; margin: 0 auto; padding: 48px 24px; color: #123a35; }
	header, .toolbar, li { display: flex; justify-content: space-between; gap: 16px; align-items: center; }
	.eyebrow { margin: 0; color: #e96424; font-weight: 800; letter-spacing: .12em; font-size: .75rem; } h1 { margin: 4px 0 24px; }
	button { border: 0; border-radius: 8px; padding: 9px 12px; background: #087b71; color: white; font-weight: 700; } select { margin-left: 8px; padding: 8px; }
	section { border: 1px solid #d9e4df; border-radius: 14px; overflow: hidden; } .toolbar { padding: 14px; background: #f5f7f4; }
	ul { margin: 0; padding: 0; list-style: none; } li { align-items: start; padding: 16px; border-top: 1px solid #edf1ef; } li div { display: grid; gap: 4px; min-width: 0; } li span, small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } small, time { color: #60756e; } time { white-space: nowrap; font-size: .8rem; }
	.state { padding: 48px; text-align: center; color: #60756e; } .error { color: #b42318; } .account { display: inline-block; margin: 0 0 16px; }
</style>
