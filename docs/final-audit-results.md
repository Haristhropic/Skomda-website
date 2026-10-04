# Hasil audit deployment dan kapasitas

Status 4 Oktober 2026: audit final demo dilaksanakan pada image `sha-d166a85ee4087fb213604d2d71ebe3044d9b2944` di slot `blue`. Ramp 1.000 pengguna bertahap, soak 100 pengguna selama 10 menit, probe ketersediaan, dan audit HTTP live lulus ambang agregatnya. **Burst serentak 1.000 pengguna gagal ambang latency (p95 hingga 10,16 detik) walau tidak menghasilkan HTTP error.** Host memiliki batas 500 PID/thread dan terukur mencapai 499/500 saat soak. Jadi sistem tetap melayani workload bertahap yang diuji, tetapi tidak dapat diklaim tahan spike mendadak ekstrem atau aman terhadap batas host; promosi ke domain utama belum disetujui.

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
| `artifacts/deploy-availability-e51da8a.json` | 298/298 sampel HTTP 200 | Probe sebelum cutover revisi `e51da8a`; baseline sehat saja. |
| `artifacts/deploy-availability-cutover-e51da8a.json` | 236/237 HTTP 200; 1 HTTP 504 | Satu proxy API timeout saat cutover ke frontend kandidat; lihat log dan tindak lanjut pada bagian stress test. |
| `artifacts/deploy-availability-cutover-76ba884.json` | 296/296 sampel HTTP 200 | Run 28 gagal sebelum cutover saat host kehabisan PID ketika membuat replica kandidat keempat; safety trap memulihkan pair aktif `e51da8a`, yang tetap melayani probe. |

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

Perbaikan source `e51da8a` menurunkan `web_release` menjadi `max_fails=1 fail_timeout=1s` dan menghapus fallback ke slot yang sudah dihentikan. Probe sebelum cutover lulus 298/298; probe lintas-cutover mendapat satu 504 dari 237 request pada `/api/backend/jurusan`, lalu pulih. Log Nginx menunjukkan timeout 3 detik saat menghubungkan ke satu frontend kandidat, bersamaan dengan alias Docker slot yang sesaat tidak ter-resolve. Ini mempersempit temuan dari revisi lama, tetapi tidak membuktikan perbaikan selesai.

Source lanjutan kini menggunakan IP container hasil inspeksi sebagai upstream Nginx dan memeriksa rute same-origin ke backend pada kedua kandidat sebelum cutover. **Perubahan ini belum di-deploy atau diukur.** Tahap 1.000 user tetap gagal sampai uji terbaru membuktikan sebaliknya.

CI run 28 berhasil pada pemeriksaan aplikasi, build, dan Trivy, tetapi deployment gagal sebelum cutover karena batas PID 500 saat menyalakan keempat container kandidat. Revisi source berikutnya menyiapkan satu pair kandidat, cutover, menghentikan slot lama, kemudian menambah replica kedua. Run probe saat kegagalan tetap 296/296 HTTP 200; ini membuktikan recovery trap mempertahankan layanan, bukan deployment baru berhasil.

Kolektor host mengambil 78 sampel: PID maksimum 446/500, CPU busy maksimum 50,9%, RAM tersedia minimum sekitar 3,09 GB, dan disk tersedia sekitar 19,6 GB. Rata-rata CPU rendah tidak membuktikan tidak ada bottleneck satu thread atau batas container.

Ada side traffic kecil: satu backup terenkripsi selesai sekitar 11:28:19 UTC, dua panggilan AI operator, dan audit browser/monitoring. Tidak ada backup atau scan berikutnya saat load. Pengulangan final harus dipisahkan dari pekerjaan deployment/backup/scan agar hasil dapat dibandingkan.

## Hasil final revisi d166a85

CI run 30 (`37202343921`) sukses: backend tests/vet, frontend lint/typecheck/build, renderer regression tests, Trivy scans, publikasi image, dan deployment VPS. Image aktif diverifikasi sebagai `sha-d166a85ee4087fb213604d2d71ebe3044d9b2944` pada slot blue. Empat container aplikasi dan komponen observability/Redis sehat setelah deploy. Probe availability pasca-deploy lulus 298/298; monitor saat spike lulus 179/179. Hasil tidak mewakili uptime di luar jendela tes.

Audit live anonim terbaru mencatat **47/47 pass** di `artifacts/final-live-audit-d166a85.json`, termasuk halaman publik, denial endpoint privat tanpa sesi, JWT palsu, Origin yang tidak sah/hilang, identitas Grafana palsu, batas body, dan pengujian deterministik AI guard. Ini bukan audit penetrasi menyeluruh atau bukti AI kebal jailbreak. Pengujian autentikasi/role/CRUD yang lebih lengkap sebelumnya tercatat pada artefak revisi 86cc6ef; revisi d166a85 tidak mengubah kode auth/admin.

