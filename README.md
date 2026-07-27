<p align="center">
  <img src="doc/demo/logo.png" width="80" alt="Cloud Mail" />
</p>

<h1 align="center">Cloud Mail Khwarizmi</h1>

<p align="center">Layanan email mandiri berbasis Cloudflare Workers untuk domain <code>khwarizmi.co.id</code>.</p>

<p align="center">
  <a href="https://mail.khwarizmi.co.id">Buka Cloud Mail</a> ·
  <a href="README-en.md">English (upstream)</a>
</p>

## Ringkasan

Cloud Mail memungkinkan pengelolaan beberapa alamat email pada satu domain, tanpa server email tradisional. Email masuk diproses melalui Cloudflare Email Routing dan Worker, sedangkan email keluar dikirim menggunakan Resend.

## Fitur

- Antarmuka responsif dengan pilihan Bahasa Indonesia dan Inggris.
- Multi-alamat email pada domain `@khwarizmi.co.id`.
- Kirim dan terima email, termasuk lampiran serta gambar di dalam isi email.
- Pengiriman email eksternal melalui Resend.
- Penerusan email masuk ke Gmail/alamat eksternal yang telah diverifikasi Cloudflare.
- Penyimpanan email di Cloudflare D1, cache di KV, dan lampiran di R2.
- Kontrol akses berbasis peran, batas jumlah alamat email, serta batas kirim email.
- Pengenalan kode verifikasi dengan Workers AI dan perlindungan Turnstile opsional.

## Arsitektur

```text
Pengirim eksternal
      │
      ▼
Cloudflare Email Routing ──► Worker ──► D1 / KV / R2 ──► Cloud Mail
                                  │
                                  └──► Gmail tujuan (opsional, forwarding)

Cloud Mail ──► Resend ──► Penerima eksternal
```

## Komponen

| Komponen | Kegunaan |
| --- | --- |
| Cloudflare Workers + Hono | API, antarmuka, dan pemrosesan email masuk |
| Cloudflare Email Routing | Menerima email untuk `khwarizmi.co.id` |
| Cloudflare D1 | Data pengguna, mailbox, dan pengaturan |
| Cloudflare KV | Cache pengaturan aplikasi |
| Cloudflare R2 | Lampiran dan berkas email |
| Resend | Pengiriman email eksternal |
| Vue 3 + Element Plus | Antarmuka web |

## Penggunaan admin

1. Buka [mail.khwarizmi.co.id](https://mail.khwarizmi.co.id) dan login sebagai admin.
2. Tambahkan user dari menu **Semua Pengguna**.
3. Buat role dengan prinsip akses minimum. Untuk staf umum, batasi domain ke `@khwarizmi.co.id`, maksimal satu alamat email, dan batas kirim harian sesuai kebutuhan.
4. Tambahkan alamat mailbox dari panel kiri atau halaman pengaturan akun.

### Pengiriman email eksternal dengan Resend

1. Tambahkan dan verifikasi `khwarizmi.co.id` pada [Resend Domains](https://resend.com/domains).
2. Buat API key dengan izin **Sending access** untuk domain tersebut.
3. Pada Cloud Mail, buka **Pengaturan Sistem → Email → Token Resend**.
4. Pilih `@khwarizmi.co.id`, masukkan token, lalu simpan.

Jangan simpan API key pada repositori, kode sumber, atau dokumentasi.

### Forward email masuk ke Gmail

1. Di Cloudflare, buka **Email Routing → Destination Addresses**.
2. Tambahkan Gmail tujuan dan selesaikan verifikasi dari email yang dikirim Cloudflare.
3. Di Cloud Mail, buka **Pengaturan Sistem → Teruskan ke Email Eksternal**.
4. Aktifkan forwarding, masukkan alamat Gmail yang telah diverifikasi, lalu simpan.

Email akan tetap tersimpan di Cloud Mail dan salinannya diteruskan ke Gmail. Uji forwarding dari alamat pengirim yang berbeda dengan alamat Gmail tujuan untuk menghindari deteksi loop oleh penyedia email.

## Pengembangan lokal

### Prasyarat

- Node.js 18 atau lebih baru
- pnpm
- Akun Cloudflare dengan D1, KV, dan R2
- Akun Resend untuk pengiriman email eksternal

### Instal dependensi

```bash
cd mail-vue && pnpm install
cd ../mail-worker && pnpm install
```

### Jalankan aplikasi

```bash
# Terminal 1
cd mail-vue
pnpm dev

# Terminal 2
cd mail-worker
pnpm dev
```

Untuk pengembangan lokal, gunakan konfigurasi dan resource Cloudflare yang terpisah dari produksi.

## Deploy

Konfigurasi produksi berada di [`mail-worker/wrangler.toml`](mail-worker/wrangler.toml). Pastikan ID D1, KV, R2, route, domain, dan admin sesuai akun Cloudflare tujuan.

```bash
cd mail-worker
pnpm exec wrangler deploy
```

Perintah deploy akan membangun frontend dari `mail-vue` dan mengunggahnya sebagai aset Worker.

## Struktur proyek

```text
cloud-mail/
├── mail-worker/       # Worker, API, email handler, dan konfigurasi Cloudflare
│   ├── src/
│   └── wrangler.toml
├── mail-vue/          # Antarmuka Vue
│   ├── src/
│   └── public/
├── doc/               # Aset dan tangkapan layar dokumentasi
└── README.md
```

## Lisensi dan kredit

Proyek ini menggunakan lisensi [MIT](LICENSE) dan merupakan deployment turunan dari [maillab/cloud-mail](https://github.com/maillab/cloud-mail).
