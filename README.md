# ordela-setting

Pengaturan dan administrasi Ordela. Saat ini berisi halaman **Kelola User** (`index.html`), halaman statis yang terhubung ke Supabase project Ordela.

## Cara kerja

- Data user ada di tabel `public.ordela_users` (nama, email, peran, status, outlet, 2FA, terakhir aktif).
- Masuk memakai tautan email (Supabase Auth, magic link). Tidak ada sandi.
- Row Level Security: hanya akun dengan peran `Owner` atau `Admin` (status bukan `suspended`) yang bisa membaca dan mengubah tabel. Kunci di `index.html` adalah publishable key, aman dipakai di sisi klien.
- Saat user baru ditambahkan, tautan masuk dikirim ke emailnya. Status berubah dari `pending` ke `active` saat ia pertama kali masuk.

## Setup

1. Di Supabase: Authentication > URL Configuration, isi **Site URL** dan **Redirect URLs** dengan alamat tempat halaman ini di-host (misalnya GitHub Pages).
2. Daftarkan Owner pertama, sekali saja, lewat SQL editor Supabase:

   ```sql
   insert into public.ordela_users (name, email, role, status)
   values ('Nama Kamu', 'email@kamu.com', 'Owner', 'active');
   ```

   Email harus huruf kecil dan sama dengan email yang dipakai untuk masuk.
3. Buka halaman, masukkan email, lalu buka tautan masuk dari email.

## Catatan

- Fitur email Supabase bawaan punya batas kirim per jam. Untuk pemakaian nyata, atur SMTP sendiri di Authentication > SMTP.
- Tabel `ordela_users` terpisah dari tabel user POS di schema `pos`.
