# Spec: Refactor Cloud Mail ke SvelteKit

## Objective

Mengganti frontend Vue dengan SvelteKit pada worktree terpisah tanpa mengubah
Worker Cloudflare, database, storage, atau situs produksi. Pengguna tetap dapat
masuk, membaca inbox, mengirim email, dan mengatur penerusan per akun.

## Assumptions

- Worker Cloudflare dan endpoint API yang ada tetap menjadi backend.
- SvelteKit dibangun sebagai static SPA mandiri. Ia memanggil API Worker yang
  sudah ada di `https://mail.khwarizmi.co.id`; backend tidak diubah.
- Migrasi pertama mencakup fitur inti pengguna; halaman admin dimigrasikan
  setelah alur pengguna tervalidasi.
- Target awal adalah deployment uji terpisah, bukan `mail.khwarizmi.co.id`.

## Commands

- Development: `npm run dev`
- Build: `npm run build`
- Check: `npm run check`
- Test: `npm run test`

## Project Structure

- `mail-sveltekit/src/routes` — rute aplikasi.
- `mail-sveltekit/src/lib` — klien API, sesi, dan komponen bersama.
- `mail-sveltekit/tests` — tes unit dan integrasi.
- `mail-worker` — backend Cloudflare yang tidak diubah oleh refactor ini.

## Boundaries

- Always: pertahankan kontrak API, validasi input, dan sesi pengguna.
- Ask first: perubahan schema D1, API Worker, atau dependency produksi.
- Never: mengubah route produksi atau memasukkan secret ke Git.

## Success Criteria

- Aplikasi SvelteKit dibangun tanpa error dalam worktree terpisah.
- Login, inbox, detail email, kirim email, dan pengaturan penerusan memakai API
  Worker yang ada.
- Build tidak mengubah aset atau route produksi sebelum deployment uji disetujui.
- Tes dan pemeriksaan tipe lulus untuk fitur yang dimigrasikan.

## Open Question

- Konfirmasi pengguna diperlukan sebelum migrasi halaman admin dimulai.
