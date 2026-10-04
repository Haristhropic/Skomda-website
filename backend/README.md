# Backend: SMK Telkom Sidoarjo (Go High-Performance API)

Service REST API backend untuk website resmi **SMK Telkom Sidoarjo**, dibangun menggunakan **Go (Golang) 1.23+** dengan arsitektur **Dual-Engine (Fiber v2 & Gin)**, **GORM ORM**, dan integrasi cloud (Supabase PostgreSQL, Cloudinary, serta NexusRouter AI Gateway).

---

## ⚡ Fitur Utama

- **Dual-Engine Switchable**:
  - **Fiber v2 (Default & Rekomendasi)**: Engine web berkecepatan tinggi berbasis Fasthttp dengan alokasi memori minimal.
  - **Gin**: Engine alternatif yang stabil dan kompatibel penuh dengan middleware standar HTTP.
  - Berganti engine secara instan hanya dengan mengatur environment variable `SERVER_ENGINE=fiber` atau `SERVER_ENGINE=gin`.
- **Database & Migrations**:
  - Terhubung ke **PostgreSQL** melalui `DATABASE_URL` (Supabase untuk staging dan produksi).
  - PostgreSQL wajib untuk staging dan production; backend mengecek koneksi saat startup dan berhenti jika database tidak tersedia.
  - SQLite lokal hanya bisa dipilih eksplisit dengan `DATABASE_DRIVER=sqlite` di luar production. Kegagalan koneksi Postgres tidak pernah memicu fallback otomatis.
  - Development/test menyinkronkan model dan inisialisasi data saat startup. Production hanya membuka koneksi saat startup; perubahan skema dijalankan lewat SQL migrations Goose berversi yang di-embed ke image melalui `/app/migrate`. Database existing harus diadopsi sekali dengan `--baseline-existing` setelah pemeriksaan inventaris dan kecocokan terhadap dump schema terbaru. Seed awal tetap hanya bila operator memberikan `--seed-initial` secara eksplisit.
- **Autentikasi JWT & Otorisasi Role-Based**:
  - Proteksi rute admin menggunakan token JWT (`golang-jwt/jwt/v5`).
  - Verifikasi identitas user, enkripsi password via `bcrypt`, dan audit logging aktivitas.
- **Modul Layanan Lengkap (CRUD Penuh)**:
  - **Berita & Artikel**: Pencarian teks (`?search=...`), filter kategori (`?category=...`), dan manajemen publikasi.
  - **Digital Talent Program (DTP)**: Pengelolaan 9 track spesialisasi, roadmap materi, mentor, dan kuota.
  - **Prestasi Siswa & Guru**: Pencatatan kejuaraan tingkat kota, provinsi, nasional, dan internasional.
  - **Direktori Guru & Tendik**: Data kepegawaian, mata pelajaran, NIP, foto, dan bidang kompetensi.
  - **Bursa Kerja Khusus (BKK)**: Lowongan kerja aktif, mitra industri terpercaya, dan kualifikasi pelamar.
  - **Trial Class & Tiket Masuk**: Pendaftaran calon siswa baru secara interaktif, penerbitan tiket unik (`TC-SIJA-XXXX` / `TC-TJAT-XXXX`), filter status, direct WhatsApp contact link, dan ekspor CSV.
  - **Dokumen Publik**: Manajemen unduhan brosur PPDB, kurikulum, dan panduan K3.
  - **Ekstrakurikuler & Fasilitas**: Data klub kesiswaan dan inventaris sarana prasarana sekolah.
  - **Kelulusan Siswa**: Pengecekan kelulusan berbasis NISN dan tanggal lahir secara real-time.
  - **Audit Logs**: Rekam jejak seluruh mutasi data oleh akun admin.
- **AI Chatbot Gateway Proxy**:
  - Endpoint `/api/chatbot/message` yang meneruskan query ke gateway AI NexusRouter (`https://fahlyce.vercel.app`) dengan model `llama-3.3-70b-versatile`.
  - Fallback bawaan otomatis jika gateway offline: memberikan informasi kontak resmi Humas dan tautan unduh brosur PPDB tanpa error 500.
- **Cloudinary Media Service**:
  - Endpoint tanda tangan aman (`/api/cloudinary/sign`) untuk upload langsung dari sisi klien/admin tanpa membocorkan API Secret.

---

## 📁 Struktur Direktori

