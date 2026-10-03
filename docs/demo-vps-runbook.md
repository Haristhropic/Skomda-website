# Runbook Demo VPS SKOMDA

Panduan ini memisahkan pekerjaan repo/pipeline dari konfigurasi VPS yang dilakukan pemilik. Targetnya hanya demo; tidak mengubah DNS domain utama.

## Bentuk deployment

```text
linear.smktelkom-sidoarjo.my.id      -> Webuzo reverse proxy -> 127.0.0.1:3000 (Next.js)
api-linear.smktelkom-sidoarjo.my.id  -> Webuzo reverse proxy -> 127.0.0.1:8080 (Go API)
```

Repo Next.js juga memiliki route `/api/dtp`, `/api/upload/document`, dan `/api/virtual-class/video`. Karena itu backend Go **jangan** dipasang sebagai proxy untuk semua path `/api/*` pada host `linear`; gunakan host API terpisah seperti di atas agar route API milik Next.js tetap bisa diakses.

## Yang perlu disiapkan pemilik pada VPS

1. Pastikan Ubuntu 24.04 mendapat update keamanan, lalu pasang Docker Engine dan Docker Compose plugin dari panduan resmi Docker. Jangan memasang Docker lewat skrip acak.
2. Buat user deployment non-root khusus. Gunakan SSH key saja dan batasi akses SSH. Akses ke Docker setara akses root, jadi jangan gunakan akun admin pribadi untuk pipeline.
3. Buat folder deployment, misalnya `/opt/skomda-demo`, dan letakkan `compose.yaml`, `deploy.env.example` yang disalin sebagai `deploy.env`, serta `scripts/deploy-demo.sh` di checkout `deploy` yang dipercaya.
4. Isi `deploy.env` dengan owner/repository GitHub yang huruf kecil, URL frontend/API demo, dan batas resource yang sesuai. Jangan menaruh secret di file ini.
5. Buat `/opt/skomda-demo/backend/.env` dengan permission `600`, milik user deploy. Isi sekurangnya `ENV=production`, `DATABASE_DRIVER=postgres`, `DATABASE_URL`, `JWT_SECRET` acak kuat, `ADMIN_DEFAULT_PASSWORD` acak minimal 16 karakter, dan `ALLOWED_ORIGIN=https://linear.smktelkom-sidoarjo.my.id`; tambahkan secret layanan lain yang memang digunakan aplikasi. Jangan salin nilai `.env` ke chat atau repo. Seeder akan membuat akun awal hanya jika tabel users kosong; ganti password awal setelah login pertama.
6. Sebelum startup pertama, pastikan URL mengarah ke project Supabase yang benar dan pemilik database menyetujui pemakaian project tersebut. Backend menjalankan GORM `AutoMigrate` dan beberapa seeder ketika start; ambil/konfirmasi backup dan tinjau data/schema yang sudah ada sebelum menghubungkannya. Hak role database harus cukup untuk operasi migrasi yang memang diaktifkan aplikasi.
7. Jika GHCR package private, lakukan `docker login ghcr.io` sebagai user deploy memakai token GitHub dengan scope minimum `read:packages`. Jika package public, login tidak diperlukan. Simpan Docker credential dengan permission terbatas.
8. Pastikan host port `3000` dan `8080` hanya bind ke loopback seperti Compose, dan firewall publik hanya membuka port yang dibutuhkan Webuzo/reverse proxy. Jangan buka port app langsung ke internet.

## DNS, TLS, dan Webuzo

Pemilik mengatur dua hostname demo di Cloudflare ke alamat VPS: `linear` dan `api-linear`. Record `server` tetap untuk panel Webuzo. Tidak ada perubahan ke apex/domain utama pada tahap demo.

Di Webuzo, buat reverse proxy untuk `linear` ke `http://127.0.0.1:3000` dan `api-linear` ke `http://127.0.0.1:8080`; pertahankan path API `/api/...` apa adanya, serta teruskan `Host`, `X-Forwarded-For`, dan `X-Forwarded-Proto`. Pasang sertifikat valid di origin, lalu atur Cloudflare SSL/TLS ke **Full (strict)**. Verifikasi bahwa proxy Webuzo tidak mengubah atau menghapus path `/api`.

## GitHub Actions

