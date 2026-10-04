# Runbook Demo VPS SKOMDA

Panduan ini menjelaskan deployment demo pada VPS dan konfigurasi yang dilakukan pemilik. Targetnya hanya subdomain demo; domain utama tetap di luar pipeline.

Prosedur salinan database/media dan pemulihan ada di [backup-and-recovery-runbook.md](backup-and-recovery-runbook.md). Backup dan uji restore belum dikonfigurasi; sebelum migrasi berisiko, pemilik perlu memastikan ada titik pemulihan yang dapat dipakai.

## Bentuk deployment

```text
Browser -> Cloudflare DNS/proxy -> Cloudflare Tunnel (skomda-demo-vps)
  linear.smktelkom-sidoarjo.my.id      -> http://frontend:3000 (Next.js container)
  api-linear.smktelkom-sidoarjo.my.id  -> http://backend:8080 (Go API; public API/health)
  Admin browser calls /api/backend/* on linear; Next.js proxies them internally to http://backend:8080/api.
```

`cloudflared` must be connected to Docker network `skomda-demo_app`, where the `frontend` and `backend` service names resolve. Traffic from the tunnel to these services uses HTTP inside this Docker network; use `http://`, not `https://`, in both published application routes. The browser-facing hostname still uses HTTPS at Cloudflare.

Admin login and protected admin requests use the same-origin Next.js proxy at `/api/backend/*`. The proxy sets the host-only `HttpOnly` admin cookie on `linear` and forwards it to Go over the private Docker network. It checks the `Origin` of mutating requests. Public API requests may continue using `api-linear`.

Repo Next.js juga memiliki route aplikasi lain di bawah `/api`. Karena itu backend Go jangan dipasang sebagai catch-all proxy untuk semua path `/api/*` pada host `linear`; path proxy backend dibatasi ke `/api/backend/*`.

## Yang perlu disiapkan pemilik pada VPS

1. Pastikan Ubuntu 24.04 mendapat update keamanan, lalu pasang Docker Engine dan Docker Compose plugin dari panduan resmi Docker. Jangan memasang Docker lewat skrip acak.
2. Buat user deployment non-root khusus. Gunakan SSH key saja dan batasi akses SSH. Akses ke Docker setara akses root, jadi jangan gunakan akun admin pribadi untuk pipeline.
3. Buat folder deployment, misalnya `/opt/skomda-demo`, dan letakkan `compose.yaml`, `deploy.env.example` yang disalin sebagai `deploy.env`, serta `scripts/deploy-demo.sh` di checkout `deploy` yang dipercaya.
4. Isi `deploy.env` dengan owner/repository GitHub yang huruf kecil, URL frontend/API demo, dan batas resource yang sesuai. Jangan menaruh secret di file ini.
5. Buat `/opt/skomda-demo/backend/.env` dengan permission `600`, milik user deploy. Isi sekurangnya `ENV=production`, `DATABASE_DRIVER=postgres`, `DATABASE_URL`, `JWT_SECRET` acak kuat, dan `ALLOWED_ORIGIN=https://linear.smktelkom-sidoarjo.my.id`; tambahkan secret layanan lain yang memang digunakan aplikasi. `ADMIN_DEFAULT_PASSWORD` tidak dibutuhkan oleh backend runtime; hanya diperlukan pada `migrate.env` jika seed awal sengaja dijalankan. Jangan salin nilai `.env` ke chat atau repo.
6. Buat `/opt/skomda-demo/backend/migrate.env` dengan permission `600`, milik user deploy. Mulai dari `backend/.env.migrate.example` dan isi `ENV=production`, `DATABASE_DRIVER=postgres`, serta `DATABASE_URL`. File ini hanya dipasang ke migrator; gunakan role migrasi khusus bila tersedia. Saat ini bisa memakai koneksi database yang sama dengan aplikasi sampai role runtime terpisah disiapkan. Pastikan URL mengarah ke project Supabase yang benar dan backup tersedia sebelum migrasi pertama.
7. Migrasi dijalankan sebagai service satu kali sebelum aplikasi diganti; backend production sendiri tidak menjalankan migrasi atau seeder saat start. Untuk database production yang benar-benar baru dan kosong, seed awal hanya boleh dijalankan manual setelah target dan backup diperiksa. Isi `ADMIN_DEFAULT_PASSWORD` di `migrate.env`, lalu dari folder deployment jalankan `docker compose --profile operations --env-file deploy.env run --rm --no-deps migrate --seed-initial`. Perintah ini membuat akun Super Admin awal serta data awal terbatas; jangan jalankan pada database yang sudah berisi data.
8. Jika GHCR package private, lakukan `docker login ghcr.io` sebagai user deploy memakai token GitHub dengan scope minimum `read:packages`. Jika package public, login tidak diperlukan. Simpan Docker credential dengan permission terbatas.
9. Pastikan host port `3000` dan `8080` hanya bind ke loopback seperti Compose. Tunnel membuat koneksi keluar dari VPS, jadi port aplikasi tidak perlu dibuka ke internet; pertahankan aturan SSH dan panel Webuzo sesuai kebutuhan.

