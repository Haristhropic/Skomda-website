# Backup dan pemulihan SKOMDA

Panduan operator, 4 Oktober 2026. Backup harian terenkripsi di VPS dan latihan restore terisolasi sudah dijalankan. Salinan independen pertama sudah dipindahkan ke komputer pemilik. Pengiriman offsite otomatis dan notifikasi masih menunggu tujuan serta kredensial yang diperlukan.

## Cakupan backup

Perintah `pg_dump --format=custom --no-owner --schema=public --schema=skomda_internal` mencadangkan struktur dan data aplikasi beserta riwayat migrasi Goose. Backup ini tidak menyertakan schema `auth` dan `storage` yang dikelola Supabase, file Cloudinary, secret, konfigurasi runtime, atau seluruh role PostgreSQL. File `public-schema.sql` hanya memuat schema dan bukan backup data.

Archive dienkripsi dengan AES-256-CBC dan PBKDF2, memakai 200.000 iterasi serta salt. HMAC-SHA256 atas ciphertext digunakan untuk memeriksa integritas sebelum dekripsi. Metadata berisi hash, ukuran, dan waktu; tidak memuat data aplikasi. File sementara yang belum terenkripsi dihapus dalam blok `finally`. Kunci pemulihan harus disimpan terpisah dari archive.

## Jadwal, lokasi, dan hasil latihan

Cron milik user `deploy` menjalankan `backup-encrypted.py` setiap pukul 02:00 menurut waktu VPS. Backup disimpan selama 7 hari di `/opt/skomda-demo/backups`. Kunci `/opt/skomda-demo/secrets/backup.pass` memiliki permission `600` dan foldernya `700`. Jangan membagikan kunci atau mengirim dump ke chat maupun GitHub.

Backup pertama, `20261004T103808Z.dump.enc` berukuran 134.304 byte, berhasil direstore ke container PostgreSQL 17 tanpa jaringan. Pemeriksaan menemukan 17 tabel aplikasi dan versi migrasi 2. Database production tidak ditimpa. Salinan archive beserta metadata disimpan di `C:\Users\Haris\Downloads\Skomda-backups`. Kunci pemulihan terpisah berada di `C:\Users\Haris\.ssh\skomda-backup-recovery`, dengan ACL Windows untuk pengguna saat ini.

RPO 24 jam dan RTO 4 jam merupakan sasaran. Latihan restore dengan backup kecil ini belum membuktikan waktu pemulihan seluruh VPS, media, atau database yang lebih besar di masa depan. Salinan yang hanya berada di VPS tidak melindungi dari kehilangan VPS.

## Menjalankan backup manual

Jalankan melalui SSH sebagai user `deploy`:

```bash
cd /opt/skomda-demo || exit
python3 ./backup-encrypted.py
ls -lh backups/*.enc backups/*.json
```

Pastikan output menunjukkan `status: ok`, lalu periksa hasil cron untuk backup terjadwal. Jangan menampilkan isi `migrate.env` atau kunci. Proses backup menggunakan koneksi migrasi atau admin; role runtime aplikasi tidak memiliki hak DDL.

## Melakukan latihan restore

Script restore hanya mengembalikan data ke container PostgreSQL sementara dengan `--network none`. Script membuat role runtime dengan `NOLOGIN` untuk policy, lalu memeriksa jumlah tabel dan riwayat migrasi. Script ini tidak memulihkan data ke Supabase aktif.

```bash
cd /opt/skomda-demo || exit
python3 ./restore-backup-check.py backups/20261004T103808Z.dump.enc
```

Gunakan nama archive yang hendak diuji. Pastikan metadata pasangannya tersedia dan kuncinya benar. Jika format perintah berubah, periksa `python3 ./restore-backup-check.py --help`. Hash saja tidak membuktikan backup dapat direstore; periksa hasil `restored_in_isolation` dan `production_modified=false`.

## Memulihkan setelah insiden

1. Hentikan perubahan yang berisiko. Catat nama backup, waktu UTC, dan SHA aplikasi.
2. Tentukan database tujuan baru dan titik pemulihan bersama pemilik. Jangan melakukan percobaan restore pada database aktif.
3. Verifikasi HMAC, lalu dekripsi menggunakan kunci pemulihan yang disimpan terpisah. Restore ke tujuan yang sudah ditentukan dan tinjau role, grants, RLS, serta extension.
4. Validasi aplikasi dan data tanpa menampilkan data pribadi. Pulihkan password role runtime dan secret dari penyimpanan kredensial yang aman.
5. Alihkan `DATABASE_URL` setelah validasi berhasil. Siapkan cara kembali ke konfigurasi sebelumnya dan rollback aplikasi yang kompatibel.
6. Catat RPO dan RTO aktual, perubahan yang hilang, hasil pemeriksaan, dan tindakan lanjutan.

## Media dan akses akun

File Cloudinary tidak ikut dalam dump database. Aset asli di repo tetap disimpan; media baru yang diunggah membutuhkan export atau backup media tersendiri. Pemilik perlu menjaga akses pemulihan akun Supabase dan Cloudinary. Manifest Cloudinary bukan salinan file media. Image GHCR membantu rollback aplikasi, tetapi tidak memulihkan database.

## Mengaktifkan offsite otomatis

Pengiriman otomatis memerlukan bucket privat S3 atau R2, atau server lain, kredensial khusus backup dengan hak minimum, kebijakan retensi dan versioning, serta tujuan notifikasi. Unggah ciphertext beserta metadata saja. Jangan simpan kunci dekripsi di bucket yang sama.

Backup harian di VPS dan salinan independen pertama sudah tersedia. Pengiriman offsite otomatis serta notifikasi belum aktif sampai tujuan dan kredensial tersebut dikonfigurasi.