Ramp bertahap 5→50→100→250→500→1.000 VU lulus: 29.010 request, 0 error. Pada 1.000 VU terdapat 23.624 request dalam tahap, sekitar 119,93 RPS; p95 frontend 595 ms, API langsung 424 ms, proxy API 461 ms. Modelnya 1.000 sesi baca berpacing (halaman + satu API, lalu think-time 15 detik), bukan 1.000 RPS atau 1.000 request serentak. Rincian: `artifacts/load-stress-d166a85.json`.

Soak 100 VU selama 614 detik lulus: 7.866/7.866 HTTP 200, 0 error, 12,81 RPS; p95 frontend 237 ms, API langsung 335 ms, proxy 329 ms. Terdapat beberapa window 10 detik dengan p95 API sementara melewati ambang, diselingi window pulih; agregat akhir masih lulus. Probe layanan publik sepanjang sekitar 10 menit lulus 595/595. Lihat `artifacts/load-soak-d166a85.json` dan `artifacts/deploy-availability-soak-d166a85.json`.

Burst mendadak dari 5 langsung ke 1.000 VU dalam 100 ms **gagal ambang latency** dan dihentikan setelah dua window berurutan melewati ambang: frontend p95 10.155 ms, direct API 6.934 ms, proxy API 3.465 ms. Semua 2.016 request yang terkirim tetap HTTP 200; availability probe lulus 179/179, tanpa error Nginx 502/504. Kolektor Windows mencatat event-loop lag p95 sekitar 724 ms, sehingga sebagian latency dapat berasal dari generator yang kewalahan; tetap, pengalaman ujung-ke-ujung pada burst ini tidak memenuhi SLO. Artefak: `artifacts/load-spike-d166a85.json` dan `artifacts/deploy-availability-spike-d166a85.json`. Belum diuji burst ramp 5 detik atau lebih lambat.

Telemetry VPS sepanjang soak: **maksimum 499/500 PID/thread**, memori tersedia minimum sekitar 2,88 GiB dari 4 GiB, CPU busy maksimum 17,64%, disk tersedia sekitar 19,45 GB. Ini menunjukkan batas PID host jauh lebih dekat daripada batas RAM/CPU. CPU agregat tidak menyingkirkan bottleneck satu core/proses. Jangan tambah proses/container atau jalankan tes lebih agresif di VPS sebelum kapasitas PID host ditinjau. Data pada `artifacts/host-resources-d166a85.json`, `artifacts/host-resources-soak-d166a85.json`, dan `artifacts/host-resources-spike-d166a85.json`.

Pemeriksaan TCP dari luar VPS menunjukkan 80/443, 2002–2005, 52500, dan 58300 dapat dijangkau; 3306, 6379, 22, serta 30000 langsung tidak merespons dari jalur ini. Port 52500 sesuai konfigurasi port-forward yang pernah ditunjukkan untuk proyek personal dan ada Node host yang listen di 127.0.0.1:30000. Tidak diubah atau dihentikan karena di luar aplikasi sekolah. Tinjau apakah Webuzo 2002–2005 dan port-forward 52500 memang perlu terbuka; batasi melalui panel/provider jika tidak dipakai. Tes TCP tidak mengidentifikasi aplikasi/TLS di setiap port.

## Batas audit yang tersisa

- Core Web Vitals LCP/CLS/INP, Lighthouse, keyboard lengkap, perangkat fisik Android/iOS, dan jaringan/CPU lambat belum terukur. Viewport desktop sebelumnya tidak menggantikan perangkat nyata.
- Tidak dilakukan high-rate 1.000 RPS, login storm, pendaftaran massal, upload/media transform bersamaan, CRUD/write load, pen-test destruktif, atau beban provider AI sungguhan.
- Tidak dapat menjamin aplikasi bebas bug, lolos seluruh jenis serangan, atau tidak pernah down. Dua replica pada satu VPS tetap satu domain kegagalan; ini bukan high availability lintas-host.
- Snapshot `deploy/images/` berisi kandidat image/config yang tidak dipakai untuk release; tidak dikomit dan tidak di-deploy.
- Kredensial root, akun `demo`, dan database yang sempat dibagikan melalui chat perlu dirotasi. Nilainya tidak disalin ke artefak/repo ini.
- Domain utama tetap memerlukan keputusan dan approval promosi tersendiri.

Model, ambang, cara menjalankan alat, dan pembatasan workload tercantum di [rencana audit](final-audit-plan.md). Artefak JSON menyimpan hasil terukur tanpa merekam body privat/kredensial.