## Cloudflare Tunnel, DNS, dan Webuzo

1. Buat atau gunakan tunnel bernama `skomda-demo-vps` pada Cloudflare Zero Trust. Jalankan connector `cloudflared` di Docker network `skomda-demo_app`.
2. Tambahkan Published Application route untuk `linear.smktelkom-sidoarjo.my.id` ke `http://frontend:3000`.
3. Tambahkan Published Application route untuk `api-linear.smktelkom-sidoarjo.my.id` ke `http://backend:8080`.
4. Pastikan Cloudflare DNS menampilkan hostname sebagai record Tunnel yang terhubung ke `skomda-demo-vps`. Pastikan kedua hostname ada; `api-linear` perlu diverifikasi secara terpisah.
5. Simpan tunnel token hanya di VPS, misalnya di `/opt/skomda-demo/cloudflared.env` dengan permission `600`. Jangan masukkan token ke Git, GitHub Actions log, atau chat.
6. Uji homepage dan `https://api-linear.smktelkom-sidoarjo.my.id/api/health`. Bila mendapat Cloudflare 502, periksa status/log `cloudflared`, keanggotaannya di network Docker, dan kecocokan protokol serta nama service. Pesan `tls: first record does not look like a TLS handshake` biasanya berarti origin memakai HTTPS padahal container melayani HTTP.

Webuzo tetap digunakan untuk panel pada hostname `server.smktelkom-sidoarjo.my.id`; Git Version Control atau document root Webuzo tidak menyajikan hostname demo ketika DNS hostname itu mengarah ke Tunnel. Jangan mengubah DNS apex/domain utama. Setelah kedua subdomain terbukti lewat Tunnel, aturan port-forward publik 80/443 untuk hostname demo tidak diperlukan lagi; aturan SSH port 58300 dan port/hostname panel Webuzo tetap dipertahankan sesuai kebutuhan VPS.

Jika `Resolve-DnsName <hostname> -Server 1.1.1.1` berhasil tetapi query tanpa opsi `-Server` menghasilkan `NXDOMAIN`, record publik sudah terlihat oleh resolver Cloudflare sementara resolver lokal/jaringan masih memberi jawaban lama. Jalankan `ipconfig /flushdns`, coba resolver jaringan lain, atau atur DNS adapter ke resolver publik. `curl --resolve` boleh dipakai untuk diagnosis sementara, tetapi jangan menyimpan IP anycast Cloudflare sebagai alamat origin atau memasangnya permanen di file `hosts`.

## GitHub Actions

1. Pastikan workflow `CI and demo deployment` hijau untuk push ke branch `deploy`. Job deploy tetap nonaktif sampai repository Actions variable `DEMO_DEPLOY_ENABLED=true`.
2. Pada Settings → Environments, buat environment `demo`; batasi deployment branch ke `deploy`. Tambahkan secrets berikut pada environment:
   - `VPS_HOST`: alamat IP publik atau hostname SSH VPS.
   - `VPS_USER`: user deployment non-root.
   - `VPS_SSH_PRIVATE_KEY`: private key khusus pipeline.
   - `VPS_KNOWN_HOSTS`: host key SSH yang fingerprint-nya sudah diverifikasi secara terpisah. Untuk port nonstandar, entri known_hosts biasanya berbentuk `[HOST]:PORT`.
