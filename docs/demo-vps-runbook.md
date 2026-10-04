# Operasi deployment demo SKOMDA

Panduan operator untuk konfigurasi deployment 4 Oktober 2026. Demo berada di `https://linear.smktelkom-sidoarjo.my.id`; API health berada di `https://api-linear.smktelkom-sidoarjo.my.id/api/health`. Domain utama belum dipromosikan. Status release aktif harus diperiksa di VPS.

## SSH dari PowerShell

Jalankan di PowerShell pada komputer kamu. Gunakan private key pribadi untuk user `deploy` yang public key-nya sudah dipasang di VPS:

```powershell
ssh -i "$env:USERPROFILE\.ssh\skomda-deploy-vps" -o IdentitiesOnly=yes -p 58300 deploy@101.50.1.15
```

Private key tidak disalin ke VPS, chat, atau Git. `/home/deploy/.ssh/authorized_keys` berisi public key; file itu bukan private key atau fingerprint.

## File dan jaringan

| File | Fungsi |
|---|---|
| `/opt/skomda-demo/compose.yaml` | Infrastruktur stabil: edge/Redis/Prometheus/Loki/Grafana/exporter. |
| `compose.release.yaml` | Slot blue/green, dua frontend dan dua backend per slot, migrator pada profile `operations`. |
| `deploy.env` | Namespace image dan origin frontend; mode `600`. |
| `backend/.env` | Role runtime DB, JWT, Redis, Cloudinary, dan AI; mode `600`. |
| `backend/migrate.env` | Koneksi admin DB untuk migrator; mode `600`, tidak diberikan ke HTTP server. |
| `.active-slot`, `.deployed-image-tag` | Slot/tag aktif. |
| `.previous-slot`, `.previous-image-tag` | Target rollback. |
| `deploy/nginx/releases/active.conf` | Pointer upstream Nginx; jangan edit IP manual saat deployment berjalan. |
| `secrets/` | Direktori privat dengan mode `700` untuk secret Redis, Grafana, dan backup. |

Semua container menggunakan jaringan `skomda-runtime`. Route Cloudflare Tunnel tetap memakai HTTP internal `frontend:3000` dan `backend:8080`; alias ini milik Nginx. Port container tidak dipublikasikan ke internet. Grafana dan Redis tidak dibuka dengan port forwarding.

## Release normal

Commit/push ke branch `deploy` memicu test/vet backend, lint/typecheck/build frontend, scan Trivy, publish image GHCR dengan SHA immutable, lalu deployment SSH otomatis. Required reviewers environment `demo` sudah dihapus sesuai permintaan; kebijakan branch tetap `deploy`. `DEMO_DEPLOY_ENABLED=true` adalah repository variable. Secrets VPS tetap berada di environment `demo`.

CD memakai `flock` untuk mencegah dua deployment berjalan bersamaan. Slot aktif tetap berjalan; migrasi yang kompatibel diterapkan; kandidat ditunggu sampai sehat; lalu Nginx di-reload secara bertahap. Slot lama dihentikan setelah drain 35 detik; container/image dipertahankan untuk warm rollback dan static chunk diarsipkan terpisah. Target rollback dihidupkan dan ditunggu sehat sebelum traffic berpindah. Jangan menjalankan `docker compose down` sebagai bagian release rutin.

## Periksa setelah release

Setelah SSH tersambung, jalankan sebagai user `deploy` di VPS:

```bash
cd /opt/skomda-demo || exit
python3 ./vps-status.py --public
cat .active-slot .deployed-image-tag
export RELEASE_SLOT="$(cat .active-slot)"
export IMAGE_TAG="$(cat .deployed-image-tag)"
docker compose -f compose.release.yaml --env-file deploy.env ps
docker compose --env-file deploy.env ps
docker stats --no-stream
```

Periksa hasil snapshot, slot/tag aktif, health container, dan penggunaan resource. Snapshot memeriksa health, OOM, resource, dan HTTP publik. Status container saja tidak membuktikan alur CRUD, Grafana, atau AI sehat.

Lihat log dengan perintah berikut. Jangan membagikan kredensial, cookie, isi formulir, atau data pribadi:

```bash
docker compose -f compose.release.yaml --env-file deploy.env logs --since=10m backend-a backend-b frontend-a frontend-b
docker logs --tail=50 skomda-cloudflared
```

## Rollback aplikasi

```bash
cd /opt/skomda-demo || exit
bash ./rollback-demo.sh
python3 ./vps-status.py --public
```

Rollback memakai slot/tag sebelumnya dan pointer Nginx. Hasil snapshot setelahnya harus sehat. Rollback tidak membatalkan migrasi atau memulihkan data. Migrasi destruktif memerlukan rencana expand/contract dan backup; rollback image tidak memulihkan DB.

## Migrasi database

Baseline database existing versi 1 sudah dicocokkan dengan dump lengkap dan dicatat. Migrasi 2 untuk role, grants, dan RLS sudah diterapkan; jangan menjalankan seed atau baseline ulang untuk release rutin. Migrasi berikutnya dijalankan oleh CD dengan image kandidat dan `backend/migrate.env` sebelum traffic dialihkan. User runtime `skomda_runtime` tidak boleh menjalankan DDL. PostgreSQL adalah satu-satunya DB production.

## Infrastructure update dan kapasitas

Upgrade proxy, Tunnel, dan infrastruktur harus diperiksa tersendiri karena dapat me-restart proses yang melayani traffic. Perubahan image aplikasi biasa tidak mengubah komponen itu. Batas provider sebesar 500 PID/thread perlu dipantau: lihat dashboard host dan jangan menambah container tanpa kapasitas. Apache/containerd sudah dituning untuk mengurangi thread idle. User `deploy` dalam group Docker memiliki kemampuan setara administrator host; lindungi SSH key-nya.

## Pemulihan dan audit

Lihat [backup/recovery](backup-and-recovery-runbook.md), [monitoring/insiden](monitoring-and-incidents.md), [arsitektur](production-architecture-design.md), dan [rencana audit/load test](final-audit-plan.md). Target beban harus dinilai dari workload, latency, dan error yang terukur; satu VPS tidak memberikan HA host.