```
backend/
├── src/
│   ├── api/
│   │   ├── admin_crud_routes.go  # Controller & CRUD handler lengkap untuk CMS admin
│   │   ├── fiber_routes.go       # Registrasi seluruh rute & middleware engine Fiber v2
│   │   ├── auth/                 # Handler login & claims JWT
│   │   ├── chatbot/              # Handler AI chatbot & fallback logic
│   │   ├── health/               # Health check status handler
│   │   ├── jurusan/              # Handler data jurusan SIJA & TJAT
│   │   ├── middleware/           # JWT auth guard, CORS, logger, recovery
│   │   └── news/                 # Handler berita & artikel publik
│   ├── client/
│   │   └── cloudinary/           # Klien Cloudinary API, signature generator, & uploader
│   ├── cmd/
│   │   ├── fiber/                # Dedicated entrypoint Fiber: main.go
│   │   └── server/               # Unified entrypoint: main.go (mendukung switch Fiber & Gin)
│   ├── config/
│   │   ├── config.go             # Environment variable loader via godotenv
│   │   └── db.go                 # Koneksi DB, migrasi eksplisit, & seeders
│   ├── src/cmd/migrate/          # CLI migrasi production; seed opsional eksplisit
│   └── models/                   # Definisi skema GORM
│       ├── alumni.go             # Skema data alumni & tracer study
│       ├── audit_log.go          # Skema jejak audit aktivitas admin
│       ├── bkk.go                # Skema lowongan kerja & mitra BKK
│       ├── document.go           # Skema dokumen publik & brosur
│       ├── dtp.go                # Skema Digital Talent Program
│       ├── ekskul.go             # Skema kegiatan ekstrakurikuler
│       ├── fasilitas.go          # Skema sarana & fasilitas
│       ├── jurusan.go            # Skema program keahlian SIJA & TJAT
│       ├── news.go               # Skema artikel berita
│       ├── prestasi.go           # Skema prestasi siswa & guru
│       ├── site_setting.go       # Skema konfigurasi identitas situs
│       ├── teacher.go            # Skema direktori guru & tendik
│       ├── trial_class.go        # Skema pendaftaran Trial Class & tiket masuk
│       └── user.go               # Skema akun admin & password hash
├── Dockerfile                    # Konfigurasi container backend
├── go.mod                        # Modul Go & dependensi
└── go.sum                        # Checksum dependensi Go
```

---

## 🚀 Panduan Menjalankan Backend

### 1. Prasyarat
- Go 1.23 atau yang lebih baru.
- Git.

### 2. Konfigurasi Environment (`.env`)
Salin file `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Contoh konfigurasi `.env`:
```env
ENV=development
PORT=8080
DATABASE_DRIVER=postgres          # postgres; pilih sqlite hanya eksplisit untuk pengembangan lokal
DATABASE_URL=postgres://user:password@localhost:5432/smktelkom
CLOUDINARY_URL=cloudinary://<key>:<secret>@<cloud_name>
LLM_API_KEY=
JWT_SECRET=                         # Isi random secret kuat; wajib minimal 16 karakter di production
ADMIN_DEFAULT_PASSWORD=             # Diperlukan bila bootstrap production dijalankan dengan --seed-initial
ALLOWED_ORIGIN=http://localhost:3001
NEXUS_ROUTER_URL=https://fahlyce.vercel.app
CHATBOT_MODEL=llama-3.3-70b-versatile    # Model chatbot cepat (Groq Llama 3.3 70B)
SERVER_ENGINE=fiber                    # Pilihan: fiber (default) atau gin
```

### 3. Menjalankan Server

**Opsi A: Menggunakan Engine Fiber (Rekomendasi Default)**
```bash
go run ./src/cmd/server
# atau jalankan runner khusus fiber:
# go run ./src/cmd/fiber
```

**Opsi B: Menggunakan Engine Gin**
```bash
# Di PowerShell (Windows):
$env:SERVER_ENGINE="gin"; go run ./src/cmd/server

# Di Bash / Linux / macOS:
SERVER_ENGINE=gin go run ./src/cmd/server
```

Server akan aktif dan mendengarkan pada `http://localhost:8080`.

---

## 📡 Dokumentasi Endpoint REST API

Semua endpoint berada di bawah prefix `/api`:

