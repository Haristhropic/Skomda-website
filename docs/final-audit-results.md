# Hasil audit deployment dan kapasitas

Status 4 Oktober 2026: audit live revisi `86cc6ef` selesai sebagian. Smoke dan tahap sampai 500 virtual user lulus. **Tahap 1.000 virtual user gagal karena HTTP 502**; perbaikan dan pengujian ulang masih diperlukan. Dokumen ini tidak menyatakan seluruh arsitektur atau kapasitas akhir lulus.

## Target dan revisi

- Frontend: `https://linear.smktelkom-sidoarjo.my.id`.
- API: `https://api-linear.smktelkom-sidoarjo.my.id/api` dan proxy same-origin `/api/backend`.
- Baseline image: `sha-9dc26a9388863073bf01e40bd225610417b7afe8`.
- Release pertama: `sha-2ea21baf401d3cdf5d2e0e98a677423ae60f24e7`, slot `blue`, dikonfirmasi melalui file state VPS.
- Release yang diuji: `sha-86cc6efdac74320fb2e680e1e96f1b40ec4b422b`, slot `green`, dikonfirmasi aktif pada sekitar 11:21 UTC. CI run 26 attempt 2 selesai sukses dan memeriksa tag image aktif. Revisi berikutnya masih memerlukan audit ulang.

## Deployment pertama dan insiden host

Run Actions 25 (`37196189994`) sempat berstatus hijau walaupun script deployment berhenti setelah migrasi. Docker membaca sisa program dari stdin milik `ssh ... bash -s`. Perbaikan menjalankan file script yang sudah disalin dengan stdin tertutup, menjalankan migrator memakai `-T < /dev/null`, dan memeriksa bahwa `.deployed-image-tag` sesuai SHA yang diminta. Release pertama kemudian dipasang secara manual. Run hijau sebelum perbaikan bukan bukti deployment selesai.

Menurut log host yang diperiksa operator, dockerd mengalami kegagalan pembuatan thread dan SIGABRT pada 11:03:31 UTC, lalu restart pada 11:03:33 UTC. Batas provider adalah 500 PID/thread. Burst proses health check Node berkontribusi pada kehabisan kapasitas ini. Operator mengarsipkan dan menghentikan aplikasi lama, menghentikan proses Node manual lama, serta mengaktifkan Docker live restore dan membatasi `GOMAXPROCS` daemon. Health check berikutnya dirancang menggunakan `wget` agar tidak membuat proses Node berulang.

Docker live restore membantu mempertahankan container saat daemon restart; ini belum membuktikan layanan bertahan ketika seluruh VPS mati. Dua replica pada satu VPS juga berbagi kegagalan host yang sama.

## Bukti probe publik

Probe menjalankan maksimal satu GET per detik, bergantian HTML frontend, daftar API langsung, dan daftar API same-origin. Tidak melakukan login, operasi tulis, atau panggilan provider AI.

| Segmen | Hasil terukur | Batas bukti |
|---|---|---|
| `artifacts/deploy-availability-2ea21ba.json` | 540 sampel berhasil sampai 10:59:05 UTC | Proses terhenti akibat error penulisan JSON Windows; tidak mencakup insiden sesudahnya. |
| `artifacts/deploy-availability-followup.json` | 195 sampel; 87 gagal dengan HTTP 530, lalu kembali HTTP 200 | Kegagalan diamati mulai 11:06:22 UTC; pemulihan pertama pada 11:07:50 UTC. Karena ada gap pengukuran, waktu mulai outage tidak dapat ditentukan dari probe ini. |
| `artifacts/deploy-availability-final-cd.json` | 60 sampel berhasil setelah pemulihan | Baseline sehat sebelum CI release berikutnya; belum merupakan bukti cutover. |
| `artifacts/deploy-availability-86cc6ef.json` | 827/827 sampel HTTP 200, sekitar 11:10:43–11:25:22 UTC | Mencakup percobaan CD pertama, rerun, cutover, dan sesudah cutover. p95 frontend 260,53 ms, API langsung 319,73 ms, proxy 285,25 ms. |

Penulisan laporan probe diperbaiki dengan file sementara, penggantian atomik, dan retry. Error penulisan sementara tidak lagi menghentikan pengambilan sampel; kegagalan pelaporan dicatat terpisah. Bukti insiden disimpan sebagai segmen gagal dan tidak dihapus dari hasil akhir.

Tidak ada klaim zero downtime untuk deployment pertama. Pengukuran release berikutnya menggunakan segmen baru agar keberhasilan dan kegagalan masing-masing dapat ditinjau dengan jelas.

Percobaan pertama CD run 26 gagal membuat `frontend-a` kandidat ketika jumlah PID mendekati batas provider. Replika lama masih melayani traffic; operator menghentikan replika `b` lama untuk menyediakan kapasitas, lalu mengulang job. Sampel publik pada segmen ini tetap berhasil, tetapi keberhasilan tersebut belum membuktikan deployment otomatis berikutnya tidak memerlukan intervensi. Prosedur staging harus mengendalikan overlap dan menghentikan slot lama setelah drain.

