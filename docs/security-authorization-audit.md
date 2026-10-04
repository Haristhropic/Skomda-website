# Audit otorisasi dan minimisasi audit log

Tanggal pemeriksaan: 2026-10-04  
Cakupan: inspeksi statis route Fiber, middleware, dan penyajian audit log pada branch `deploy`.

## Hasil otorisasi

- Route di bawah `/api/admin` memakai middleware autentikasi JWT. Middleware mengambil ulang identitas dan role dari database, sehingga perubahan role dapat berlaku tanpa menunggu token lama berakhir.
- Penerbit JWT menggunakan HS256. Validator membatasi algoritma HS256, memeriksa issuer `skomda-backend`, mewajibkan `exp`, serta memvalidasi `iat`.
- Pengelolaan akun admin, perubahan role, audit log, daftar dokumen/alumni yang berisi data internal, dan data pendaftar Trial Class dibatasi untuk `super_admin`.
- Perubahan konten sekolah memakai autentikasi admin; penghapusan sejumlah konten dan berita dibatasi untuk `super_admin`.
- Pendaftaran Trial Class dan pemeriksaan tiket adalah endpoint publik yang memakai rate limit. Pembaruan jadwal event memakai autentikasi admin.
- Upload dan pembuatan signature Cloudinary memerlukan JWT. Limit khusus upload/concurrency belum ditetapkan.
- Halaman audit log di frontend memeriksa role untuk presentasi, dan API juga mewajibkan `super_admin`; kontrol backend tetap menjadi batas keamanan.

| Permukaan API yang diperiksa | Akses yang tampak di kode |
|---|---|
| `/api/admin/*` | JWT; daftar akun, ubah role, audit log, data dokumen/alumni dan pendaftar Trial Class memerlukan `super_admin`; statistik dashboard tersedia untuk admin terautentikasi. |
| `/api/news` | Baca publik; buat/perbarui perlu JWT admin; hapus perlu `super_admin`. |
| Trial Class | Daftar dan cek tiket publik dengan limiter; baca daftar pendaftar serta ubah/hapus pendaftar perlu `super_admin`; baca jadwal publik, ubah jadwal perlu JWT admin. |
| Upload/signature Cloudinary | JWT admin; rate/concurrency limit khusus belum tampak. |

Ini adalah pembacaan kode, bukan uji akses langsung. Belum memverifikasi kebijakan/grant PostgreSQL, role runtime Supabase, konfigurasi Cloudflare live, maupun perilaku semua route terhadap token editor yang dicabut.

## Perubahan minimisasi data log

Sebelumnya, `AuditLog.Details` menyimpan teks bebas dari pemanggil. Beberapa aksi memasukkan email admin, NISN, nama pendaftar, kode tiket, judul, atau nilai pengaturan. Implementasi branch ini kini menyimpan keterangan tetap: `Aktivitas tercatat; detail objek tidak disimpan.` Log login juga tidak menyimpan email yang dimasukkan; login sukses memakai ID akun sebagai `entity_id`. Aksi, entitas, ID entitas, aktor, alamat IP, dan waktu tetap tersedia untuk investigasi.

Audit log hanya dapat dibaca oleh super admin. Alamat IP dan nama aktor tetap merupakan data yang perlu dibatasi; tetapkan masa retensi dan siapa yang berwenang sebelum produksi.

Endpoint health chatbot tidak lagi mengembalikan URL gateway internal. Log kegagalan upstream hanya menyimpan kategori kejadian dan request ID, bukan URL atau error mentah. Pesan log seeder berita dan admin default juga tidak menyertakan judul berita, email akun, atau teks error database.

Utilitas sinkronisasi SQLite lama tidak lagi mencetak `DATABASE_URL` atau error PostgreSQL mentah. Error seeding record alumni dan event juga dibatasi ke nama operasi agar tidak menyalin detail query/record ke log.

### Data historis

Perubahan kode hanya memengaruhi log baru setelah image ini dideploy. Baris lama di database tetap dapat memuat nilai sebelumnya. Jangan membersihkan atau menghapusnya otomatis: pemilik database perlu menentukan kebutuhan retensi/insiden dan menyetujui operasi pembersihan terpisah. Lakukan ekspor/backup sesuai kebijakan sebelum perubahan historis.

## Langkah berikutnya sebelum domain utama

1. Pemilik Supabase menjalankan audit read-only pada [`supabase-access-audit.md`](supabase-access-audit.md), lalu meninjau role, grants, RLS dan policy bersama pemilik project.
2. Pisahkan kredensial runtime berhak minimum dari kredensial migrasi; pastikan aplikasi runtime tidak memiliki hak DDL yang tidak diperlukan.
3. Tetapkan retensi audit log termasuk alamat IP; terapkan kebijakan setelah pemilik menyetujui durasi dan mekanisme penghapusan.
4. Verifikasi route sensitif dengan sesi editor, super admin, sesi kedaluwarsa, dan tanpa autentikasi pada lingkungan demo. Uji ini bukan stress test.
5. Lakukan pemeriksaan integrasi dan stress test VPS pada tahap verifikasi akhir yang telah direncanakan.

## Referensi

- [golang-jwt v5 package documentation](https://pkg.go.dev/github.com/golang-jwt/jwt/v5): parser options untuk algoritma yang diizinkan, issuer, dan expiration.
