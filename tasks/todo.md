# Daftar Tugas SvelteKit

## 1. Fondasi SvelteKit

- [ ] Buat aplikasi SvelteKit dan konfigurasi build statis.
  - Acceptance: halaman login dapat dibuka pada development server.
  - Verify: `npm run check` dan `npm run build`.

## 2. Sesi dan kontrak API

- [ ] Implementasikan klien API yang kompatibel dengan Worker.
  - Acceptance: token disimpan aman di browser dan 401 mengarah ke login.
  - Verify: tes klien API.

## 3. Inbox dan detail email

- [ ] Migrasikan daftar inbox serta tampilan detail email.
  - Acceptance: pengguna dapat membaca email akun aktif.
  - Verify: tes komponen dan cek browser.

## 4. Kirim email

- [ ] Migrasikan formulir tulis dan kirim email.
  - Acceptance: validasi penerima dan pengiriman memakai endpoint yang ada.
  - Verify: tes validasi dan cek browser.

## 5. Pengaturan penerusan

- [ ] Migrasikan pengaturan Gmail tujuan per akun.
  - Acceptance: pengguna dapat menyimpan `forwardEmail` untuk akun miliknya.
  - Verify: tes validasi dan panggilan API.

## Checkpoint

- [ ] Build, check, dan tes lulus.
- [ ] Alur inti diuji di deployment uji terpisah.
