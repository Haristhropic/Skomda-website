# Backup dan Recovery SKOMDA

**Status:** desain dan prosedur operator; backup otomatis serta uji restore belum dikonfigurasi

Dokumen ini melengkapi [runbook demo VPS](demo-vps-runbook.md). Jangan menganggap database aman dipulihkan hanya karena aplikasi sehat atau deployment image bisa di-rollback.

## Checkpoint wajib sebelum baseline migrasi

Repo memiliki file `public-schema.sql` hasil dump **schema-only**. File itu membantu membandingkan struktur untuk baseline Goose, tetapi **tidak berisi data dan bukan backup yang bisa memulihkan isi database**. Jangan jalankan `--baseline-existing` sampai ada backup data bertanggal setelah perubahan data terakhir dan pemilik proyek menyetujui pemakaiannya.

Pilih salah satu jalur berikut:

1. **Backup Supabase yang dikelola provider:** pemilik project memeriksa Database → Backups, memastikan backup terbaru mencakup waktu perubahan terakhir, serta memastikan plan tersebut memberi kemampuan restore yang dibutuhkan. Ketersediaan dan retensi berbeda menurut plan; Free tidak menyediakan backup database untuk diunduh. Mengandalkan restore provider saja tidak membuat salinan independen.
2. **Logical dump lokal:** bila backup provider tidak dapat diunduh/dipulihkan untuk kebutuhan ini, buat dump sebelum migrasi ke komputer tepercaya. Ikuti Tahap 1 pada [`supabase-runtime-role-runbook.md`](supabase-runtime-role-runbook.md). Perintah `pg_dump --format=custom --schema=public` menyertakan data tabel `public` secara default, kecuali ditambahkan `--schema-only` atau `--data-only`. Itu tidak mencadangkan schema Supabase-managed seperti `auth` dan `storage`, atau aset Cloudinary. Pastikan cakupan tersebut sesuai dengan kebutuhan pemulihan aplikasi.

Logical dump dapat memuat data pribadi siswa/pengguna. Simpan di disk lokal terenkripsi dengan akses terbatas; jangan unggah ke chat, GitHub, repo, atau VPS. Catat hanya path lokal, ukuran, waktu, dan SHA-256. `pg_restore --list` dapat memeriksa bahwa arsip dapat dibaca, tetapi **belum membuktikan restore berhasil**; pemulihan tetap perlu diuji ke database/project terisolasi dengan persetujuan pemilik.

**Checkpoint untuk operator:** laporkan plan dan waktu backup provider, atau konfirmasi bahwa logical dump lokal selesai beserta ukuran dan SHA-256. Jangan kirim file dump maupun isi `.env`/connection string. Setelah checkpoint ini diverifikasi, lanjut ke perbandingan schema terbaru dan migrasi ledger.

## Sasaran awal

| Ukuran | Sasaran sementara | Catatan |
|---|---:|---|
| RPO database | Maksimum 24 jam kehilangan perubahan | Perlu backup independen harian dan alarm jika gagal. Belum terjamin sekarang. |
| RTO database | Maksimum 4 jam untuk layanan inti | Target awal yang harus diukur dalam latihan restore. |
| Salinan independen | Di luar VPS dan akun GitHub repository | Pilihan praktis: private object storage terpisah, misalnya Cloudflare R2. Bucket, kredensial, enkripsi, dan retensi belum disiapkan. |
| Uji pemulihan | Sebelum promosi ke domain utama dan setelah perubahan prosedur | Restore ke project Supabase baru/terisolasi; jangan bereksperimen di database aktif. |

RPO/RTO di atas adalah target rancangan, bukan jaminan layanan saat ini. Pemilik proyek perlu menyetujuinya setelah meninjau kebutuhan lomba dan kemampuan akun Supabase.

## Cakupan backup

1. **PostgreSQL:** data aplikasi, skema, dan definisi role yang memang perlu dipulihkan. Periksa apakah project menggunakan objek khusus, extension, trigger, atau policy pada skema Supabase-managed.
2. **Media Cloudinary:** gambar/dokumen tidak ikut di dalam dump PostgreSQL. Database hanya menyimpan URL/identitas media. Pastikan akun Cloudinary dimiliki atau dapat dipulihkan oleh tim, catat cloud name dan asset `public_id`, lalu tentukan apakah perlu salinan file asli ke object storage terpisah.
3. **Konfigurasi:** simpan salinan konfigurasi non-secret di repo. Secret runtime/tunnel/CI harus punya prosedur rotasi dan pemulihan di password manager pemilik; jangan memasukkannya ke dump, repo, issue, atau artefak CI.
4. **Image aplikasi:** GHCR berisi image bertag commit untuk rollback aplikasi; ini bukan backup database atau media.

Fallback upload ke filesystem `/uploads` atau `/documents` hanya digunakan pada development. Endpoint production mengembalikan `503` ketika Cloudinary belum dikonfigurasi atau upload gagal, sehingga file yang hanya ada di filesystem container tidak dianggap berhasil tersimpan. File lokal lama tetap bukan penyimpanan durable dan tidak tercakup backup Cloudinary.

## Lapisan backup yang disarankan

### 1. Backup yang dikelola Supabase

Pemilik proyek Supabase harus memeriksa di Dashboard: plan aktif, waktu backup, retensi aktual, cakupan restore, dan apakah PITR tersedia/diaktifkan. Ketersediaan dan retensi bergantung pada plan/add-on, jadi jangan mengasumsikannya. Backup provider adalah lapisan pemulihan utama dari kegagalan/kerusakan project, tetapi belum menjadi salinan independen yang dikendalikan tim.

