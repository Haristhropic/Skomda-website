# Backend: SMK Telkom Sidoarjo (Go High-Performance API)

Service REST API backend untuk website resmi **SMK Telkom Sidoarjo**, dibangun menggunakan **Go (Golang) 1.25** dengan arsitektur **Dual-Engine (Fiber v2 & Gin)**, **GORM ORM**, dan integrasi cloud (Supabase PostgreSQL, Cloudinary, serta NexusRouter AI Gateway).

---

## ⚡ Fitur Utama

- **Dual-Engine Switchable**:
  - **Fiber v2 (Default / Rekomendasi)**: Engine web berkecepatan tinggi berbasis Fasthttp dengan alokasi memori minimal.
  - **Gin**: Engine alternatif yang stabil dan kompatibel penuh dengan middleware standar HTTP.
  - Berganti engine secara instan hanya dengan mengatur environment variable `SERVER_ENGINE=fiber` atau `SERVER_ENGINE=gin`.
- **Database & Auto-Migration (GORM)**:
  - Terhubung ke **Supabase PostgreSQL** untuk lingkungan staging dan produksi.
  - Fallback otomatis ke **Pure-Go SQLite** (`smktelkom_dev.db` via `github.com/glebarez/sqlite`) saat `DATABASE_URL` kosong, sehingga local development dapat langsung berjalan tanpa perlu menginstal server database eksternal.
  - Auto-seeding otomatis untuk data resmi Program Keahlian (**SIJA 4 Tahun** & **TJAT 3 Tahun**) serta artikel berita awal.
- **Modul Berita & Kegiatan (CRUD Penuh)**:
  - Pencarian fleksibel (`?search=...`) dan filter berdasarkan kategori (`?category=...`).
  - Dukungan penambahan dan penghapusan artikel oleh staff humas/admin.
- **AI Chatbot Gateway Proxy**:
  - Endpoint `/api/chatbot/message` yang meneruskan query ke gateway AI NexusRouter (`https://fahlyce.vercel.app`).
  - Fallback bawaan otomatis jika gateway offline: memberikan informasi kontak resmi Humas dan tautan unduh brosur PPDB tanpa error 500.
- **Cloudinary Media Service**:
  - Endpoint tanda tangan aman (`/api/cloudinary/sign`) untuk upload langsung dari sisi klien/admin tanpa membocorkan API Secret.

---

## 📁 Struktur Direktori

```
backend/
├── src/
│   ├── api/
│   │   ├── chatbot/          # Handler & routing AI chatbot (Gin)
│   │   ├── health/           # Handler health check (Gin)
│   │   ├── jurusan/          # Handler data program keahlian (Gin)
│   │   ├── news/             # Handler CRUD berita & artikel (Gin)
│   │   └── fiber_routes.go   # Router & handler komprehensif untuk engine Fiber v2
│   ├── client/
│   │   └── cloudinary/       # Klien Cloudinary API, signature generator, & uploader
│   ├── cmd/
│   │   ├── fiber/            # Dedicated entrypoint Fiber: main.go
│   │   └── server/           # Unified entrypoint: main.go (mendukung switch Fiber & Gin)
│   ├── config/
│   │   ├── config.go         # Environment variable loader via godotenv
│   │   └── db.go             # Inisialisasi GORM, koneksi Postgres/SQLite, & data seeders
│   └── models/
│       ├── jurusan.go        # Skema database program keahlian SIJA & TJAT
│       └── news.go           # Skema database berita & kegiatan
├── smktelkom_dev.db          # Database SQLite lokal (dibuat otomatis untuk dev)
├── Dockerfile                # Konfigurasi container backend
├── go.mod                    # Modul Go & dependensi
└── go.sum                    # Checksum dependensi Go
```

---

## 🚀 Panduan Menjalankan Backend

### 1. Prasyarat
- Go 1.22 atau yang lebih baru (proyek menggunakan Go 1.25.0).
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
DATABASE_URL=                          # Kosongkan untuk menggunakan SQLite lokal otomatis
CLOUDINARY_URL=cloudinary://<key>:<secret>@<cloud_name>
LLM_API_KEY=
JWT_SECRET=rahasia-jwt-skomda
ALLOWED_ORIGIN=http://localhost:3001
NEXUS_ROUTER_URL=https://fahlyce.vercel.app
CHATBOT_MODEL=llama-3.3-70b-versatile    # Model chatbot cepat (Groq Llama 3.3 70B)
SERVER_ENGINE=fiber                    # Pilihan: fiber (default) atau gin
```

### 3. Menjalankan Server

**Opsi A: Menggunakan Engine Fiber (Rekomendasi)**
```bash
go run ./src/cmd/fiber
# atau:
go run ./src/cmd/server
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

### 1. Sistem & Kesehatan
- `GET /api/health`
  - Mengecek status kesehatan service backend dan engine aktif.
  - Response: `{"engine": "fiber-v2", "service": "smktelkom-web-backend", "status": "ok"}`

### 2. Program Keahlian (Jurusan)
- `GET /api/jurusan`
  - Mengambil daftar semua jurusan resmi (SIJA & TJAT).
- `GET /api/jurusan/:slug`
  - Mengambil detail jurusan spesifik berdasarkan slug (contoh: `sija` atau `tjat`).

### 3. Berita & Kegiatan (News)
- `GET /api/news`
  - Query parameters:
    - `category`: Filter berdasarkan kategori (contoh: `Prestasi`, `Kegiatan Sekolah`, `Pengumuman`).
    - `search`: Pencarian kata kunci pada judul, ringkasan, atau isi berita.
  - Response: `{"data": [...], "total": 10}`
- `GET /api/news/:slug`
  - Mengambil detail artikel berdasarkan slug judul.
- `POST /api/news`
  - Menerbitkan artikel baru (digunakan oleh Admin CMS).
  - Request Body (JSON): `title`, `category`, `summary`, `content`, `image`, `author`, dll.
- `DELETE /api/news/:id`
  - Menghapus artikel berdasarkan ID berita.

### 4. Asisten Virtual (AI Chatbot)
- `GET /api/chatbot/health`
  - Memeriksa konektivitas gateway asisten cerdas.
- `POST /api/chatbot/message`
  - Mengirimkan pertanyaan pengunjung ke gateway AI.
  - Request Body:
    ```json
    {
      "message": "Apa saja syarat pendaftaran PPDB?",
      "history": [],
      "stream": false,
      "model": "Emberock"
    }
    ```
  - Jika gateway AI tidak dapat dihubungi, backend secara otomatis membalas dengan pesan bantuan resmi serta link alternatif.

### 5. Media & Upload (Cloudinary)
- `GET /api/cloudinary/sign?folder=skomda/uploads`
  - Menghasilkan parameter tanda tangan (timestamp, signature, api_key) untuk direct-upload dari browser ke Cloudinary.

---

## 🧪 Pengujian Kode (Testing)

Jalankan suite pengujian unit dan verifikasi sintaksis:

```bash
# Verifikasi kode & analisis statis
go vet ./...

# Jalankan semua unit test
go test -v ./...
```