3. Tambahkan environment variables `VPS_DEPLOY_PATH=/opt/skomda-demo` dan `VPS_SSH_PORT=58300`. Port `22` digunakan bila `VPS_SSH_PORT` tidak diatur.
4. Tambahkan **repository Actions variable** `DEMO_DEPLOY_ENABLED=true` hanya setelah seluruh preflight server selesai. Variable ini harus berada di level repository karena kondisi `if` job deploy dievaluasi sebelum job memasuki environment `demo`; variable level environment belum tersedia untuk kondisi tersebut.
5. Opsional: set repository variable `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`. `NEXT_PUBLIC_API_URL` tetap dipakai untuk request API publik yang browser kirim ke `api-linear`; request admin menggunakan same-origin `/api/backend/*`, yang diteruskan Next.js lewat `BACKEND_API_URL=http://backend:8080/api` dari Compose. CI memindai image GHCR dengan Trivy dan menghentikan alur sebelum deploy bila ada CVE High/Critical yang sudah memiliki perbaikan. Docker Scout dapat ditambahkan sebagai scan opsional dengan `DOCKER_SCOUT_ENABLED=true`; siapkan `DOCKER_SCOUT_HUB_USER` sebagai variable dan `DOCKER_SCOUT_HUB_PASSWORD` sebagai secret bila ingin menggunakannya.

GitHub Actions membangun dan mem-push image dengan tag SHA commit. VPS menarik tag immutable itu. `demo-latest` hanya tag kenyamanan untuk inspeksi dan bukan identitas deployment yang dipakai rollback.

### Troubleshooting SSH deploy

- Secret `VPS_SSH_PRIVATE_KEY` harus berisi private key OpenSSH lengkap dan bisa dibaca tanpa prompt interaktif. Jangan gunakan file `.pub`, `/home/deploy/.ssh/authorized_keys`, atau format PuTTY `.ppk`.
- Workflow menormalkan CRLF dan escape `\n`, lalu memvalidasi key secara lokal di runner sebelum mencoba SSH. `Load key ... error in libcrypto` berarti validasi/parsing key gagal sebelum autentikasi ke VPS.
- Jika key berhasil diparse tetapi SSH menghasilkan `Permission denied (publickey)`, pastikan public key pasangannya ada pada `/home/deploy/.ssh/authorized_keys`, username adalah `deploy`, dan port SSH sesuai. Bandingkan fingerprint saja; jangan tampilkan isi private key.

#### Mengganti key GitHub Actions dari Windows

Buat key ED25519 dari PowerShell Windows yang akan menyimpan dan menggunakan private key. Jangan membuatnya pada folder sementara yang tidak dapat dibaca oleh akun Windows tersebut.

```powershell
$key = "$env:USERPROFILE\.ssh\skomda-github-actions-demo"
New-Item -ItemType Directory -Force (Split-Path $key) | Out-Null
ssh-keygen -t ed25519 -C "github-actions-skomda-demo" -f $key
```

Tekan Enter dua kali ketika diminta passphrase agar runner GitHub Actions dapat menggunakan key tanpa prompt. Tampilkan public key dengan `Get-Content "$key.pub"`, lalu tambahkan satu baris itu ke `/home/deploy/.ssh/authorized_keys` tanpa menghapus key lain yang masih dipakai. Di VPS, pastikan direktori dimiliki `deploy` dengan mode `700`, dan `authorized_keys` dimiliki `deploy` dengan mode `600`. Periksa fingerprint public key dengan `ssh-keygen -lf "$key.pub"` dan cocokkan dengan output `ssh-keygen -lf /home/deploy/.ssh/authorized_keys` di VPS. Fingerprint hanya untuk pencocokan; jangan masukkan ke secret.

Salin private key langsung dari PowerShell ke clipboard, tanpa menampilkannya di terminal:

```powershell
Get-Content $key -Raw | Set-Clipboard
```

