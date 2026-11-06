# ordela-setting

Halaman admin Ordela untuk mengelola **owner** (pelanggan Ordela): `index.html`, halaman statis yang berjalan di GitHub Pages.

## Fitur

- Daftar owner dengan toko, paket, dan status (Baru, Aktif, Ditangguhkan), plus pencarian dan filter paket.
- Detail owner: info toko, jumlah staf, langganan, tagihan, dan riwayat aktivitas.
- Ubah paket langganan toko (Starter, Pro, Business, Enterprise, Legacy).
- Tangguhkan atau aktifkan owner. Penangguhan juga mengeluarkan sesi owner dan stafnya, lalu menandai langganan `suspended`.
- Analitik ringkas: owner per paket, pendaftaran per bulan, sebaran status.
- Hapus owner secara permanen (toko, staf, pesanan, tagihan, dan akun login ikut terhapus). Wajib mengetik email owner untuk konfirmasi, dan akunmu sendiri tidak bisa dihapus.
- Notifikasi interaktif: owner baru, belum punya toko, ditangguhkan, dan lama tidak masuk. Bisa ditandai dibaca, dan tiap item membuka detail owner. Status dibaca disimpan di browser.
- Profil admin dengan nama dan foto sendiri, disimpan di tabel `public.ordela_admin_profile` lewat Edge Function.
- Halaman tidak bisa di-zoom, dan teks tidak bisa disalin kecuali di kolom isian. Ini hanya penghalang ringan, bukan pengaman data.

## Cara kerja

- Masuk memakai tautan email (Supabase Auth, magic link), tanpa sandi.
- Data owner ada di schema `pos` dan `billing`, yang tertutup untuk browser. Halaman membacanya lewat Edge Function `owner-admin` di Supabase.
- Edge Function memeriksa token login, lalu hanya mengizinkan email yang ada di daftar `ADMIN_EMAILS` di kode fungsinya. Email lain mendapat penolakan 403.
- Perubahan paket dan status dicatat di `billing.audit_log` dengan `actor_type = 'admin'`.
- Kunci di `index.html` adalah publishable key, aman terlihat di sisi klien. Kata sandi dan data sensitif lain tidak pernah dikirim ke halaman.

## Setup

1. Aktifkan GitHub Pages: Settings > Pages > Deploy from a branch > `main` / root.
2. Di Supabase, Authentication > URL Configuration, isi Site URL dan Redirect URLs dengan alamat Pages.
3. Untuk menambah admin, ubah `ADMIN_EMAILS` di Edge Function `owner-admin` lalu deploy ulang. Akun Auth admin harus sudah ada karena halaman tidak membuat akun baru.

## Catatan

- Email Supabase bawaan punya batas kirim per jam. Untuk pemakaian rutin, atur SMTP sendiri.
- Aksi tulis (ubah paket, tangguhkan) belum diuji pada data asli. Cobalah pada owner uji dulu.