## Audit HTTP, autentikasi, dan CRUD pada 86cc6ef

`artifacts/live-audit-86cc6ef-canonical.json` mencatat **47/47 pemeriksaan berhasil**: 22 halaman navigasi publik, endpoint privat tanpa sesi, JWT tidak valid, Origin asing/tidak ada, penolakan identitas Grafana palsu, JSON melebihi 1 MiB melalui proxy, dan guard AI deterministik sebelum provider. Header HSTS belum tersedia pada revisi ini; perbaikan berikutnya perlu diverifikasi. Kehadiran header bukan bukti keamanan lengkap.

Percobaan awal dua URL Grafana dengan trailing slash mendapat 308 dari normalisasi Next.js. Alat diperbaiki memakai URL kanonik dan pengujian ulang berhasil; redirect tersebut bukan bypass autentikasi. Guard tetap diuji melalui endpoint kanonik.

- `artifacts/auth-super-86cc6ef.json`: login, monitoring, identitas Grafana Viewer, pembatasan mutasi CRUD super admin, pengaturan admin Grafana, CSRF, dan logout berhasil sesuai kontrak.
- `artifacts/auth-editor-86cc6ef.json`: editor mendapat akses CRUD; monitoring, Grafana, dan pembuatan akun ditolak.
- `artifacts/editor-crud-86cc6ef.json`: satu draft audit unik dibuat 201, dibaca/diperbarui 200, tidak dapat dilihat anonim, dihapus 200, lalu dikonfirmasi tidak ada. Konten lama dan data siswa tidak diubah.
- Audit browser: editor yang membuka `/admin/monitoring` diarahkan kembali ke `/admin`; sidebar editor hanya menyediakan fungsi konten. Super admin yang login diarahkan ke `/admin/monitoring`, dengan menu monitoring, audit, dan akun editor.

Pemeriksaan ini tidak menguji exploit destruktif, menebak akun, maupun mengekspor data pribadi. Audit awal menemukan dua query sinkron belum memakai deadline request dan batas body langsung backend belum setara proxy. Agen backend menyiapkan perbaikan; hasil 86cc6ef tidak boleh dipakai sebagai bukti perbaikan tersebut sudah aktif.

## Browser, perangkat, gambar, dan Grafana

Audit menggunakan Edge desktop yang mengakses **VPS publik**, dengan override viewport. Lebar yang diminta 360, 390, 768, 1280, dan 1440 px menghasilkan area CSS 345, 375, 753, 1265, dan 1425 px karena scrollbar. Pada kelima ukuran homepage, `scrollWidth` sama dengan `clientWidth`: tidak ditemukan overflow horizontal dokumen. Menu mobile terbuka dan pilihan analytics “Tolak” berfungsi. Tidak ditemukan gambar yang selesai dimuat tetapi rusak, maupun error/warning console pada halaman publik yang diperiksa.

Hero memakai `srcset` Cloudinary `q_85,f_auto`. Browser menerima MIME `image/webp`; pada mobile gambar dirender sekitar 313 px dengan sumber natural 360 px. Pada desktop 1440 px, hero dirender 720 px dengan sumber natural 770 px dan kandidat transformasi `w_828`. Pemeriksaan visual mempertahankan komposisi dan detail tampilan. Status aset yang diamati berhasil; angka ini tidak menjamin setiap aset di semua halaman atau ketersediaan provider di masa depan. Audit ukuran, WebP lokal, serta PSNR tercantum pada [audit frontend dan gambar](frontend-performance-and-admin-audit.md).

Monitoring super admin pada viewport 390 dan 1440 px tidak menghasilkan overflow horizontal dokumen. Status backend/database/Redis tampil `ok`; log request dibatasi tanpa IP, query URL, token, atau isi formulir. Grafana dimuat melalui iframe yang terautentikasi. Dashboard `SKOMDA operations` menampilkan kenaikan API RPS saat load, p95 API, dan koneksi Nginx. Pada mobile, chart mengikuti satu kolom. Pada revisi ini iframe mula-mula membuka Welcome Grafana; tautan langsung ke dashboard disarankan. Panel 5xx menampilkan “No data” ketika tidak ada seri status 5xx; query perlu menampilkan nol secara eksplisit.

**LCP, CLS, dan INP belum terukur.** Bridge browser yang tersedia tidak menyediakan Performance Timeline, dan evaluasi baca-saja tidak menyediakan Performance API. Screenshot serta pemeriksaan overflow tidak menggantikan Core Web Vitals. Override ukuran pada Edge juga bukan pengujian perangkat Android/iOS nyata atau simulasi CPU/jaringan lambat. Pengujian keyboard lengkap belum selesai. Tidak ada skor Lighthouse atau klaim semua device cepat yang dibuat dari bukti ini.

