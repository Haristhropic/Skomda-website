# Audit Akses Supabase (Baca-Saja)

Dokumen ini ditujukan kepada pemilik proyek Supabase atau administrator database. Tujuannya memeriksa status RLS, policies, grants, serta role koneksi tanpa mengubah schema atau data. Jalankan query pada SQL Editor Supabase. Semua query di bawah bersifat `SELECT`.

> Jangan kirim `DATABASE_URL`, password, JWT, API key, atau output yang memuat data pribadi ke chat atau issue publik. Hasil katalog di bawah umumnya hanya memuat nama tabel, role, dan aturan akses.

## 1. Status RLS dan owner tabel

```sql
SELECT
  n.nspname AS schema_name,
  c.relname AS table_name,
  pg_get_userbyid(c.relowner) AS table_owner,
  c.relrowsecurity AS rls_enabled,
  c.relforcerowsecurity AS rls_forced
FROM pg_class AS c
JOIN pg_namespace AS n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind IN ('r', 'p')
ORDER BY c.relname;
```

`rls_enabled = true` belum cukup untuk menyimpulkan tabel aman. Owner tabel dan role dengan `BYPASSRLS` dapat melewati policy kecuali kondisi role dan `FORCE ROW LEVEL SECURITY` mendukungnya.

## 2. Policies yang terpasang

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual AS using_expression,
  with_check AS check_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Pastikan setiap policy sesuai kebutuhan operasi (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) dan role pemakainya. Tidak adanya policy pada tabel ber-RLS berarti akses melalui role biasa tertolak; role pemilik atau bypass dapat tetap melihat baris.

## 3. Grants eksplisit di schema public

```sql
SELECT
  grantee,
  table_name,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
ORDER BY table_name, grantee, privilege_type;
```

Periksa juga hak efektif role Supabase umum pada setiap tabel:

```sql
SELECT
  c.relname AS table_name,
  r.role_name,
  has_table_privilege(r.role_name, c.oid, 'SELECT') AS can_select,
  has_table_privilege(r.role_name, c.oid, 'INSERT') AS can_insert,
  has_table_privilege(r.role_name, c.oid, 'UPDATE') AS can_update,
  has_table_privilege(r.role_name, c.oid, 'DELETE') AS can_delete
FROM pg_class AS c
JOIN pg_namespace AS n ON n.oid = c.relnamespace
CROSS JOIN (VALUES ('anon'), ('authenticated'), ('service_role')) AS r(role_name)
WHERE n.nspname = 'public'
  AND c.relkind IN ('r', 'p')
ORDER BY c.relname, r.role_name;
```

Grants dan policies harus ditinjau bersama: grant memberi izin operasi pada tabel, sementara policy membatasi baris yang boleh diakses role yang tunduk pada RLS.

## 4. Role dan atribut bypass RLS

```sql
SELECT
  rolname,
  rolsuper,
  rolbypassrls,
  rolcanlogin
FROM pg_roles
WHERE rolname IN ('postgres', 'anon', 'authenticated', 'service_role')
ORDER BY rolname;
```

Jalankan pemeriksaan berikut melalui koneksi yang benar-benar memakai credential `DATABASE_URL` aplikasi, bukan hanya SQL Editor yang mungkin masuk sebagai role berbeda:

```sql
SELECT
  current_user AS current_role,
  session_user AS login_role,
  r.rolsuper,
  r.rolbypassrls
FROM pg_roles AS r
WHERE r.rolname = current_user;
```

Jangan menampilkan connection string saat menjalankan pemeriksaan. Jika koneksi aplikasi memakai role owner/admin atau `rolbypassrls = true`, anggap RLS bukan batas isolasi bagi query Go/GORM tersebut. Keamanan tetap harus dijamin oleh autentikasi dan otorisasi backend, pembatasan jaringan/credential, serta minimisasi grants pada permukaan Data API.

## 5. Konteks aplikasi SKOMDA

Backend Go terhubung langsung ke PostgreSQL dengan `DATABASE_URL`; browser tidak memakai Supabase Data API untuk query tabel pada alur yang ditemukan di repository. Skema sekarang dimigrasikan melalui command eksplisit `/app/migrate`, bukan saat HTTP server production startup. Migrator mengaktifkan RLS dan memeriksa error untuk `jurusans`, `news`, `users`, `audit_logs`, `alumnis`, `digital_talents`, dan `trial_class_events`. Model lain yang dimigrasikan—termasuk `trial_class_registrations`, `bkk_jobs`, `bkk_partners`, dan `documents`—tidak menerima perintah enable RLS dari migrator saat ini. Karena itu status aktual tetap harus dibaca dari katalog database dan role koneksi.

