# Uji Beban Demo VPS

Dokumen ini menjelaskan uji beban baca-saja terhadap subdomain demo SKOMDA. Targetnya adalah VPS melalui Cloudflare Tunnel:

- Frontend: `https://linear.smktelkom-sidoarjo.my.id`
- API: `https://api-linear.smktelkom-sidoarjo.my.id/api`

Uji ini **tidak membuktikan** kemampuan domain utama, layanan chatbot, upload Cloudinary, operasi tulis, login admin, atau database untuk beban tulis. Jangan menyebut sistem lolos stress test menyeluruh hanya dari hasil skenario ini.

## Lingkup dan perlindungan

- Hanya GET halaman frontend dan endpoint API publik yang baca-saja.
- Endpoint `/api/health` dipanggil satu kali sebagai preflight karena endpoint itu melakukan ping PostgreSQL.
- Login, pendaftaran, operasi admin, upload, dan chatbot tidak dipanggil.
- Hostname dibatasi ke subdomain demo. Script meminta konfirmasi eksplisit sebelum mengirim traffic.
- `smoke`: 5 VU untuk memastikan alur dan hostname hidup; `load`: mempertahankan nilai `MAX_VUS` selama 5 menit; `stress`: bertahap naik sampai nilai yang dipilih, bertahan 3 menit, lalu turun; `spike`: naik cepat ke nilai yang dipilih, bertahan 2 menit, lalu turun; `soak`: bertahan 30 menit pada maksimum 100 VU.
- Nilai `MAX_VUS` untuk profil selain `smoke` dan `soak`: 50, 100, 250, 500, atau 1.000 VU.
- Satu iterasi mengunjungi satu halaman dan satu API publik, kemudian menunggu 15 detik. Pada 1.000 VU ini menargetkan sekitar 67 iterasi/detik, atau sekitar 134 request/detik gabungan ketika sistem merespons cepat. Angka sebenarnya bergantung pada latency dan koneksi generator.
- Test berhenti dini jika error rate mencapai 1%, pemeriksaan request sukses turun di bawah 99%, p95 frontend melampaui 2 detik, atau p95 API melampaui 1 detik.

## Temuan kapasitas sebelum pengujian

Ini temuan dari inspeksi kode dan konfigurasi; belum merupakan hasil pengukuran beban:

- Compose menjalankan satu instance frontend dengan batas 1 CPU/768 MiB dan satu backend dengan batas 0,75 CPU/512 MiB. Cloudflare Tunnel tidak menambah replica aplikasi atau failover VPS.
- Pool koneksi backend dibatasi 25 koneksi terbuka. Batas efektif juga bergantung pada paket dan mode koneksi Supabase.
- Upload image/dokumen hanya untuk admin terautentikasi, dengan ukuran maksimum 10/15 MB dan tanpa rate limit khusus per endpoint. Proxy Next.js dan helper Cloudinary membentuk salinan isi file di memori; backend dibatasi 512 MiB. Uji upload harus menjadi skenario terpisah berkonkurensi rendah dengan Cloudinary sandbox/persetujuan kuota, sambil memantau RSS/memori container dan biaya provider. Jangan campurkan upload file besar ke tes 1.000 VU halaman publik.
- `/api/health` melakukan ping PostgreSQL sehingga script hanya memanggilnya saat preflight.
- Perubahan lokal membatasi daftar/detail berita publik ke status `published`; endpoint `/api/admin/news` memerlukan sesi autentikasi untuk membaca semua status. Perubahan ini belum diuji atau dipasang di VPS.
- Perubahan lokal membatasi lowongan publik ke status `active`; daftar semua status dipindahkan ke `/api/admin/bkk/jobs` yang memerlukan sesi autentikasi. Perubahan ini belum diuji atau dipasang di VPS.
- Perubahan lokal untuk Trial Class mengganti kode tiket baru menjadi acak kriptografis, membatasi pendaftaran dan pemeriksaan tiket berdasarkan IP pengunjung, serta tidak mengembalikan data pribadi pendaftar dari endpoint cek tiket. Verifikasi tiket tidak lagi membuka akses hanya karena format kode tampak benar, dan formulir pendaftaran tidak membuat tiket palsu ketika backend gagal. Perubahan ini belum diuji atau dipasang di VPS.
- Login, pengajuan lowongan BKK, pendaftaran/cek tiket Trial Class, dan chatbot memakai `CF-Connecting-IP` yang divalidasi untuk penghitungan limit. Ini menghindari semua pengunjung terlihat sebagai satu alamat container di belakang Tunnel.
- Halaman berita melakukan fetch server-side `no-store` dan belum memakai pagination secara default. Daftar API publik lain juga mengembalikan semua baris, sehingga ukuran dataset dan beban database tetap perlu dipantau.
- Chatbot sengaja tidak dimasukkan ke beban awal: kode lokal sekarang mengarahkan browser melalui backend, membatasi 60 permintaan/menit per IP Cloudflare, dan menerima maksimum 16 permintaan aktif per instance. Endpoint tetap meneruskan permintaan ke provider AI dengan timeout hingga 45 detik, sehingga uji chatbot memerlukan persetujuan kuota/biaya provider. Perubahan ini belum diuji atau dipasang di VPS.
- Hasil uji perlu dibaca bersama pemakaian CPU/RAM container, latensi/error per endpoint, koneksi database, dan respons Cloudflare. Green di GitHub Actions hanya menandakan CI/deploy sukses, bukan bukti kapasitas 1.000 pengguna.

