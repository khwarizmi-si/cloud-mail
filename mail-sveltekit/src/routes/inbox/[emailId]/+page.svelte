<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { markRead, type Mail } from '$lib/api';

	let message = $state<Mail | null>(null);

	onMount(async () => {
		const saved = sessionStorage.getItem('mail:message');
		if (!saved) return goto('/inbox');
		message = JSON.parse(saved) as Mail;
		if (message.unread === 0) markRead([message.emailId]).catch(() => undefined);
	});
</script>

<svelte:head><title>{message?.subject || 'Email'} — Khwarizmi Mail</title></svelte:head>

<main>
	<button class="back" onclick={() => goto('/inbox')}>← Kotak Masuk</button>
	{#if message}
		<article><h1>{message.subject || '(Tanpa subjek)'}</h1><p class="from">Dari <strong>{message.name || message.sendEmail}</strong>{#if message.sendEmail} &lt;{message.sendEmail}&gt;{/if}</p><time>{message.createTime ? new Date(message.createTime).toLocaleString('id-ID') : ''}</time><pre>{message.text || 'Tidak ada teks email.'}</pre></article>
	{:else}<p>Memuat email…</p>{/if}
</main>

<style>
	main { max-width: 820px; margin: 0 auto; padding: 48px 24px; color: #123a35; } .back { border: 0; background: transparent; color: #087b71; font: inherit; font-weight: 700; cursor: pointer; } article { margin-top: 24px; border: 1px solid #d9e4df; border-radius: 14px; padding: 28px; } h1 { margin-top: 0; } .from, time { color: #60756e; } pre { margin: 32px 0 0; font: inherit; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
</style>