Karena koneksi direct Postgres mungkin menggunakan role owner, jangan menganggap aktivasi RLS tersebut otomatis melindungi query backend. Beberapa log startup sebelumnya menampilkan user `postgres`; verifikasi role lewat koneksi yang memakai URL aplikasi saat ini sebelum menarik kesimpulan.

Sebelum mengubah grants, role, atau policies:

1. Pastikan pemilik proyek menyetujui perubahan dan memiliki backup yang bisa dipulihkan.
2. Cocokkan setiap tabel dan operasi dengan endpoint/backend yang benar-benar menggunakannya.
3. Siapkan migration SQL yang dapat ditinjau dan rollback yang jelas.
4. Uji dengan role aplikasi dan role `anon`/`authenticated` yang relevan, termasuk kasus yang harus ditolak.
5. Jangan menjalankan `ALTER`, `CREATE POLICY`, `GRANT`, atau `REVOKE` dari audit baca-saja ini.

## 6. Hasil audit yang sudah dikonfirmasi

Catatan ini merangkum output audit pemilik database (4 Oktober 2026). Output katalog hanya memuat metadata hak akses; tidak ada credential atau isi data aplikasi.

- Data API Supabase dilaporkan sudah dinonaktifkan dan disimpan. Pemilik juga melaporkan health check backend, proxy same-origin, dan homepage merespons HTTP 200 setelah perubahan tersebut.
- Audit sebelumnya menunjukkan seluruh 17 tabel `public` memberi `anon`, `authenticated`, dan `service_role` hak efektif `SELECT`, `INSERT`, `UPDATE`, dan `DELETE`; 10 tabel tidak mengaktifkan RLS. Tujuh tabel yang mengaktifkan RLS belum tentu aman untuk koneksi backend karena koneksi aplikasi terverifikasi sebagai `postgres`, dengan `rolbypassrls = true`.
- Grant katalog yang dibagikan juga menunjukkan hak tabel yang luas dan default privileges untuk tabel/sequence yang mencakup `anon` serta `authenticated`. Default ACL perlu diperhatikan agar objek yang dibuat kemudian tidak mewarisi akses yang tidak diinginkan.
- Output sequence yang dibagikan terpotong pada `fasilitas_id_seq`. Pada sequence yang terlihat, `anon`, `authenticated`, dan `service_role` masing-masing memiliki `SELECT`, `UPDATE`, dan `USAGE`. Jangan menganggap daftar itu lengkap sampai output utuh tersedia; pola yang terlihat tetap menunjukkan grants yang perlu ditinjau.

> **Kesimpulan sementara:** Data API yang mati mengurangi permukaan akses HTTP Supabase, tetapi tidak menghapus grants katalog maupun menyelesaikan penggunaan role `postgres` oleh backend. Jangan mengaktifkan Data API kembali sebelum grants, policies, dan role aplikasi dirancang ulang dan diuji.

### Arah remediasi (belum dijalankan)

1. Pertahankan `DATABASE_URL` migrasi khusus untuk command migrasi dan gunakan role runtime terpisah dengan `LOGIN`, `NOBYPASSRLS`, tanpa hak DDL, dan grants DML yang dibatasi sesuai pemakaian backend.
2. Inventarisasi tabel, operasi, foreign key/sequence, dan tabel yang memakai RLS sebelum menetapkan grants. Tabel RLS tanpa policy untuk role runtime akan menolak query; jangan menambahkan policy `USING (true)` secara otomatis.
3. Tinjau penghapusan grant `anon` dan `authenticated` pada tabel/sequence `public`, serta default ACL untuk objek yang dibuat role migrasi. Keputusan untuk `service_role` dan role terkelola Supabase perlu mempertimbangkan apakah Supabase Auth/Storage atau API akan dipakai kembali.
4. Buat SQL perubahan yang eksplisit, dapat diulang, dan memiliki langkah pemulihan; tinjau dahulu sebelum pemilik database menjalankannya.
5. Verifikasi akses dengan role runtime baru, pastikan role publik yang tidak digunakan gagal mengakses tabel, lalu jalankan smoke test aplikasi. Baru setelah itu pertimbangkan apakah Data API tetap mati atau perlu diaktifkan dengan grants minimum.