1. Pastikan workflow `CI and demo deployment` hijau untuk branch `deploy`. Job deploy tetap nonaktif sampai `DEMO_DEPLOY_ENABLED=true`.
2. Pada Settings → Environments, buat environment `demo`; batasi deployment branch ke `deploy`. Tambahkan secrets berikut pada environment:
   - `VPS_HOST`: alamat IP publik atau hostname SSH VPS.
   - `VPS_USER`: user deployment non-root.
   - `VPS_SSH_PRIVATE_KEY`: private key khusus pipeline.
   - `VPS_KNOWN_HOSTS`: host key SSH yang fingerprint-nya sudah diverifikasi secara terpisah. Untuk port nonstandar, entri known_hosts biasanya berbentuk `[HOST]:PORT`.
3. Tambahkan environment variables `VPS_DEPLOY_PATH=/opt/skomda-demo` dan `VPS_SSH_PORT=58300`. Port `22` digunakan bila `VPS_SSH_PORT` tidak diatur.
4. Tambahkan repository Actions variable `DEMO_DEPLOY_ENABLED=true` hanya setelah seluruh preflight server selesai. Variable ini dibaca pada kondisi job sebelum job memasuki environment `demo`.
5. Opsional: set repository variable `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`. Docker Scout bisa diaktifkan dengan repository variable `DOCKER_SCOUT_ENABLED=true`; siapkan `DOCKER_SCOUT_HUB_USER` sebagai variable dan `DOCKER_SCOUT_HUB_PASSWORD` sebagai secret bila ingin menggunakannya.

GitHub Actions membangun dan mem-push image dengan tag SHA commit. VPS menarik tag immutable itu. `demo-latest` hanya tag kenyamanan untuk inspeksi dan bukan identitas deployment yang dipakai rollback.

## Preflight dan smoke check oleh pemilik

- Cek `docker compose --env-file deploy.env config` di folder deployment; jangan menampilkan hasil yang mengandung environment secrets.
- Pastikan file `backend/.env` ada, permission-nya `600`, dan `DATABASE_DRIVER=postgres`.
- Pastikan dua hostname resolve ke VPS, sertifikat origin valid, dan Webuzo meneruskan ke port loopback yang tepat.
- Jalankan workflow CI/build dahulu. Aktifkan deploy hanya setelah siap menerima deployment pertama.
- Setelah deploy, cek `docker compose --env-file deploy.env ps`, `docker compose --env-file deploy.env logs --tail=100 backend frontend`, lalu buka homepage demo dan endpoint health API `https://api-linear.smktelkom-sidoarjo.my.id/api/health`.
- Periksa flow baca data publik, login admin, satu operasi tulis yang aman, dan upload media sebelum mengundang pengguna demo.

## Rollback

Workflow deploy menyimpan tag image aktif di `.deployed-image-tag`. Jika update menjadi unhealthy, skrip mencoba menarik dan menjalankan tag sebelumnya. Untuk pemulihan manual, gunakan nilai tag sebelumnya yang diketahui baik:

```bash
IMAGE_TAG=<tag-sha-sebelumnya> docker compose --env-file deploy.env pull
IMAGE_TAG=<tag-sha-sebelumnya> docker compose --env-file deploy.env up -d --no-build --wait --remove-orphans
docker compose --env-file deploy.env ps
```

Deployment pertama belum memiliki tag sebelumnya untuk rollback otomatis. Perintah rollback image tidak membatalkan perubahan skema atau isi database; karena itu backup dan tinjauan migrasi diperlukan sebelum data penting atau domain utama dipakai.

## Batas tanggung jawab

- Repo menyiapkan Dockerfiles, Compose, workflow, dan skrip deploy/rollback.
- Pemilik menyiapkan VPS, user SSH, GHCR access bila package private, `.env`, Cloudflare DNS, TLS, dan reverse proxy Webuzo.
- Jangan aktifkan `DEMO_DEPLOY_ENABLED` atau arahkan domain utama sebelum pemilik menyelesaikan preflight dan menyetujui rilis demo.

Rujukan: [Docker Engine di Ubuntu](https://docs.docker.com/engine/install/ubuntu/), [Cloudflare Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/), [GitHub Actions deployment environments](https://docs.github.com/en/actions/concepts/deployment-environments).
