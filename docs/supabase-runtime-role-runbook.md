# Runbook: role database runtime SKOMDA

Panduan ini mengganti koneksi backend dari role admin `postgres` ke role khusus runtime. **Belum ada SQL di panduan ini yang sudah dijalankan.** Jalankan tahap satu per satu dan berhenti jika output berbeda dari yang dijelaskan.

## Tujuan dan batas

- Backend tetap memakai koneksi PostgreSQL langsung melalui Supabase pooler; browser tidak mendapat kredensial database.
- `DATABASE_URL` runtime backend memakai role baru dengan privilege minimum yang dipetakan dari handler.
- `backend/migrate.env` tetap memakai koneksi admin yang hanya dipakai command migrasi eksplisit.
- Data API tetap nonaktif. Grants `anon`/`authenticated` bukan pengganti sakelar Data API.
- Role runtime bersama tidak membuat RLS memisahkan editor dan super admin. JWT dan middleware backend tetap batas role admin.

## Tahapan eksekusi operator

### Tahap 1 — pastikan ada backup yang bisa dipakai

**Yang kamu lakukan:**

1. Minta pemilik Supabase menyetujui perubahan role untuk database proyek ini.
2. Di Supabase Dashboard, buka **Database → Backups** dan catat plan serta waktu backup paling baru.
3. Jika project Free atau tidak ada backup yang bisa diunduh/dipulihkan, buat logical dump ke komputer lokal sebelum perubahan. Di Windows PowerShell, setelah memasang PostgreSQL command-line tools, salin hostname pooler dan project reference dari dialog **Connect → Session pooler**, lalu jalankan:

   ```powershell
   pg_dump --format=custom --no-owner --schema=public `
     --host "POOLER_HOST_FROM_CONNECT" --port 5432 `
     --username "postgres.PROJECT_REF" --dbname postgres `
     --file "$env:USERPROFILE\Downloads\skomda-before-runtime-role.dump" `
     --password
   ```

   Ganti dua placeholder yang berada di dalam tanda kutip dengan host dan project reference dari dialog Connect. Saat diminta, masukkan password database di prompt terminal; jangan menambahkannya ke command atau mengirimkannya ke chat. Simpan dump seperti data siswa yang sensitif, jangan unggah ke chat. Pastikan file dump ada dan ukurannya lebih dari 0:

   ```powershell
   Get-Item "$env:USERPROFILE\Downloads\skomda-before-runtime-role.dump" |
     Select-Object FullName, Length, LastWriteTime
   ```

**Berhenti di sini dan laporkan:** plan Supabase, waktu backup terakhir atau lokasi/ukuran file dump. Jangan kirim dump database ke chat karena dapat berisi data pribadi.

### Tahap 2 — siapkan role tanpa mengubah koneksi live

Setelah Tahap 1 terkonfirmasi, operator membuat role login runtime terpisah. Gunakan password manager untuk membuat password unik. Jangan mengubah password `postgres`. Untuk shared pooler, username koneksi custom role berbentuk `<ROLE>.<PROJECT_REF>`; hostname, port, dan mode harus disalin dari **Connect** di project, jangan ditebak.

Role runtime yang direncanakan: `skomda_runtime`, dengan `LOGIN`, `NOSUPERUSER`, `NOCREATEDB`, `NOCREATEROLE`, `NOREPLICATION`, dan `NOBYPASSRLS`. Jangan beri membership ke `postgres`, `service_role`, `anon`, atau `authenticated`.

SQL pembuatan role, penetapan password, table grants, sequence grants, dan policy akan disiapkan sebagai satu perubahan bertahap setelah backup dikonfirmasi. Jangan jalankan SQL hasil tebakan atau `GRANT ALL`.

### Tahap 3 — beri grants/policies minimum

Grant mengikuti matriks dalam [supabase-access-audit.md](supabase-access-audit.md). Role mendapat privilege hanya untuk tabel yang dipakai runtime. `bkk_alumnis` belum teramati dipakai handler API dan tidak akan diberi grant sampai ada bukti kebutuhan.

Tabel ber-RLS yang dipakai backend perlu policy untuk role baru. Policy runtime hanya mengizinkan tabel/operasi yang diperlukan; ia tidak memisahkan baris per administrator karena koneksi runtime dipakai bersama.

### Tahap 4 — verifikasi sebelum cutover

Gunakan koneksi baru untuk memastikan role yang terhubung benar-benar `skomda_runtime`, `rolsuper = false`, `rolbypassrls = false`, `rolcanlogin = true`, `current_schema() = 'public'`, dan dapat menjalankan query/insert/update yang memang dibutuhkan. Jangan melakukan INSERT uji pada tabel produksi yang mengirim email, mengubah data sekolah, atau menyimpan pendaftaran. Untuk operasi tulis, gunakan transaksi yang di-`ROLLBACK` dan data uji yang jelas aman.

### Tahap 5 — ganti koneksi backend, migrasi tetap admin

Simpan backup file konfigurasi VPS terlebih dahulu. Ubah hanya `DATABASE_URL` dalam `/opt/skomda-demo/backend/.env` menjadi URL role runtime. Biarkan `/opt/skomda-demo/backend/migrate.env` memakai koneksi migrasi/admin. Kedua file tetap mode `600`; jangan tampilkan nilainya ke terminal/chat.

Recreate backend saja, periksa health dan log tanpa mencetak environment, lalu smoke-test homepage, endpoint API publik, login admin, baca admin, dan satu operasi tulis aman. Jangan jalankan command migrasi pada URL runtime.

### Tahap 6 — pemulihan jika runtime gagal

Jika backend tidak sehat, pulihkan file `.env` runtime dari salinan sebelum cutover, recreate backend, lalu pastikan health kembali normal. Jangan hapus role baru atau revoke grants ketika investigasi berlangsung; koneksi lama/migrasi perlu tetap tersedia sampai rollback terverifikasi.

### Tahap 7 — kurangi grants role Supabase umum

Tahap ini terpisah dari cutover runtime. Data API saat ini nonaktif, jadi tidak perlu menjalankan `REVOKE` sebagai langkah darurat. Setelah pemilik project memastikan tidak ada produk lain yang memakai REST/GraphQL Data API untuk objek `public`, siapkan perubahan terpisah untuk grants eksplisit `anon`, `authenticated`, dan `service_role`.

Default ACL milik role internal `supabase_admin` adalah bagian model permission Supabase dan jangan dimodifikasi langsung. Supabase menyatakan grants default tersebut tidak melewati RLS dan role internal itu tidak mengautentikasi melalui Data API. Untuk default privileges milik role migrator `postgres`, perubahan hanya dilakukan setelah memeriksa role yang benar-benar membuat objek; grants eksplisit tetap perlu ditinjau terpisah.

## Referensi resmi

- [Supabase: Postgres Roles](https://supabase.com/docs/guides/database/postgres/roles)
- [Supabase: Securing your API](https://supabase.com/docs/guides/api/securing-your-api)
- [Supabase: Connect to your database](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Supabase: Backup and Restore using the CLI](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore)
- [Supabase: Production Checklist](https://supabase.com/docs/guides/deployment/going-into-prod)