Belum ada perubahan grants, role, policy, schema, atau data yang dijalankan sebagai bagian dari audit ini. Kredensial database tidak diperlukan untuk menyusun rencana; jangan membagikannya lewat chat.

### Matriks operasi runtime dari handler saat ini

Matriks ini diturunkan dari handler Fiber/GORM yang ada di repository. Ini menunjukkan operasi SQL yang perlu didukung oleh satu role runtime, bukan izin yang harus diberikan kepada `anon` atau browser.

| Tabel | Operasi runtime teramati | Jalur/fungsi utama | Catatan |
| --- | --- | --- | --- |
| `jurusans` | SELECT | daftar/detail jurusan | Endpoint baca publik. |
| `news` | SELECT, INSERT, UPDATE, DELETE | feed publik dan pengelolaan berita | Audit berita ditulis terpisah ke `audit_logs`. |
| `users` | SELECT, INSERT, UPDATE | login, daftar admin, ganti role, statistik | Tidak ditemukan operasi hapus user di handler saat ini. |
| `audit_logs` | SELECT, INSERT | login, perubahan berita, halaman audit admin | Tidak ditemukan UPDATE/DELETE runtime. |
| `teachers` | SELECT, INSERT, UPDATE, DELETE | daftar dan pengelolaan guru | DELETE dibatasi middleware ke super admin. |
| `prestasis` | SELECT, INSERT, UPDATE, DELETE | daftar dan pengelolaan prestasi | DELETE dibatasi middleware ke super admin. |
| `bkk_jobs` | SELECT, INSERT, UPDATE, DELETE | daftar, pengajuan lowongan, pengelolaan BKK | Endpoint publik mengirim INSERT; perubahan status admin. |
| `bkk_partners` | SELECT, INSERT, UPDATE, DELETE | daftar dan pengelolaan mitra BKK | DELETE dibatasi middleware ke super admin. |
| `bkk_alumnis` | belum ditemukan di handler API | seeder/migrator | Jangan beri grant runtime sebelum memastikan fitur memakai tabel ini. |
| `ekstrakurikulers` | SELECT, INSERT, UPDATE, DELETE | daftar dan pengelolaan ekstrakurikuler | DELETE dibatasi middleware ke super admin. |
| `fasilitas` | SELECT, INSERT, UPDATE, DELETE | daftar dan pengelolaan fasilitas | DELETE dibatasi middleware ke super admin. |
| `documents` | SELECT, INSERT, UPDATE, DELETE | dokumen publik/admin dan brosur aktif | Operasi settings brosur juga memakai `site_settings`. |
| `site_settings` | SELECT, INSERT, UPDATE | pengaturan admin dan brosur aktif | Tidak ditemukan operasi DELETE runtime. |
| `alumnis` | SELECT, INSERT, UPDATE, DELETE | daftar/detail dan pengelolaan alumni | Detail sensitif admin memakai middleware; ada juga baca daftar publik. |
| `digital_talents` | SELECT, INSERT, UPDATE, DELETE | daftar/detail dan pengelolaan digital talent | DELETE dibatasi middleware ke super admin. |
| `trial_class_registrations` | SELECT, INSERT, UPDATE, DELETE | daftar, pendaftaran, pengecekan tiket, pengelolaan admin | Data pendaftar bersifat pribadi; jangan pernah beri akses langsung ke browser. |
| `trial_class_events` | SELECT, INSERT, UPDATE | baca event aktif dan pengelolaan event | Tidak ditemukan operasi DELETE runtime. |

**Implikasi untuk desain grant:** beri browser tanpa koneksi database; role runtime mendapatkan hanya operasi yang tercatat per tabel dan `USAGE` sequence yang benar-benar dipakai insert. Jangan berikan `UPDATE` pada sequence jika insert cukup dengan `USAGE`. `bkk_alumnis` perlu konfirmasi pemakaian sebelum diberi privilege.

**Batas RLS saat ini:** backend memakai satu role database untuk request publik dan admin. Memberi policy akses semua baris kepada role runtime hanya menjaga tabel dari role lain; itu tidak menciptakan isolasi per pengguna dan tidak menggantikan middleware JWT/role admin. Agar RLS memisahkan baris per admin, aplikasi harus mengikat identitas JWT yang sudah diverifikasi ke konteks transaksi database secara aman. Itu perubahan desain terpisah dan tidak termasuk remediasi grants awal.

## Referensi

- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase: Postgres Roles](https://supabase.com/docs/guides/database/postgres/roles)