Audit browser ditutup setelah load selesai untuk menghentikan polling monitoring. `artifacts/browser-device-audit-86cc6ef.json` menyimpan ringkasan pengamatan yang sudah disanitasi, bukan trace Performance Timeline.

## Smoke dan stress terhadap VPS

Generator berjalan pada komputer Windows terpisah; target frontend dan API adalah VPS melalui Cloudflare. Setiap virtual user mengambil satu HTML dan satu daftar API per iterasi, kemudian menunggu 15 detik. Ini bukan 1.000 request aktif serentak dan tidak menjalankan JavaScript/aset browser, upload, login massal, operasi tulis, atau provider AI.

Smoke `artifacts/load-smoke-86cc6ef.json`: 5 user, 18/18 request berhasil. p95 HTML 170,30 ms, API langsung 322,65 ms, proxy 351,50 ms. Smoke membuktikan kesiapan dasar, bukan kapasitas.

Stress `artifacts/load-stress-86cc6ef.json` berlangsung **11:25:12–11:32:28 UTC**. Tahap awal masing-masing memiliki hold 45 detik dan tahap terakhir 120 detik; durasi/RPS laporan termasuk drain user yang masih menunggu.

| Virtual user | Request | Gagal | RPS terukur | p95 HTML / API langsung / proxy (ms) | Hasil |
|---:|---:|---:|---:|---|---|
| 5 | 28 | 0 | 0,48 | 362,34 / 540,41 / 331,47 | Lulus |
| 50 | 298 | 0 | 4,99 | 105,55 / 325,73 / 341,32 | Lulus |
| 100 | 600 | 0 | 9,99 | 120,39 / 319,76 / 324,53 | Lulus |
| 250 | 1.494 | 0 | 24,87 | 184,06 / 315,65 / 298,63 | Lulus |
| 500 | 2.986 | 0 | 49,43 | 137,32 / 240,49 / 244,48 | Lulus |
| 1.000 | 15.440 | 455 (2,947%) | 113,31 | 1.504,15 / 321,76 / 666,27 | **Gagal: error ≥1%** |

Total 20.846 request, 455 HTTP 502 (2,183%). Pada tahap 1.000, frontend mengalami 278 kegagalan dan proxy 177, sedangkan seluruh 3.850 API langsung berhasil. Peak inflight 239 request; p95 lag event loop generator 15,01 ms, sehingga batas loop lag 1 detik tidak tercapai. Beberapa window p95 melewati ambang sebelum kembali normal; agregat p95 tahap masih berada di bawah anggaran. Error HTTP tetap membuat tahap gagal. Tidak ada error 429/challenge WAF/timeout lokal yang dilaporkan sebagai penyebab 455 kegagalan ini.

Menurut inspeksi operator, Nginx mencatat hanya **4 connect error dan 9 upstream timeout**, tetapi kemudian menandai peer frontend tidak tersedia selama 5 detik. Ini kemungkinan memperluas gangguan singkat menjadi 455 respons 502. Fallback `web_previous` juga masih menunjuk slot lama yang sudah dihentikan. Ini diagnosis dari log operator, bukan hasil reproduksi akar masalah yang sudah tuntas.

Perbaikan source sudah tersedia pada `scripts/render-edge.py`: `web_release` memakai `max_fails=1 fail_timeout=1s`, dan fallback ke slot yang sudah dihentikan dihapus. **Belum diverifikasi melalui redeploy dan stress ulang**; hasil 1.000 user tetap gagal sampai ada bukti baru.

Kolektor host mengambil 78 sampel: PID maksimum 446/500, CPU busy maksimum 50,9%, RAM tersedia minimum sekitar 3,09 GB, dan disk tersedia sekitar 19,6 GB. Rata-rata CPU rendah tidak membuktikan tidak ada bottleneck satu thread atau batas container.

Ada side traffic kecil: satu backup terenkripsi selesai sekitar 11:28:19 UTC, dua panggilan AI operator, dan audit browser/monitoring. Tidak ada backup atau scan berikutnya saat load. Pengulangan final harus dipisahkan dari pekerjaan deployment/backup/scan agar hasil dapat dibandingkan.

## Pekerjaan verifikasi berikutnya

1. Pasang perbaikan peer/fallback frontend, konfirmasi tag aktif, dan reproduksi ulang beban sebelumnya.
2. Ulangi audit guard/body deadline/header dan autentikasi yang berubah.
3. Ulangi tahap 1.000 user, lalu spike dan soak. **Spike dan soak belum dijalankan** setelah tahap 1.000 gagal.
4. Ukur Core Web Vitals melalui browser/perangkat yang mendukung trace; ulangi audit media pada revisi runtime public yang baru.
5. Jalankan probe CD baru tanpa intervensi manual, dengan batas PID overlap yang benar.

Model, ambang, cara menjalankan alat, dan pembatasan workload tercantum di [rencana audit](final-audit-plan.md). Kelulusan pengujian yang terukur tidak menjamin bebas bug atau tahan seluruh jenis serangan dan beban.
