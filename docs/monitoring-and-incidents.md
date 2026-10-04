# Monitoring dan penanganan insiden

Panduan operator, 4 Oktober 2026. Grafana, Prometheus, Loki, Nginx exporter, dan host exporter sudah dipasang. Notifikasi eksternal dan pengiriman backup offsite otomatis masih memerlukan tujuan dari pemilik.

## Membuka panel monitoring

1. Login sebagai Super Admin di `/gate-internal-skomda`.
2. Buka `/admin/monitoring` untuk melihat metrik aplikasi dan host.
3. Buka Grafana di panel yang sama. Akses menggunakan proxy `/api/observability/grafana/`.

Proxy Grafana memverifikasi JWT dan role melalui backend pada setiap permintaan. Identitas dan cookie dari pemanggil dibuang sebelum permintaan diteruskan; identitas yang dipercaya disisipkan oleh server. Editor tidak memiliki akses ke monitoring teknis atau Grafana. Grafana tidak membuka port publik, login anonim, atau pendaftaran akun. Akun yang disediakan melalui provisioning memiliki hak Viewer.

Dashboard menampilkan trafik, status dan latensi permintaan, pool koneksi database, Redis, permintaan AI yang sedang berjalan, koneksi Nginx, serta CPU, RAM, disk, dan PID host. Loki menampilkan log operasional yang telah disaring.

Metrik backend hanya tersedia pada port privat `9091`. Host exporter hanya mendengarkan `172.29.0.1:9100` dan dijalankan oleh layanan systemd milik user `deploy`. Log hanya memuat metadata operasional, tanpa body, query, alamat IP pengguna, cookie, atau secret. Log forwarder menggunakan daftar field Nginx yang diizinkan. Grafana dan Loki tidak diberi akses ke Docker socket.

## Memeriksa status berkala

Cron milik user `deploy` membuat snapshot status setiap 2 menit, meneruskan log yang sudah disaring setiap menit, dan menjalankan backup harian. JSON status privat disimpan di `/opt/skomda-demo/operations/` dan dapat dibaca melalui SSH. Snapshot lokal tidak dapat mengirim notifikasi ketika seluruh VPS atau jaringannya mati.

Jalankan melalui SSH sebagai user `deploy`:

```bash
cd /opt/skomda-demo || exit
python3 ./vps-status.py --public
cat .active-slot .deployed-image-tag
docker stats --no-stream
cat /sys/fs/cgroup/pids/pids.current /sys/fs/cgroup/pids/pids.max
df -h /
free -h
```

Arti exit code pemeriksaan status: `0` berarti sehat, `1` berarti perlu perhatian, dan `2` berarti pemeriksaan tidak lengkap. Kegagalan melakukan pemeriksaan bukan hasil sehat. Kebijakan restart membantu ketika proses berhenti; status container `unhealthy` sendiri tidak otomatis memperbaiki masalah database.

## Ambang dan tindakan

| Kondisi | Tindakan |
|---|---|
| PID atau thread melebihi 90% dari batas 500 | Kurangi proses atau concurrency yang tidak diperlukan. Evaluasi batas provider sebelum menambah replica. |
| RAM tersedia kurang dari 15%, OOM, atau restart berulang | Periksa konsumsi memori container, batas memori, beban, dan latensi database. |
| Ruang disk tersedia kurang dari 15% | Periksa log, cache, image, dan backup. Hapus target spesifik setelah memastikan kebutuhan rollback dan backup aman. |
| Respons publik 5xx meningkat atau health database gagal | Korelasikan request ID, latensi, pool koneksi database, Redis, dan Tunnel. Hindari restart massal tanpa diagnosis. |
| Slot permintaan AI penuh atau Redis error | Permintaan akan ditolak atau dibatasi. Periksa dependency, CPU, dan memori. |

Ambang disk di atas digunakan oleh alert Prometheus. Snapshot `vps-status.py` memberi peringatan pada pemakaian disk 80% dan menandai kritis pada 90%; kedua pemeriksaan memiliki ambang yang berbeda.

Aturan alert Prometheus tersedia dan kondisinya dapat ditampilkan di Grafana. Channel notifikasi seperti email atau webhook belum dikonfigurasi karena tujuan belum tersedia. Tampilan alert di dashboard belum membuktikan pengiriman notifikasi eksternal bekerja.

## Mendiagnosis gejala

| Gejala | Pemeriksaan |
|---|---|
| NXDOMAIN di komputer lokal, tetapi resolver publik berhasil | Periksa cache dan resolver Windows atau ISP, lalu record A dan AAAA untuk kedua hostname. |
| Cloudflare 502 dengan `tls: first record does not look like a TLS handshake` | Origin Tunnel harus menggunakan HTTP ketika port container melayani HTTP. |
| Publik 502, tetapi layanan lokal sehat | Periksa koneksi Tunnel, jaringan `skomda-runtime`, serta alias `frontend` dan `backend` yang mengarah ke Nginx. |
| Health mengembalikan 503 | Periksa Supabase session pooler yang mendukung IPv4, hak akses role runtime, pool koneksi, dan jaringan. Jangan memakai fallback SQLite atau menjalankan seed sebagai perbaikan. |
| Login 403 karena origin | Origin frontend harus `https://linear.smktelkom-sidoarjo.my.id` tanpa path. Periksa konfigurasi proxy, validasi origin permintaan mutasi, dan allowlist backend. |
| Editor mendapat 403 pada monitoring | Ini merupakan perilaku otorisasi yang diharapkan. Super Admin dan Editor memiliki lingkup akses berbeda. |
| Error setelah CD | Periksa SHA image aktif, slot, dan health. Gunakan rollback aplikasi jika schema database masih kompatibel. |
| Docker gagal membuat thread, `newosproc`, atau `resource unavailable` | Periksa batas PID 500 dari provider, thread Apache yang menganggur, containerd, dan `GOMAXPROCS`. Diagnosis batas resource sebelum menyimpulkan Docker rusak. |

## Monitoring dari luar VPS

Monitor GET dari layanan di luar VPS perlu dikonfigurasi bersama tujuan notifikasi pemilik:

- `https://linear.smktelkom-sidoarjo.my.id/`: harus mengembalikan HTTP 200.
- `https://linear.smktelkom-sidoarjo.my.id/api/backend/health`: HTTP 200 dengan JSON `status` dan `database` bernilai `ok`.
- `https://api-linear.smktelkom-sidoarjo.my.id/api/health`: kondisi yang sama.

Konfigurasi awal yang disarankan adalah interval 60 detik, timeout 5 detik, alert setelah 3 kegagalan berurutan, dan pemulihan setelah 2 keberhasilan berurutan. Jangan cache endpoint health atau menonaktifkan WAF untuk seluruh domain. Monitor eksternal diperlukan untuk mendeteksi kegagalan host; monitoring di host yang sama tidak menggantikannya.

Catat waktu UTC, SHA, slot, request ID, gejala, tindakan, dan waktu pemulihan tanpa data pribadi atau secret. Pemulihan data mengikuti [runbook backup](backup-and-recovery-runbook.md); rollback aplikasi mengikuti [runbook deployment](demo-vps-runbook.md).