### 1. Endpoint Publik

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/health` | Status kesehatan service backend dan engine aktif |
| `GET` | `/api/jurusan` | Daftar program keahlian (SIJA & TJAT) |
| `GET` | `/api/jurusan/:slug` | Detail program keahlian berdasarkan slug |
| `GET` | `/api/news` | Daftar artikel berita dengan query `?category=` dan `?search=` |
| `GET` | `/api/news/:slug` | Detail artikel berdasarkan slug judul |
| `GET` | `/api/bkk/jobs` | Daftar lowongan kerja aktif |
| `GET` | `/api/bkk/partners` | Daftar mitra industri BKK |
| `GET` | `/api/dtp` | Data 9 spesialisasi Digital Talent Program |
| `GET` | `/api/teachers` | Direktori guru dan tenaga kependidikan |
| `GET` | `/api/achievements` | Galeri prestasi siswa dan guru |
| `GET` | `/api/facilities` | Daftar sarana dan fasilitas sekolah |
| `GET` | `/api/extracurriculars` | Katalog kegiatan ekstrakurikuler |
| `GET` | `/api/documents` | Dokumen dan brosur yang dapat diunduh |
| `POST` | `/api/graduation/check` | Pengecekan kelulusan (body: `nisn`, `birth_date`) |
| `POST` | `/api/trial-class/register` | Pendaftaran peserta Trial Class & generate kode tiket |
| `POST` | `/api/chatbot/message` | Kirim pertanyaan ke asisten cerdas Skomda Intelligence |
| `GET` | `/api/settings/public` | Informasi kontak, jam operasional, dan sosial media |
| `GET` | `/api/cloudinary/sign` | Generate parameter tanda tangan untuk direct upload |

### 2. Endpoint Admin (Memerlukan `Authorization: Bearer <TOKEN>`)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/auth/login` | Login admin dan mendapatkan token JWT |
| `GET` | `/api/auth/me` | Memeriksa user profil yang sedang login |
| `GET` | `/api/admin/stats` | Statistik ringkas seluruh modul data untuk dashboard |
| `GET, POST` | `/api/admin/news` | Ambil semua berita / Buat artikel baru |
| `PUT, DELETE` | `/api/admin/news/:id` | Update / Hapus artikel berita |
| `GET, POST` | `/api/admin/dtp` | Ambil data DTP / Tambah spesialisasi baru |
| `PUT, DELETE` | `/api/admin/dtp/:id` | Update / Hapus spesialisasi DTP |
| `GET, POST` | `/api/admin/achievements` | Ambil data prestasi / Tambah prestasi baru |
| `PUT, DELETE` | `/api/admin/achievements/:id` | Update / Hapus data prestasi |
| `GET, POST` | `/api/admin/teachers` | Ambil data guru / Tambah guru baru |
| `PUT, DELETE` | `/api/admin/teachers/:id` | Update / Hapus data guru |
| `GET, POST` | `/api/admin/bkk` | Ambil data lowongan / Tambah lowongan baru |
| `PUT, DELETE` | `/api/admin/bkk/:id` | Update / Hapus data lowongan BKK |
| `GET` | `/api/admin/trial-class` | Ambil data pendaftar Trial Class (dukung `?search=`, `?major=`, `?status=`) |
| `PUT, DELETE` | `/api/admin/trial-class/:id` | Update status (Terdaftar/Hadir/Selesai) atau hapus |
| `GET, POST` | `/api/admin/documents` | Kelola file dokumen unduhan |
| `GET, POST` | `/api/admin/extracurriculars` | Kelola kegiatan ekstrakurikuler |
| `GET, POST` | `/api/admin/facilities` | Kelola sarana prasarana sekolah |
| `GET, POST` | `/api/admin/graduation` | Kelola database kelulusan siswa |
| `GET, PUT` | `/api/admin/settings` | Kelola konfigurasi dan kontak website |
| `GET` | `/api/admin/audit-logs` | Lihat riwayat audit trail aktivitas admin |

### Request ID dan access log

Backend mengembalikan header `X-Request-ID` pada setiap response dan mencatat ID, method, route template, status HTTP, serta durasi ke stdout. Next.js membuat UUID baru untuk request same-origin yang diproxy ke backend, lalu meneruskan ID respons ke browser. Penolakan lokal proxy juga dicatat dengan ID, status, dan alasan umum di log frontend. Request langsung ke API mendapat ID dari backend. Log sengaja tidak memuat query string, request/response body, IP, cookie, atau kredensial. Cari ID di log frontend untuk error proxy yang terjadi sebelum backend; selain itu cari ID yang sama di log backend.

Pada `ENV=production`, endpoint `/api/upload/image` dan `/api/upload/document` mensyaratkan Cloudinary tersedia. Jika konfigurasi Cloudinary tidak lengkap atau upload gagal, endpoint membalas `503` dan tidak menyimpan file ke filesystem container. Fallback filesystem hanya berlaku pada development dan tidak tahan terhadap penggantian container.

---

## 🧪 Pengujian Kode (Testing)

Jalankan pengujian sintaksis dan unit test:

```bash
# Analisis statis sintaksis kode
go vet ./...

# Jalankan seluruh unit test
go test -v ./...
```