### 2. Dump logis terenkripsi di lokasi independen

Setelah pemilik Supabase menyetujui dan lokasi penyimpanan disiapkan:

1. Jalankan backup harian dari mesin operasional tepercaya dengan Supabase CLI versi tercatat, menggunakan connection string yang diambil pemilik dari Dashboard. Jangan menaruh connection string langsung di command history atau log.
2. Ambil role, schema, dan data sebagai artefak terpisah sesuai prosedur resmi Supabase CLI. CLI memerlukan koneksi database dan menulis dump SQL; lindungi direktori sementara dengan akses user saja.
3. Enkripsi segera menggunakan kunci publik backup yang privat dan simpan kunci dekripsi offline pada pemilik. Pastikan ukuran/hash file tercatat; hapus dump plaintext sementara setelah verifikasi enkripsi.
4. Unggah hanya ciphertext ke bucket privat yang aksesnya minimum, dengan versioning/retensi dan kredensial khusus backup. Jangan simpan satu-satunya salinan di VPS yang sama, repo, atau GitHub Actions artifacts.
5. Alarm jika job gagal atau backup terakhir melewati 24 jam. Simpan manifest waktu, project-ref, versi CLI, ukuran, hash, dan status enkripsi—tanpa URL database atau data personal.

Cloudflare R2 adalah kandidat tujuan karena Cloudflare sudah digunakan, tetapi belum ada bucket/credential yang dikonfigurasi. Jangan aktifkan job terjadwal sebelum pemilik menentukan bucket, retensi, penerima kunci enkripsi, dan siapa yang memegang kunci dekripsi.

## Prosedur pemulihan database

1. **Deklarasikan insiden dan hentikan perubahan berisiko.** Jangan menjalankan migrator, seeder, atau restore ke database aktif saat sumber masalah belum dipahami.
2. **Tentukan titik pemulihan.** Pilih backup provider atau dump terenkripsi terakhir yang lolos pemeriksaan hash; catat waktu backup dan perkiraan perubahan yang akan hilang.
3. **Buat project/target PostgreSQL baru yang terisolasi.** Jangan restore langsung ke project sumber sebagai percobaan. Konfigurasi extension, encryption root key, role, dan kebijakan yang diperlukan bersama pemilik Supabase.
4. **Pulihkan dan validasi** sesuai format backup resmi. Cek tabel inti, jumlah record yang wajar, constraint, grants/RLS, dan koneksi backend melalui smoke check terkontrol. Jangan mencetak isi data siswa ke log.
5. **Putuskan cutover bersama pemilik.** Perbarui secret `DATABASE_URL` hanya setelah target dipastikan benar, siapkan image rollback dan rencana kembali ke database lama, lalu deploy ketika disetujui.
6. **Catat hasil latihan/insiden:** backup yang dipakai, RPO aktual, RTO aktual, error, dan tindakan pencegahan.

Supabase mendokumentasikan dump CLI sebagai file role/schema/data terpisah dan contoh restore manual ke project baru. Restore bukan satu command universal: perlakuan schema/extension, custom roles, Auth/Storage, encryption, dan fungsi/policy khusus perlu diperiksa untuk project terkait. Gunakan instruksi Dashboard/CLI terbaru saat latihan.

## Pemulihan media dan aplikasi

- **Cloudinary:** pastikan pemilik akun dan akses administrator diketahui minimal dua anggota tepercaya. Inventarisasi aset melalui `scripts/sync-cloudinary.mjs` hanya sebagai audit/manifest; script tersebut bukan backup file. Bila salinan offsite diperlukan, implementasikan ekspor/download dan restore aset secara terpisah, termasuk menjaga `public_id`/URL agar referensi DB tetap valid.
- **VPS gagal:** buat VPS baru, pasang Docker dan Compose, pulihkan file konfigurasi/secret dari password manager, login GHCR, jalankan image commit yang diketahui sehat, lalu sambungkan Tunnel. GHCR image tidak membawa database.
- **Skema gagal:** rollback image tidak membalikkan migrasi. Migrasi perlu kompatibel mundur; pulihkan database hanya bila perubahan data/skema tidak dapat diperbaiki secara aman.

## Checklist sebelum otomatisasi dan promosi domain utama

- [ ] Pemilik Supabase mengonfirmasi plan, jadwal/retensi backup, hak restore, project-ref demo/production, dan jalur akses bila pemilik akun tidak tersedia.
- [ ] Sepakati bucket offsite privat, retensi, enkripsi, pemegang kunci, biaya, serta notifikasi kegagalan.
- [ ] Sepakati kepemilikan dan pemulihan aset Cloudinary; putuskan nasib fallback `/uploads`.
- [ ] Buat job backup harian yang menulis ciphertext saja ke tujuan offsite.
- [ ] Buktikan restore ke target terisolasi; ukur RPO/RTO aktual dan catat hasilnya.
- [ ] Jangan alihkan domain utama sampai checklist ini, hardening akses database, observability, serta approval rilis terpenuhi.

## Referensi resmi

- [Supabase: Backup and Restore using the CLI](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore)
- [Supabase: Automated backups using GitHub Actions](https://supabase.com/docs/guides/deployment/ci/backups)
- [Supabase: Database backups](https://supabase.com/features/database-backups)
