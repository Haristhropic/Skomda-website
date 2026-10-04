# Audit akhir dan bukti kapasitas demo

Status: alat dan rencana siap. Pengujian live menunggu revisi akhir terpasang di VPS. Dokumen ini tidak menyatakan aplikasi sudah lulus.

## Urutan

1. Rekam SHA image yang benar-benar aktif, hasil CI, health, penggunaan CPU/RAM/disk, jumlah replica, pool PostgreSQL, dan Redis.
2. Audit akses tanpa sesi, role editor/super admin, Origin mutasi, JWT/cookie, kebocoran data publik, log, dependency/image scan, upload dan chatbot.
3. Periksa semua tautan internal Navbar/Footer dan halaman dinamis pada VPS.
4. Ukur tampilan pada lebar 360, 390, 768, 1280, dan 1440 px: overflow, navigasi, gambar, CLS, LCP, serta interaksi keyboard. HTTP load test tidak menjalankan JavaScript/browser dan tidak membuktikan metrik ini.
5. Jalankan smoke, ramp bertahap, spike, dan soak. Amati monitor VPS bersamaan. Hentikan ketika ambang gagal atau generator menjadi bottleneck.
6. Lakukan deploy saat traffic probe berjalan; pastikan request tetap sukses dan rollback tidak menghapus data.
7. Rekam hasil, temuan yang diperbaiki, revisi akhir, dan batas yang belum teruji. Domain utama tetap memerlukan persetujuan promosi.

## Alat HTTP baca-saja

Pilihan k6 yang sudah tersedia: `scripts/load/demo-read-only.js`. Alternatif Python memakai `aiohttp`, tersedia di environment kerja saat penyusunan alat:

```powershell
python scripts/load-test-demo.py --confirm-owned-demo --profile smoke --revision SHA_IMAGE_AKTIF --hold-seconds 30 --output artifacts/load-smoke.json
python scripts/load-test-demo.py --confirm-owned-demo --profile stress --max-vus 1000 --revision SHA_IMAGE_AKTIF --output artifacts/load-stress.json
python scripts/load-test-demo.py --confirm-owned-demo --profile spike --max-vus 1000 --revision SHA_IMAGE_AKTIF --hold-seconds 120 --output artifacts/load-spike.json
python scripts/load-test-demo.py --confirm-owned-demo --profile soak --max-vus 100 --hold-seconds 1800 --revision SHA_IMAGE_AKTIF --output artifacts/load-soak.json
python scripts/load-test-audit.py --confirm-owned-demo --revision SHA_IMAGE_AKTIF --output artifacts/live-audit.json
```

Generator boleh berjalan dari komputer terpisah; **targetnya VPS**, melalui dua hostname demo yang dikunci di script. Menjalankan generator di VPS yang sama dapat menghabiskan CPU/bandwidth aplikasi dan harus dilaporkan bila dilakukan.

- Profil stress: 5 → 50 → 100 → 250 → 500 → 1.000 virtual user, 45 detik per tahap dan 120 detik pada tahap akhir.
- Satu user mengunjungi satu halaman HTML dan satu daftar API publik setiap iterasi, lalu berpikir 15 detik. Jalur API bergantian antara same-origin `/api/backend` dan hostname `api-linear`.
- 1.000 virtual user bukan 1.000 request yang aktif sekaligus. Throughput nominal sekitar 134 request/detik saat latency rendah; script melaporkan throughput dan peak inflight yang terukur.
- `/api/health` hanya preflight satu kali karena mengecek PostgreSQL. Tidak ada login, upload, pendaftaran, chatbot/provider AI, operasi tulis, atau data pribadi yang disimpan.
- Target: error <1%, p95 HTML <2.000 ms, p95 API <1.000 ms; semua status non-200, challenge Cloudflare, tipe respons salah, JSON rusak, body >4 MiB, timeout dan kegagalan transport dihitung gagal.
- Dua window 10 detik berturut-turut yang gagal (minimal 50 request/window) menghentikan traffic. Hasil keseluruhan setiap tahap juga harus lolos; tahap tidak dilanjutkan bila gagal.
- Event loop generator yang tertunda ≥1 detik menghentikan test karena kapasitas target tidak dapat disimpulkan dari generator yang kewalahan.
- Output JSON berisi agregat, p50/p95/p99, status/error, byte respons, per-endpoint dan per-stage. Isi respons, cookie dan kredensial tidak direkam.

Skenario ini mengukur request HTTP publik. Browser assets, cold image transforms, provider AI, media upload, write throughput dan ketahanan jangka panjang memerlukan skenario terpisah. Kelulusan suatu sesi tidak menjamin semua jenis beban atau tidak pernah down.

Referensi: [model API load testing k6](https://grafana.com/docs/k6/latest/testing-guides/api-load-testing/), [batas generator k6](https://grafana.com/docs/k6/latest/testing-guides/running-large-tests/), dan [konfigurasi koneksi aiohttp](https://docs.aiohttp.org/en/stable/client_reference.html).

## Temuan inspeksi awal

Temuan ini dikirim ke agen pemilik untuk perbaikan; status harus ditinjau kembali pada revisi akhir:

| Area | Temuan awal | Risiko |
|---|---|---|
| Replica dan limiter | Counter limiter per-proses pada baseline | Batas dapat berlipat saat backend direplikasi; Redis shared state diperlukan |
| Daftar berita | Pagination hanya aktif bila query `page` dikirim | Ukuran respons/query tidak terbatas ketika dataset membesar |
| Upload | JWT tanpa rate/concurrency cap; ekstensi file bukan validasi isi | Penggunaan memori berlebih dan berkas salah format |
| Multipart dokumen | BodyLimit 15 MiB dan batas berkas 15 MiB | Overhead multipart membuat batas berkas yang diiklankan tidak tercapai |
| HTTP backend | Belum ada timeout read/idle eksplisit | Koneksi lambat berpotensi menahan resource; streaming perlu timeout yang tepat |
| Gambar | Next `images.unoptimized=true` | Responsive resize/format optimasi Next dilewati; perlu optimasi sumber terukur |
| DTP | Data kosong sukses dibaca sebagai fallback localStorage/seed | Konten yang dihapus/dinonaktifkan dapat muncul lagi |
| Chat history | Isi percakapan tersimpan terus di localStorage | Terbaca pengguna berikutnya pada perangkat sekolah bersama |
| CRUD update | Beberapa handler mengabaikan error lookup/save | ID tidak ada dapat berubah menjadi upsert atau kegagalan DB dilaporkan sukses |
| Role editor | Sebagian CRUD dibatasi super admin pada baseline | Panel editor dapat menerima 403 bila hanya antarmuka yang dipisah |
| Event Trial Class | Fallback hardcoded tanggal 26 September 2026 berstatus open | Jadwal yang lewat/belum tersedia dapat terlihat masih membuka pendaftaran |
| Berita fallback | MOCK_NEWS dipakai ketika API gagal | Berita contoh atau konten yang dihapus dapat tampil sebagai berita resmi |
| Proxy admin/auth | Belum memaksa header respons `Cache-Control: no-store` | Policy cache custom di edge dapat menyimpan respons sensitif |

MFA ditunda sesuai scope terbaru. Tidak ada klaim jaminan anti-jailbreak sempurna; audit harus menguji pembatasan dan fallback konkret.
