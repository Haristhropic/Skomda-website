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

Backend Go terhubung langsung ke PostgreSQL dengan `DATABASE_URL`; browser tidak memakai Supabase Data API untuk query tabel pada alur yang ditemukan di repository. Startup memakai GORM `AutoMigrate`. Kode saat ini hanya mencoba mengaktifkan RLS untuk `jurusans`, `news`, `users`, `audit_logs`, `alumnis`, `digital_talents`, dan `trial_class_events`. Model lain yang dimigrasikan—termasuk `trial_class_registrations`, `bkk_jobs`, `bkk_partners`, dan `documents`—tidak tampak menerima perintah enable RLS dari kode startup ini. Hasil `Exec` untuk perintah enable RLS juga tidak diperiksa. Karena itu status aktual harus dibaca dari katalog database.

Karena koneksi direct Postgres mungkin menggunakan role owner, jangan menganggap aktivasi RLS tersebut otomatis melindungi query backend. Beberapa log startup sebelumnya menampilkan user `postgres`; verifikasi role lewat koneksi yang memakai URL aplikasi saat ini sebelum menarik kesimpulan.

Sebelum mengubah grants, role, atau policies:

1. Pastikan pemilik proyek menyetujui perubahan dan memiliki backup yang bisa dipulihkan.
2. Cocokkan setiap tabel dan operasi dengan endpoint/backend yang benar-benar menggunakannya.
3. Siapkan migration SQL yang dapat ditinjau dan rollback yang jelas.
4. Uji dengan role aplikasi dan role `anon`/`authenticated` yang relevan, termasuk kasus yang harus ditolak.
5. Jangan menjalankan `ALTER`, `CREATE POLICY`, `GRANT`, atau `REVOKE` dari audit baca-saja ini.

## Referensi

- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase: Postgres Roles](https://supabase.com/docs/guides/database/postgres/roles)
