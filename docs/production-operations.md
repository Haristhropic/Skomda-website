# Operasi deployment terbaru

Gunakan user SSH `deploy`, port publik `58300`, direktori `/opt/skomda-demo`. Root dipakai hanya untuk pengaturan host. Database tetap satu proyek Supabase.

## Memeriksa layanan

```bash
cd /opt/skomda-demo
docker compose --env-file deploy.env ps
RELEASE_SLOT=$(cat .active-slot) IMAGE_TAG=$(cat .deployed-image-tag) \
  docker compose -f compose.release.yaml --env-file deploy.env ps
docker compose --env-file deploy.env exec -T edge wget -qO- http://127.0.0.1:8080/api/health
python3 vps-status.py --public
cat /sys/fs/cgroup/pids/pids.current
```

Port 127.0.0.1 Windows mengarah ke komputer sendiri. Arsitektur baru tidak menerbitkan port aplikasi ke host: pemeriksaan internal memakai `docker compose exec` atau checker operasional.

## CD tanpa jeda penggantian container aktif

Push ke branch `deploy` menjalankan pemeriksaan dan scan sebelum publish image. GitHub environment `demo` tidak memerlukan required reviewer, tetapi dibatasi ke branch `deploy`. CI mengirim konfigurasi serta script ke VPS dan memakai tag SHA.

Candidate mulai di slot yang tidak aktif. Versi lama melayani saat image ditarik, migrasi berjalan, dan candidate menunggu sehat. Nginx `nginx -t` lalu reload graceful mengganti upstream. Lock mencegah deployment bertabrakan. Pipeline baru tidak membatalkan deployment lama di tengah pergantian.

Satu VPS tidak menjamin availability saat host/kernel/Cloudflare Tunnel/Supabase gagal. Migrasi harus kompatibel dengan release lama. Redis dan data tidak diduplikasi di slot release.

## Rollback aplikasi

Konfigurasi sebelumnya tersimpan `deploy/nginx/releases/rollback.conf`; container sebelumnya harus masih hidup.

```bash
cd /opt/skomda-demo
cp deploy/nginx/releases/rollback.conf deploy/nginx/releases/active.conf
docker compose --env-file deploy.env exec -T edge nginx -t
docker compose --env-file deploy.env exec -T edge nginx -s reload
```

Setelah rollback, set `.active-slot` serta `.deployed-image-tag` ke slot/tag sebelumnya yang dicatat pada laporan deployment. Jangan menjalankan CD berikutnya dengan pointer dan state berbeda. Jangan memulihkan database production otomatis untuk rollback kode.

## Super admin dan editor

Login tetap `/gate-internal-skomda`. Super admin masuk `/admin/monitoring`, melihat Grafana, metadata request, audit, dan membuat akun editor di `/admin/users`. Editor masuk `/admin` untuk CRUD serta data operasional. API menegakkan izin; menyembunyikan menu saja tidak memberi perlindungan.

Grafana menggunakan identity header yang hanya ditambahkan proxy setelah sesi/role backend terverifikasi. Akun Grafana otomatis berperan Viewer, tidak anonymous. Tidak ada password root/DB/JWT/token dalam panel atau log. Grafana Live WebSocket dimatikan; dashboard refresh HTTP setiap 15 detik.

## Backup

`python3 backup-encrypted.py` membuat dump schema public dan ledger, terenkripsi AES-256-CBC/PBKDF2 dan integrity HMAC. File plaintext sementara dihapus setelah proses. `secrets/backup.pass` mode600 dibutuhkan untuk pemulihan dan harus disimpan terpisah di lokasi aman. Retensi lokal tujuh hari tidak melindungi dari hilangnya VPS.

`python3 restore-backup-check.py /opt/skomda-demo/backups/NAMA.dump.enc` memeriksa HMAC sebelum dekripsi dan restore hanya ke PostgreSQL disposable `--network none`. Script tidak mengarah ke database production. Offsite otomatis dan pengiriman notifikasi membutuhkan storage/destination pemilik; hasil konfigurasi nyata dicatat pada audit akhir.

## Batas resource host

PID/thread VPS dibatasi provider500. Override Apache `/usr/local/apps/apache2/etc/conf.d/zz-skomda-resource.conf` menjaga situs lama tetap tersedia dengan32worker, bukan208thread idle. Sumber override disimpan `deploy/host/apache-resource.conf`. Untuk membatalkan override, hapus file override setelah memeriksa kapasitas dan jalankan `httpd -t`, lalu `httpd -k graceful`.

Containerd memakai drop-in `/etc/systemd/system/containerd.service.d/skomda-threads.conf` (`GOMAXPROCS=2`). Restart containerd dengan KillMode=process sudah diperiksa tidak menghentikan container berjalan. Jangan menghapus batas thread sebelum PID provider dinaikkan. Backlog host1024 tersimpan `/etc/sysctl.d/99-skomda-backlog.conf`.
