<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { ApiError, listAccounts, sendMail, type Account } from '$lib/api';

	let accounts = $state<Account[]>([]);
	let accountId = $state(0);
	let recipients = $state('');
	let subject = $state('');
	let text = $state('');
	let error = $state('');
	let success = $state('');
	let sending = $state(false);

	onMount(async () => { accounts = await listAccounts(); accountId = accounts[0]?.accountId ?? 0; });

	async function submit() {
		error = ''; success = '';
		const receiveEmail = recipients.split(',').map((value) => value.trim()).filter(Boolean);
		const account = accounts.find((value) => value.accountId === accountId);
		if (!account || !receiveEmail.length || !subject || !text) { error = 'Pengirim, penerima, subjek, dan isi email wajib diisi.'; return; }
		sending = true;
		try {
			await sendMail({ accountId, sendEmail: account.email, receiveEmail, subject, content: text.replaceAll('\n', '<br>'), text, name: '', sendType: '', emailId: 0, attachments: [] });
			success = 'Email berhasil dikirim.'; recipients = ''; subject = ''; text = '';
		} catch (cause) { error = cause instanceof ApiError ? cause.message : 'Email gagal dikirim.'; }
		finally { sending = false; }
	}
</script>

<svelte:head><title>Tulis Email — Khwarizmi Mail</title></svelte:head>
<main><button class="back" onclick={() => goto('/inbox')}>← Kotak Masuk</button><h1>Tulis Email</h1>
	<form onsubmit={(event) => { event.preventDefault(); submit(); }}>
		<label>Dari <select bind:value={accountId}>{#each accounts as account}<option value={account.accountId}>{account.email}</option>{/each}</select></label>
		<label>Kepada <input bind:value={recipients} placeholder="nama@contoh.com, lainnya@contoh.com" type="text" /></label>
		<label>Subjek <input bind:value={subject} /></label>
		<label>Pesan <textarea bind:value={text} rows="12"></textarea></label>
		{#if error}<p class="error" role="alert">{error}</p>{/if}{#if success}<p class="success">{success}</p>{/if}
		<button disabled={sending}>{sending ? 'Mengirim…' : 'Kirim Email'}</button>
	</form>
</main>
<style>
	main { max-width: 720px; margin: 0 auto; padding: 48px 24px; color: #123a35; } .back { border: 0; background: transparent; color: #087b71; font: inherit; font-weight: 700; cursor: pointer; } form { display: grid; gap: 16px; } label { display: grid; gap: 6px; font-weight: 650; } input, select, textarea { box-sizing: border-box; width: 100%; border: 1px solid #bfd0ca; border-radius: 8px; padding: 11px; font: inherit; } textarea { resize: vertical; } form > button { border: 0; border-radius: 8px; padding: 12px; background: #087b71; color: white; font: inherit; font-weight: 700; } .error { color: #b42318; } .success { color: #087b71; }
</style>