Paste seluruh isi private key—termasuk baris `BEGIN OPENSSH PRIVATE KEY` dan `END OPENSSH PRIVATE KEY`—ke secret `VPS_SSH_PRIVATE_KEY` pada GitHub Environment `demo`. Jangan kirim private key ke chat, commit ke Git, atau memasukkannya ke `authorized_keys`; file `.pub` saja yang dipasang pada VPS.

## Preflight dan smoke check oleh pemilik

- Cek `docker compose --env-file deploy.env config` di folder deployment; jangan menampilkan hasil yang mengandung environment secrets.
- Pastikan file `backend/.env` ada, permission-nya `600`, dan `DATABASE_DRIVER=postgres`.
- Pastikan `backend/migrate.env` dibuat dari contoh, permission `600`, dan URL database migrasi mengarah ke project yang sudah dicadangkan. Workflow deployment sekarang membutuhkan file ini sebelum menjalankan backend baru.
- Backend membatasi SQL pool ke maksimum 25 koneksi terbuka dan 5 idle. Sebelum stress test, pemilik project Supabase perlu mencocokkan nilai ini dengan compute/connection limit dan konfigurasi pooler; jangan menaikkan maksimum hanya berdasarkan jumlah pengguna bersamaan.
- Pastikan kedua hostname memiliki route Tunnel yang tepat, connector aktif, dan container `cloudflared` tersambung ke network aplikasi.
- Jalankan workflow CI/build dahulu. Aktifkan deploy hanya setelah siap menerima deployment pertama.
- Setelah deploy, cek `docker compose --env-file deploy.env ps`, `docker compose --env-file deploy.env logs --tail=100 backend frontend`, lalu buka homepage demo dan endpoint health API `https://api-linear.smktelkom-sidoarjo.my.id/api/health`. Periksa log connector dengan `docker logs --tail=50 skomda-cloudflared` bila salah satu route gagal.
- Periksa flow baca data publik, login admin, satu operasi tulis yang aman, dan upload media sebelum mengundang pengguna demo.

## Rollback

Diagnosis operasional dan setup monitor eksternal tersedia di [`monitoring-and-incidents.md`](monitoring-and-incidents.md). Pipeline juga menyalin `vps-status.py` lewat SCP ke direktori deployment; user `deploy` dapat menjalankannya dengan `python3 ./vps-status.py --public` setelah rilis. Ini memerlukan Python 3 pada VPS dan akses SFTP pada SSH server.

Workflow deploy menyimpan tag image aktif di `.deployed-image-tag`. Jika update menjadi unhealthy, skrip mencoba menarik dan menjalankan tag sebelumnya. Untuk pemulihan manual, gunakan nilai tag sebelumnya yang diketahui baik:

```bash
IMAGE_TAG=<tag-sha-sebelumnya> docker compose --env-file deploy.env pull
IMAGE_TAG=<tag-sha-sebelumnya> docker compose --env-file deploy.env up -d --no-build --wait --remove-orphans
docker compose --env-file deploy.env ps
```

Deployment pertama belum memiliki tag sebelumnya untuk rollback otomatis. Skrip deployment menjalankan migrator satu kali sebelum mengganti aplikasi; jika migrasi gagal, aplikasi lama tetap berjalan. Perintah rollback image tidak membatalkan perubahan skema atau isi database. Pertahankan migrasi yang kompatibel dengan versi aplikasi sebelumnya dan siapkan backup sebelum perubahan skema berisiko.

## Batas tanggung jawab

- Repo menyiapkan Dockerfiles, Compose, workflow, dan skrip deploy/rollback.
- Pemilik menyiapkan VPS, user SSH, GHCR access bila package private, `.env`, Cloudflare Tunnel, dan published application routes. Webuzo tetap dipakai untuk panel VPS.
- Jangan aktifkan `DEMO_DEPLOY_ENABLED` atau arahkan domain utama sebelum pemilik menyelesaikan preflight dan menyetujui rilis demo.

Rujukan: [Docker Engine di Ubuntu](https://docs.docker.com/engine/install/ubuntu/), [Cloudflare Tunnel routing](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/), [GitHub Actions deployment environments](https://docs.github.com/en/actions/concepts/deployment-environments).