## Menjalankan

Jalankan dari mesin generator terpisah yang memiliki koneksi internet memadai dan [k6 terpasang](https://grafana.com/docs/k6/latest/get-started/running-k6/). Aplikasi yang diuji tetap VPS demo, bukan localhost. Hindari waktu PPDB/puncak penggunaan, jalankan satu test saja, dan pantau grafik CPU/RAM Docker VPS serta koneksi dan CPU database Supabase. Minta persetujuan pemilik project database sebelum test yang lebih besar karena backend menggunakan database terkelola.

Mulai dengan tahap kecil:

```powershell
$env:MAX_VUS = "50"
$env:TEST_PROFILE = "stress"
$env:CONFIRM_DEMO_STRESS = "YES_RUN_READ_ONLY_DEMO_LOAD"
k6 run scripts/load/demo-read-only.js
```

Jika 50 VU selesai tanpa ambang gagal, tingkatkan satu tahap setiap kali (`100`, `250`, `500`, lalu `1000`). Hapus variable konfirmasi setelah selesai:

```powershell
Remove-Item Env:CONFIRM_DEMO_STRESS
Remove-Item Env:MAX_VUS -ErrorAction SilentlyContinue
Remove-Item Env:TEST_PROFILE -ErrorAction SilentlyContinue
```

**Jangan langsung mulai dari 1.000 VU.** Jika VPS melambat, error meningkat, tunnel restart, atau database mendekati limit, hentikan dengan `Ctrl+C`. Jangan ulangi tahap tersebut sebelum bottleneck ditinjau.

## Membaca hasil

- `http_req_failed`: persentase request gagal; target awal di bawah 1%.
- `http_req_duration{target:frontend}`: latency frontend dari mesin generator melalui Cloudflare; p95 target di bawah 2 detik.
- `http_req_duration{target:api}`: latency API publik melalui Cloudflare dan Tunnel; p95 target di bawah 1 detik.
- Nilai p95 berarti 95% request lebih cepat dari angka tersebut. Hasil dipengaruhi lokasi, bandwidth, dan beban mesin generator.
- Jika test berhenti sebelum 1.000 VU, tahap tertinggi yang sempat dijalankan bukan bukti lulus 1.000 VU.
- Setiap profil menjawab pertanyaan berbeda: `load` stabil pada target, `stress` mencari batas bertahap, `spike` melihat reaksi terhadap lonjakan cepat, dan `soak` mencari degradasi saat beban berlangsung lama.

## Batas interpretasi

VPS demo menjalankan satu instance frontend dan satu backend dengan batas CPU/memori di Compose, sedangkan PostgreSQL, Cloudinary, chatbot, Cloudflare, dan mesin generator adalah dependensi terpisah. Skenario ini mengukur jalur halaman publik dan baca API; belum mengukur upload, traffic tulis, autentikasi, lonjakan koneksi browser penuh, failover, atau ketahanan jangka panjang. Semua itu membutuhkan skenario terpisah dan batas beban yang disetujui pemilik layanan terkait.

Sebelum menyatakan seluruh sistem siap untuk lomba, rencana pengujian lanjutan perlu mencakup:

| Area | Prasyarat aman | Yang dibuktikan |
|---|---|---|
| Pendaftaran dan operasi tulis | Database staging terpisah atau dataset uji yang boleh dihapus | Throughput write, batas koneksi, dan konsistensi data |
| Login admin | Akun uji, IP allowlist, dan batas percobaan yang disepakati | Latency bcrypt, rate limit, dan perilaku saat banyak login |
| Upload media/dokumen | Cloudinary sandbox atau persetujuan kuota dan pembersihan aset | Batas ukuran, memori, timeout, dan kapasitas provider |
| Chatbot | Rate limit terpasang, stub provider atau persetujuan kuota/biaya provider | Timeout, concurrency, fallback, dan pembatasan request |
| Recovery/failover | Waktu maintenance dan prosedur pemulihan VPS | Waktu pulih setelah container/tunnel/database bermasalah |
| Browser dan aset | Pengujian browser terpisah | Rendering, JavaScript, gambar, dan Core Web Vitals |

Beberapa prasyarat itu belum tersedia dalam konfigurasi demo saat ini. Uji baca-saja tidak membuktikan area tersebut. Karena deployment sekarang satu VPS tanpa replica/failover, hasilnya juga tidak dapat membuktikan high availability.

Lulus pada satu sesi test berarti memenuhi ambang untuk skenario dan waktu pengujian itu saja; bukan jaminan bebas down untuk semua pola traffic.
