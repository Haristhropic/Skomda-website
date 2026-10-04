# Pemantauan dan penanganan insiden SKOMDA

Status: skrip diagnosis dan runbook tersedia di repo. Monitor eksternal, penerima alert, agregasi log, dan error tracker belum dikonfigurasi. Belum ada hasil pemeriksaan live dari perubahan ini.

## Lapisan pemantauan

1. Docker memeriksa health aplikasi dan membatasi ukuran log.
2. `scripts/vps-status.py` mengambil snapshot kondisi VPS tanpa mengubah container atau database.
3. Monitor eksternal memeriksa website, API, dan proxy dari luar VPS, sehingga kehilangan koneksi VPS tetap terdeteksi.
4. Agregasi log/error tracker akan memantau error endpoint dan menghubungkan kejadian lewat `X-Request-ID`. Bagian ini masih perlu akun/konfigurasi dan peninjauan redaksi data.

Health Docker bukan alert. `restart: unless-stopped` membantu saat proses container berhenti; status `unhealthy` saja tidak membuat Compose otomatis memperbaiki koneksi database atau me-restart proses. Container aplikasi dan migrator berjalan non-root, membuang Linux capabilities, dan memakai `no-new-privileges`. Lihat [kebijakan restart Docker](https://docs.docker.com/engine/containers/start-containers-automatically/) dan [opsi security Compose](https://docs.docker.com/reference/compose-file/services/).

## Monitor HTTP dari luar VPS

Buat tiga monitor GET tanpa kredensial menggunakan layanan uptime di luar VPS yang dipilih pemilik:

| Nama | URL | Kondisi sehat |
|---|---|---|
| Website demo | `https://linear.smktelkom-sidoarjo.my.id/` | HTTP 200 tanpa redirect ke halaman error/login. |
| Proxy frontend ke API | `https://linear.smktelkom-sidoarjo.my.id/api/backend/health` | HTTP 200; JSON `status=ok` dan `database=ok`. |
| API dan PostgreSQL | `https://api-linear.smktelkom-sidoarjo.my.id/api/health` | HTTP 200; JSON `status=ok` dan `database=ok`. |

Usulan konfigurasi awal: interval 60 detik, timeout 5 detik, alert setelah tiga kegagalan berurutan, notifikasi pulih setelah dua keberhasilan berurutan. Gunakan notifikasi perubahan status dan gabungkan kegagalan terkait dalam satu insiden agar tidak membanjiri penerima. Ini target operasional awal, bukan SLO yang sudah terukur.

- Pilih penerima email operasional yang akan ditentukan pemilik; integrasi kanal lain dapat ditambahkan kemudian.
- Jika layanan monitor mendukungnya, gunakan pemeriksaan JSON pada kedua endpoint health. HTTP 200 saja tidak membuktikan database sehat atau homepage memuat aplikasi yang benar.
- Pastikan aturan cache Cloudflare melewati kedua path health di hostname terkait. Respons health harus berasal dari aplikasi aktif, bukan salinan CDN.
- Periksa monitor tidak dihentikan oleh challenge/WAF/Cloudflare Access. Jangan membuat pengecualian keamanan seluruh domain; atur kebutuhan probe secara terbatas.
- Aktifkan monitor setelah deployment dikonfirmasi. Uji penerimaan notifikasi melalui fasilitas pengujian monitor; jangan mematikan layanan aktif untuk latihan pertama.
- Monitor di VPS yang sama tidak dapat memberi alert ketika VPS itu kehilangan jaringan atau mati. Pemeriksaan `--public` dari VPS membantu diagnosis, tetapi tetap memerlukan monitor eksternal.

## Snapshot oleh user deploy

Prasyarat: Ubuntu/Linux dengan `python3`, Docker Compose, akses Docker user `deploy`, dan file deployment di `/opt/skomda-demo`. Skrip memakai standard library Python; tidak perlu paket pip. Pipeline CI menyalin skrip ke direktori deployment melalui SCP sebelum deploy aplikasi, tetapi tidak menjalankannya. SFTP harus tersedia pada SSH server. Jika copy gagal, pipeline berhenti sebelum menjalankan migrator/deployment.

Setelah commit berisi perubahan ini disetujui dan dideploy, jalankan di SSH user `deploy`:

```bash
cd /opt/skomda-demo || exit
python3 ./vps-status.py --deploy-dir /opt/skomda-demo
```

Untuk menambahkan tiga URL HTTPS publik:

```bash
python3 ./vps-status.py --deploy-dir /opt/skomda-demo --public
```

Skrip mengambil status frontend/backend/Tunnel, health aplikasi, jumlah restart, indikasi OOM, kapasitas disk, RAM tersedia, load average, serta hasil probe HTTP. Jumlah restart adalah nilai kumulatif; bandingkan snapshot sebelum/sesudah insiden, jangan menganggap nilai tinggi sendirian sebagai outage. `cloudflared` yang running belum membuktikan Tunnel tersambung; lihat probe publik dan dashboard Tunnel.

Satu snapshot mengirim satu GET per target, tanpa login, pendaftaran, upload, chatbot, atau penulisan database. Ini diagnosis operasional, bukan stress test. Pengujian kapasitas tetap mengikuti rencana VPS pada tahap akhir.

Skrip tidak mencetak `.Config.Env`, argumen startup cloudflared, isi respons HTML/JSON, stderr Docker, atau isi log aplikasi. Outputnya tetap berisi metadata operasional seperti nama image; tinjau sebelum membagikannya di ruang publik.

| Exit code | Arti |
|---|---|
| `0` | Semua pemeriksaan yang diminta sehat; tidak ada ambang resource yang terlampaui. |
| `1` | Perlu perhatian: probe/container gagal atau ambang disk/RAM terlampaui. Lihat `findings`. |
| `2` | Snapshot tidak lengkap karena direktori, platform, Docker/Compose, izin atau metrik tidak tersedia. Ini kegagalan pemeriksaan, jangan dianggap layanan sehat. |

Jika port host berbeda, tambahkan `--frontend-port` dan `--backend-port` sesuai deployment. Default adalah 3000 dan 8080. Parameter `--tunnel-container` dapat menyesuaikan nama connector bila berubah.

## Ambang resource awal

| Metrik | Peringatan | Kritis | Tindakan |
|---|---|---|---|
| Disk terpakai | >=80% | >=90% | Periksa pertumbuhan file/log dan image yang diperlukan rollback. Tentukan penghapusan secara spesifik. |
| RAM tersedia | <=15% | <=5% | Lihat penggunaan setiap container, swap, restart dan indikasi OOM. |
| Health aplikasi | Gagal satu snapshot | Tiga probe eksternal berturut-turut gagal | Periksa penyebab sebelum restart. |
| Latensi endpoint health | Pantau tren | Timeout probe 5 detik | Periksa SQL pool, jaringan Supabase dan CPU; timeout bukan bukti perlu lebih banyak replica. |

Skrip menandai ambang dalam satu snapshot. Untuk alert resource terjadwal, collector eksternal perlu memastikan kondisi bertahan sekitar lima menit sebelum mengirim notifikasi. Tidak ada scheduler/alert resource yang dipasang oleh skrip ini. Metrik RAM berasal dari `/proc/meminfo` yang terlihat di VPS; bandingkan dengan limit platform dan container jika virtualisasi melaporkan nilai berbeda.

## Diagnosis tanpa menampilkan secret

```bash
cd /opt/skomda-demo || exit
python3 ./vps-status.py --public
docker stats --no-stream skomda-demo-backend-1 skomda-demo-frontend-1 skomda-cloudflared
df -h /
free -h
```

Untuk menemukan metadata request atau kegagalan proxy:

```bash
docker compose --env-file deploy.env logs --since=10m backend frontend \
  | grep -E 'request_id=|backend_proxy_error'
```

Request melalui proxy memiliki UUID yang bisa ditelusuri pada `X-Request-ID` di Network browser dan log backend. Cari ID dari request yang gagal; jangan menyalin Authorization, cookie, JWT, payload formulir, connection string, atau keseluruhan `docker inspect`/`docker compose config` ke chat.

Log lengkap dan audit log database perlu penanganan tersendiri: log startup SQL lama bisa memuat identitas koneksi, dan audit log historis bisa memuat data pribadi. Lihat [`security-authorization-audit.md`](security-authorization-audit.md).

## Urutan penanganan

| Gejala | Pemeriksaan pertama | Tindakan berikutnya |
|---|---|---|
| Browser gagal resolve DNS | Resolve kedua hostname melalui resolver lokal dan `1.1.1.1`. | Periksa record Cloudflare serta nameserver. Jika resolver publik benar, periksa cache/resolver lokal. |
| Lokal sehat, publik gagal | Status Tunnel, published application routes dan network connector. | Pastikan frontend `http://frontend:3000` dan backend `http://backend:8080`; keduanya HTTP internal. |
| Cloudflare 502 dan pesan TLS handshake | Protokol origin route Tunnel. | HTTP container tidak menerima HTTPS langsung. Koreksi protokol origin, pertahankan HTTPS untuk URL publik. |
| API health 503 | Status backend, koneksi PostgreSQL, batas pool/compute. | Cek status layanan Supabase serta konektivitas. Jangan menjalankan seed/migrasi atau fallback SQLite untuk memperbaiki koneksi. |
| API langsung sehat, proxy gagal | Status frontend dan `BACKEND_API_URL`. | Pastikan frontend dan backend satu network; gunakan `http://backend:8080/api` di frontend. |
| Container berhenti/OOM | Status, penggunaan RAM, restart dan batas container. | Identifikasi penyebab; evaluasi limit terhadap kapasitas VPS dan proses lain sebelum memperbesar. |
| Error muncul sesudah deploy | Tag aktif, hasil deploy dan kompatibilitas skema. | Gunakan rollback image yang diketahui sehat sesuai [`demo-vps-runbook.md`](demo-vps-runbook.md). Rollback image tidak memulihkan database. |

Untuk 502, [panduan Cloudflare](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/troubleshoot-tunnels/common-errors/) menjelaskan pemeriksaan origin/protokol saat Tunnel tidak dapat menjangkau layanan. Jika lokal maupun publik gagal, selesaikan masalah aplikasi/resource dahulu.

Simpan waktu insiden dalam UTC, hasil snapshot, tag image, request ID terkait, tindakan, dan waktu pulih. Jika masalah menyangkut data, ikuti [`backup-and-recovery-runbook.md`](backup-and-recovery-runbook.md) bersama pemilik database. Status pulih memerlukan pemeriksaan URL publik dan alur yang terdampak, bukan hanya container kembali running.

## Pekerjaan yang masih diperlukan

- Konfigurasi tiga monitor dari luar VPS serta penerima notifikasi dan verifikasi penerimaan alert.
- Pilih agregasi log/error tracker, batasi akses dan retensinya, lalu verifikasi redaksi data sebelum integrasi aktif.
- Pasang collector resource dan alert berkelanjutan; snapshot manual belum menyimpan histori.
- Verifikasi monitor, kapasitas, rollback dan recovery pada tahap pemeriksaan VPS yang disetujui pemilik.
