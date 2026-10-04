# Frontend, panel admin, dan audit gambar

Tanggal perubahan: 4 Oktober 2026. Dokumen ini mencatat hasil pemeriksaan kode dan build; hasil browser dan stress test VPS dicatat terpisah pada laporan pengujian deployment.

## Pembagian akses

| Peran | Panel | Fungsi |
| --- | --- | --- |
| Editor | `/admin` | CRUD konten, dokumen, informasi website, DTP, dan pendaftar |
| Super admin | `/admin/monitoring` | Status backend/database/Redis, traffic, latensi, log permintaan terbatas, dan Grafana |
| Super admin | `/admin/audit-logs` | Riwayat audit keamanan dan perubahan |
| Super admin | `/admin/users` | Membuat akun editor dan melihat daftar akun |

Login tetap melalui `/gate-internal-skomda`. Sidebar dan halaman mengarahkan pengguna ke panel sesuai perannya. API Go memeriksa role untuk setiap akses; menyembunyikan tombol bukan kontrol keamanan utama.

Monitoring ringkas berasal dari satu replika backend dan menampilkan nama instance. Total dan rate dihitung sejak proses dimulai; p95 memakai maksimal 2.048 request terbaru. Grafana menggabungkan metrics dari replika. Jumlah request bukan jumlah pengunjung unik. Log permintaan tidak membawa IP, query, isi formulir, atau token.

## Grafana

Grafana berjalan di Docker privat tanpa port publik. Frontend mem-proxy `/api/observability/grafana/` setelah sesi diverifikasi melalui `/auth/me` dan role pengguna masih `super_admin`.

Header identitas diberikan oleh server. Cookie aplikasi, Authorization, serta header identitas kiriman klien tidak diteruskan ke Grafana. Dashboard menggunakan role Viewer, signup/anonymous dinonaktifkan, dan proxy mencegah redirect keluar dari prefix monitoring. Permintaan perubahan wajib berasal dari `FRONTEND_ORIGIN`. Route proxy tidak menyediakan Grafana Live melalui WebSocket; dashboard memakai query HTTP dan refresh biasa.

Konfigurasi server frontend:

```dotenv
BACKEND_API_URL=http://backend:8080/api
FRONTEND_ORIGIN=https://linear.smktelkom-sidoarjo.my.id
GRAFANA_URL=http://grafana:3000
```

Grafana harus memakai root URL `https://linear.smktelkom-sidoarjo.my.id/api/observability/grafana/` dan `serve_from_sub_path=true`. Kredensial tidak dimasukkan dalam dokumen ini.

## Gambar

Audit awal menemukan **219 gambar raster, total 405.975.129 byte** dalam folder sumber. **216 gambar** terdaftar pada manifest Cloudinary. Next Image sekarang memakai loader Cloudinary untuk srcset berdasarkan ukuran perangkat, format `f_auto` (WebP/AVIF sesuai browser), dan kualitas tampilan 85. Cloudinary melakukan transformasi di CDN; VPS tidak meng-encode setiap permintaan gambar.

URL gambar upload mempertahankan cloud pemilik, version, public ID, dan transformasi crop sebelumnya. Gambar asli tidak dihapus atau diperkecil. Ikon SVG dan aset lokal yang tidak dipetakan tetap memakai path lokal.

Tiga foto BKK lokal tidak terdaftar di Cloudinary. Derivative WebP dibuat pada dimensi yang sama, kualitas 90 dan alpha 100:

| Foto | Dimensi | PNG asli | WebP tampilan | PSNR pada background website |
| --- | --- | ---: | ---: | ---: |
| Jasmine | 900 × 1200 | 878.369 byte | 76.444 byte | 45,02 dB |
| Adip | 900 × 1200 | 700.837 byte | 76.002 byte | 44,26 dB |
| Clea | 900 × 1200 | 539.966 byte | 52.398 byte | 48,09 dB |

Total transfer ketiga file turun dari **2.119.172** menjadi **204.844 byte**, pengurangan **90,3%**. PSNR adalah pembanding numerik, bukan pengganti pemeriksaan visual. Foto asli dipertahankan. Detail audit ada di `frontend-image-audit.json`.

Ulangi audit dari folder `frontend`:

```powershell
node scripts/audit-images.mjs
# Opsional: buat ulang derivative lokal tanpa mengganti gambar asli.
node scripts/audit-images.mjs --convert-local
```

## Data dan chatbot

- Dashboard editor tidak menampilkan angka contoh saat API gagal.
- List berita/DTP yang kosong dan detail 404 tetap kosong/tidak ditemukan; data contoh atau localStorage tidak muncul kembali setelah konten dihapus.
- Editor memakai endpoint admin DTP agar dapat mengelola program yang nonaktif; halaman publik hanya menampilkan program aktif.
- Trial Class belum membuka pendaftaran sebelum event aktif dikonfirmasi backend. Ketika API gagal atau belum ada event, UI menampilkan status tertutup/jadwal belum diumumkan.
- Chat memakai same-origin API, timeout 25 detik, maksimal 40 pesan dalam sesi browser, batas ukuran pesan/SSE, dan menghapus transcript localStorage versi lama pada pembukaan chat. Transcript tidak bertahan setelah sesi tab ditutup.
- Kegagalan AI tidak diganti dengan klaim statis yang belum diverifikasi. UI meminta pengguna mencoba lagi atau melihat halaman sekolah. Link respons hanya dapat menuju route lokal atau domain sekolah yang diizinkan.
- API autentikasi/admin serta respons dengan cookie tidak boleh di-cache. Permintaan mutasi memerlukan Origin yang cocok; Origin yang tidak ada atau Host yang mencoba mengganti Origin konfigurasi ditolak.

## Pemeriksaan

Perintah dari folder `frontend`:

```powershell
node scripts/check-runtime-boundaries.mjs
npm run lint
npm run typecheck
npm run build
```

Pemeriksaan runtime mencakup transformasi Cloudinary/responsive width, pemisahan role Grafana, identitas proxy, Origin/CSRF, private caching, dan path cookie. Lint, typecheck, build produksi, serta pemeriksaan runtime lulus pada sesi implementasi ini. Pemeriksaan kode bukan bukti angka LCP/INP/CLS atau kapasitas traffic; itu harus diukur pada deployment VPS dengan browser dan load generator.
