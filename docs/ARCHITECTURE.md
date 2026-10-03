# Architecture Overview: SMK Telkom Sidoarjo Website

Dokumen arsitektur ini menyajikan gambaran komprehensif mengenai struktur teknis, stack teknologi, alur data, skema database, integrasi eksternal, dan standar rekayasa sistem website resmi **SMK Telkom Sidoarjo (SKOMDA)**.

---

## Daftar Isi

1. [Struktur Proyek](#1-struktur-proyek)
2. [Stack Teknologi Lengkap](#2-stack-teknologi-lengkap)
3. [Diagram Alur Sistem](#3-diagram-alur-sistem)
4. [Frontend: Next.js Application](#4-frontend-nextjs-application)
5. [Backend: Go API Service](#5-backend-go-api-service)
6. [Database & Skema Data](#6-database--skema-data)
7. [Media Storage: Cloudinary](#7-media-storage-cloudinary)
8. [Autentikasi & Keamanan](#8-autentikasi--keamanan)
9. [Integrasi Eksternal](#9-integrasi-eksternal)
10. [Environment Variables](#10-environment-variables)
11. [Lingkungan Pengembangan & Standar QA](#11-lingkungan-pengembangan--standar-qa)
12. [Rencana Pengembangan Lanjutan](#12-rencana-pengembangan-lanjutan)
13. [Identifikasi Dokumen](#13-identifikasi-dokumen)

---

## 1. Struktur Proyek

```
Skomda-website/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth/auth_handler.go
│   │   │   ├── chatbot/
│   │   │   ├── health/
│   │   │   ├── jurusan/
│   │   │   ├── middleware/
│   │   │   ├── news/
│   │   │   ├── admin_crud_routes.go
│   │   │   └── fiber_routes.go
│   │   ├── client/cloudinary/
│   │   ├── cmd/fiber/ & cmd/server/
│   │   ├── config/config.go & db.go
│   │   ├── models/ (14 model)
│   │   └── utils/jwt.go
│   ├── smktelkom_dev.db
│   ├── .env & .env.example
│   ├── Dockerfile
│   └── go.mod & go.sum
├── frontend/
│   ├── public/figma/ & images/
│   ├── src/
│   │   ├── app/ (rute publik + admin + api)
│   │   ├── components/chatbot/ layout/ news/ sections/
│   │   ├── config/adminPath.ts
│   │   ├── context/LanguageContext.tsx
│   │   ├── data/ (teachers.ts, alumni-angkatan-6.json)
│   │   ├── lib/cloudinary.ts & cloudinary-manifest.json
│   │   ├── locales/id.json & en.json
│   │   ├── middleware.ts
│   │   └── services/ (9 service files)
│   ├── .env.local
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── package.json
├── docs/ (ARCHITECTURE.md, PRD.md, WORKFLOW.md, design.md)
├── scripts/sync-cloudinary.mjs
├── GEMINI.md
└── README.md
```

---

## 2. Stack Teknologi Lengkap

### 2.1. Frontend

| Kategori | Teknologi | Versi | Keterangan |
|---|---|---|---|
| Framework | **Next.js** | 16.3.0 | App Router, SSR, SSG, RSC |
| UI Library | **React** | 19.2.8 | React DOM 19.2.8 |
| Bahasa | **TypeScript** | 5.7.3 | Type-safe seluruh codebase |
| Styling | **Tailwind CSS** | 3.4.17 | Utility-first, palet brand Telkom Schools |
| Animasi | **Framer Motion** | 11.15.0 | Animasi deklaratif |
| Icon | **Lucide React** | ^1.37.0 | Icon set ringan, tree-shakeable |
| Markdown | **react-markdown** | ^10.1.0 | Render Markdown di chatbot |
| Markdown Plugin | **remark-gfm** | ^4.0.1 | GitHub Flavored Markdown |
| Linter | **ESLint** | 9.18.0 | eslint-config-next 16.3.0 |
| CSS Processor | **PostCSS** | 8.5.1 | Autoprefixer 10.4.20 |
| Bundler (dev) | **Turbopack** | built-in Next.js | Enabled via next.config.ts |
| Fonts | **Google Fonts** | via next/font/google | Plus Jakarta Sans, Poppins |
| Image CDN | **Cloudinary** | via URL transformer | AVIF & WebP via next/image |
| Auth Guard | **Next.js Middleware** | built-in | Cookie-based, stealth admin route |

### 2.2. Backend

| Kategori | Teknologi | Versi | Keterangan |
|---|---|---|---|
| Bahasa | **Go (Golang)** | 1.25.0 | Statically typed, high-performance |
| HTTP Framework (Default) | **Go Fiber v2** | v2.52.15 | fasthttp-based, low latency |
| HTTP Framework (Alternatif) | **Gin** | v1.10.0 | Switchable via SERVER_ENGINE=gin |
| ORM | **GORM** | v1.31.2 | Auto-migrate, serializer JSON |
| DB Driver (Production) | **gorm/driver/postgres** | v1.6.2 | via pgx v5 |
| DB Driver (Development/Test) | **glebarez/sqlite** | v1.11.0 | Opt-in (`DATABASE_DRIVER=sqlite`); bukan fallback |
| Autentikasi | **golang-jwt/jwt** | v5.3.1 | JWT Bearer token, HS256 |
| Password Hashing | **golang.org/x/crypto** | v0.23.0 | bcrypt cost 12 |
| Env Loader | **joho/godotenv** | v1.5.1 | Load .env ke os.Getenv |
| Rate Limiter | **Fiber limiter** | built-in Fiber | 5 req/menit untuk login |
| CORS | **Fiber cors** | built-in Fiber | Allowlist origin frontend |
| Logger | **Fiber logger** | built-in Fiber | Structured request logging |
| Recover | **Fiber recover** | built-in Fiber | Panic recovery, HTTP 500 |
| Testing | **testify** | v1.11.1 | Assert & mock unit test |

### 2.3. Database

| Lingkungan | Database | Provider | Cara Koneksi |
|---|---|---|---|
| Production / Staging | **PostgreSQL** | Supabase | DATABASE_URL (connection string) |
| Local Development | **PostgreSQL (default) / SQLite (opt-in)** | Lokal atau Supabase / file lokal | `DATABASE_DRIVER` |

> Staging dan production membutuhkan PostgreSQL yang dapat dijangkau saat startup. Koneksi gagal atau `DATABASE_URL` kosong akan menghentikan backend; tidak ada fallback otomatis.
> SQLite hanya dapat dipilih secara eksplisit dengan `DATABASE_DRIVER=sqlite` untuk `development` atau `test`.

### 2.4. Infrastructure & Tooling

| Kategori | Teknologi | Keterangan |
|---|---|---|
| Container | **Docker** | Dockerfile backend Go |
| Media CDN | **Cloudinary** | Upload, transformasi, delivery |
| AI Gateway | **NexusRouter** (fahlyce.vercel.app) | Proxy ke LLM untuk chatbot |
| Maps Embed | **Google Maps** | Iframe lokasi kampus |
| Package Manager (FE) | **npm** | Node 22.x |
| Package Manager (BE) | **Go Modules** | go.mod & go.sum |
| Audit Script | **Node.js ESM** | scripts/sync-cloudinary.mjs |
| Row Level Security | **PostgreSQL RLS** | Aktif di production tabel utama |

---

## 3. Diagram Alur Sistem

```
[ Pengunjung / Siswa / Orang Tua / Staff Admin ]
                        |
                        v
[ FRONTEND: Next.js 16 App Router | Port 3001 (dev) / 3000 (prod) ]
  - Next.js Middleware: cek cookie skomda_admin_token
  - /admin/* tanpa token: rewrite ke /not-found (stealth)
                        |
           HTTP REST (fetch + CORS)
           Cookie: skomda_admin_token (httpOnly)
           Header: Authorization: Bearer <token>
                        |
                        v
[ BACKEND: Go API Service | Port 8080 ]
  Engine: Fiber v2 (default) / Gin (optional via SERVER_ENGINE)
  Middleware: recover > logger > cors > [rate-limiter] > [AuthMiddleware] > Handler
  Routing:
    /api/health, /api/auth/*, /api/news/*, /api/jurusan/*
    /api/chatbot/*, /api/cloudinary/*, /api/admin/* (JWT protected)
          |                    |                   |
        GORM ORM          HTTP Client         HTTP Client
          |                    |                   |
          v                    v                   v
   [ PostgreSQL      [ Cloudinary API    [ NexusRouter AI
     Supabase ]      Upload/Transform/    fahlyce.vercel.app ]
                    CDN Delivery ]

          v
   [ Media Delivery ke Browser ]
     Cloudinary CDN: f_auto, q_auto, g_face, w_auto
     Local Static: /public/ (SVG, ikon, logo)
```

### Prinsip Alur Data:

1. **Pemisahan Peran**: Frontend menangani UI, rendering, i18n. Seluruh mutasi data & komunikasi pihak ketiga via Backend Go.
2. **Keamanan Kredensial**: Cloudinary Secret, JWT Secret, DATABASE_URL hanya di backend `.env`.
3. **Ketahanan Layanan**: Database utama gagal - backend tidak start dan health check gagal; AI gateway error - chatbot memberi info kontak sekolah.
4. **Stealth Admin**: `/admin/*` tampil sebagai `404` untuk user tanpa token.

---

## 4. Frontend: Next.js Application

### 4.1. Rute Halaman Publik

| Path | Render | Deskripsi |
|---|---|---|
| `/` | SSR/SSG | Beranda utama |
| `/informasi/berita` | SSR | Daftar artikel berita |
| `/berita/[slug]` | SSR (Dynamic) | Detail artikel berita |
| `/informasi/pengumuman-kelulusan` | SSG | Pengumuman kelulusan |
| `/informasi/penerapan-k3` | SSG | Informasi K3 |
| `/program/profil-jurusan` | SSR | Profil SIJA & TJAT |
| `/program/ekstrakurikuler` | SSR | Data ekstrakurikuler |
| `/program/digital-talent` | SSG | Program Digital Talent |
| `/program/ts21` | SSG | Program TS21 |
| `/tefa` | SSG | Teaching Factory |
| `/tentang-kami/profil-sekolah` | SSG | Profil sekolah |
| `/tentang-kami/hub-industri` | SSG | Hub Industri & mitra |
| `/tentang-kami/prestasi` | SSR | Data prestasi |
| `/tentang-kami/fasilitas` | SSR | Data fasilitas |
| `/tentang-kami/guru` | SSR | Data tenaga pengajar |
| `/tentang-kami/akomodasi` | SSG | Info akomodasi |
| `/ppdb` | SSG | Penerimaan Peserta Didik Baru |
| `/unduh-informasi` | SSR | Unduh dokumen resmi |
| `/trial-class` | SSG | Kelas percobaan |
| `/trial-class/virtual-class` | SSG | Virtual class detail |

### 4.2. Rute Panel Admin (Protected)

Dilindungi Next.js Middleware (`middleware.ts`): tanpa cookie `skomda_admin_token` di-rewrite ke `/not-found`.
Login hanya via `/gate-internal-skomda` (tidak ada link publik).

| Path | Deskripsi |
|---|---|
| `/gate-internal-skomda` | Halaman login admin tersembunyi |
| `/admin` | Dashboard utama CMS |
| `/admin/berita` | CRUD berita & artikel |
| `/admin/bkk` | CRUD BKK (job, partner, alumni) |
| `/admin/dokumen` | CRUD dokumen unduhan |
| `/admin/ekskul` | CRUD ekstrakurikuler |
| `/admin/fasilitas` | CRUD fasilitas sekolah |
| `/admin/guru` | CRUD data guru |
| `/admin/kelulusan` | Data kelulusan alumni |
| `/admin/prestasi` | CRUD data prestasi |
| `/admin/pengaturan` | Pengaturan situs |
| `/admin/audit-logs` | Log aktivitas admin |

### 4.3. Fitur Interaktif Khusus

| Fitur | Komponen | Deskripsi |
|---|---|---|
| Global Search | `NavbarSearch.tsx` | Modal pencarian + shortcut Ctrl+K / Cmd+K |
| AI Chatbot | `SkomdaChatWidget.tsx` | Widget melayang, Markdown parser, quick-reply, fallback |
| i18n Switcher | `LanguageContext.tsx` | Ganti bahasa instan (ID/EN) tanpa reload |
| Image Optimization | `next/image` | AVIF & WebP, domain res.cloudinary.com |
| Turbopack | `next.config.ts` | Bundler dev cepat |

### 4.4. Services Layer (`src/services/`)

| File | Endpoint Backend |
|---|---|
| `news.ts` | `/api/news`, `/api/admin/news` |
| `teachers.ts` | `/api/admin/teachers` |
| `ekskul.ts` | `/api/admin/ekskul` |
| `fasilitas.ts` | `/api/admin/fasilitas` |
| `prestasi.ts` | `/api/admin/prestasi` |
| `alumni.ts` | `/api/admin/alumni` |
| `bkk.ts` | `/api/admin/bkk` |
| `documents.ts` | `/api/admin/documents` |
| `settings.ts` | `/api/admin/settings` |

### 4.5. Redirects Permanen (`next.config.ts`)

| Source | Destination |
|---|---|
| `/akomodasi` | `/tentang-kami/akomodasi` |
| `/informasi/unduh` | `/unduh-informasi` |
| `/jurusan` | `/program/profil-jurusan` |
| `/jurusan/:slug*` | `/program/profil-jurusan` |

---

## 5. Backend: Go API Service

### 5.1. Arsitektur Dual-Engine

| Engine | Env Value | File Utama | Karakteristik |
|---|---|---|---|
| **Go Fiber v2** | `fiber` (default) | `src/api/fiber_routes.go` | fasthttp-based, throughput tinggi |
| **Gin** | `gin` | `src/api/{news,jurusan,health,chatbot}/` | Standard net/http |

### 5.2. Endpoint API Lengkap

#### Public Endpoints

| Method | Path | Deskripsi |
|---|---|---|
| `GET` | `/api/health` | Status & info engine |
| `POST` | `/api/auth/login` | Login admin, return JWT (rate-limited: 5 req/mnt) |
| `GET` | `/api/auth/me` | Info user login (JWT required) |
| `POST` | `/api/auth/logout` | Logout, hapus cookie |
| `GET` | `/api/news` | Daftar berita publik (paginasi, filter) |
| `GET` | `/api/news/:slug` | Detail berita |
| `GET` | `/api/jurusan` | Daftar program keahlian |
| `GET` | `/api/jurusan/:slug` | Detail jurusan |
| `POST` | `/api/chatbot/message` | Proxy ke NexusRouter AI |
| `POST` | `/api/cloudinary/sign` | Signed upload parameters |

#### Admin Endpoints (Bearer JWT Required)

| Method | Path | Deskripsi |
|---|---|---|
| `GET/POST/PUT/DELETE` | `/api/admin/news` | CRUD berita |
| `GET/POST/PUT/DELETE` | `/api/admin/teachers` | CRUD guru |
| `GET/POST/PUT/DELETE` | `/api/admin/ekskul` | CRUD ekstrakurikuler |
| `GET/POST/PUT/DELETE` | `/api/admin/fasilitas` | CRUD fasilitas |
| `GET/POST/PUT/DELETE` | `/api/admin/prestasi` | CRUD prestasi |
| `GET/POST/PUT/DELETE` | `/api/admin/alumni` | CRUD alumni (kelulusan) |
| `GET/POST/PUT/DELETE` | `/api/admin/bkk` | CRUD BKK (job, partner, alumni BKK) |
| `GET/POST/PUT/DELETE` | `/api/admin/documents` | CRUD dokumen |
| `GET/PUT` | `/api/admin/settings` | Site settings |
| `GET` | `/api/admin/audit-logs` | Log aktivitas |

### 5.3. Middleware Stack (Fiber v2)

```
Request masuk
  v  recover.New()   - Panic recovery, HTTP 500
  v  logger.New()    - Request logging ke stdout
  v  cors.New()      - CORS allowlist (localhost:3000/3001/4321/5173)
  |
  +- [/api/auth/login]
  |    v  limiter.New() - Rate limit: 5 req / 1 menit per IP
  |    v  LoginHandler
  |
  +- [/api/admin/*]
       v  AuthMiddleware - Verifikasi JWT Bearer (HS256)
       v  Admin Handler
```

---

## 6. Database & Skema Data

### 6.1. Konfigurasi

```
Production:   PostgreSQL (Supabase), DATABASE_DRIVER=postgres
              Driver: gorm.io/driver/postgres via jackc/pgx v5
              Koneksi: DATABASE_URL
              RLS: Row Level Security aktif di tabel utama

Development:  PostgreSQL (default) atau SQLite (hanya jika dipilih eksplisit)
              PostgreSQL: DATABASE_URL
              SQLite: DATABASE_DRIVER=sqlite

Startup:      database yang dipilih tidak tersedia -> backend berhenti; tidak ada fallback
```

### 6.2. Skema 14 Model GORM

#### `models.User` — Akun Admin CMS
```
ID        uint           PK
Name      string         size:100, not null
Email     string         size:150, not null, uniqueIndex
Password  string         size:255, not null, bcrypt hash (json:"-")
Role      string         size:50, default:'editor' | "super_admin" | "editor"
Avatar    string         size:500, Cloudinary URL foto profil
CreatedAt time.Time
UpdatedAt time.Time
DeletedAt gorm.DeletedAt (soft delete)
```

#### `models.News` — Berita & Artikel
```
ID            uint           PK
Title         string         size:255, not null
Slug          string         size:255, not null, uniqueIndex
Category      string         size:100, not null
Day           string         size:10  (contoh: "17")
Month         string         size:20  (contoh: "AGT")
DateFormatted string         size:50  (contoh: "17 Agustus 2026")
Time          string         size:20  (contoh: "08.00")
Image         string         size:500, Cloudinary URL / path lokal
Summary       string         type:text, ringkasan card
Content       string         type:text, konten lengkap (Markdown)
Author        string         size:100, default:'Humas SKOMDA'
Status        string         size:20,  default:'published' | "draft"
CreatedAt     time.Time
UpdatedAt     time.Time
DeletedAt     gorm.DeletedAt
```

#### `models.Jurusan` — Program Keahlian
```
ID            uint      PK
Kode          string    size:10, not null, uniqueIndex ("SIJA" | "TJAT")
Nama          string    size:100, not null
Slug          string    size:100, not null, uniqueIndex
Deskripsi     string    type:text, not null
Skills        []string  serializer:json (array kompetensi)
ProspekKarier []string  serializer:json (array karier)
Gambar        string    size:255, Cloudinary URL / path lokal
CreatedAt     time.Time
UpdatedAt     time.Time
```

#### `models.Teacher` — Profil Guru & Staf
```
ID                 uint           PK
Name               string         size:150, not null
Role               string         size:150, not null (jabatan)
Category           string         size:50, not null, index
                                  Kepala Sekolah | Manajemen | Guru SIJA |
                                  Guru TJAT | Guru Umum | Staf
Image              string         size:500, Cloudinary URL
Bio                string         type:text
PendidikanTerakhir string         size:150
BidangKeahlian     string         size:150
Motto              string         size:255
Kontak             string         size:100
OrderIndex         int            default:0, index
CreatedAt          time.Time
UpdatedAt          time.Time
DeletedAt          gorm.DeletedAt
```

#### `models.Ekstrakurikuler` — Kegiatan Ekskul
```
ID          uint           PK
Name        string         size:150, not null
Slug        string         size:150, not null, uniqueIndex
Category    string         size:100, not null, index
                           Olahraga | Seni & Budaya | Teknologi & Riset |
                           Organisasi & Bela Negara
Pembina     string         size:150
Schedule    string         size:150
Description string         type:text
Image       string         size:500, Cloudinary URL
BadgeColor  string         size:50
OrderIndex  int            default:0, index
CreatedAt   time.Time
UpdatedAt   time.Time
DeletedAt   gorm.DeletedAt
```

#### `models.Fasilitas` — Sarana & Prasarana
```
ID          uint           PK
Name        string         size:200, not null
Category    string         size:100, not null, index
                           Laboratorium & Komputer | Fasilitas Umum |
                           Ruang Praktik TEFA
Image       string         size:500, not null, Cloudinary URL
Description string         type:text
Capacity    string         size:100
Features    string         type:text
OrderIndex  int            default:0, index
CreatedAt   time.Time
UpdatedAt   time.Time
DeletedAt   gorm.DeletedAt
```

#### `models.Prestasi` — Capaian & Penghargaan Siswa
```
ID           uint           PK
Slug         string         size:255, not null, uniqueIndex
Title        string         size:255, not null
Category     string         size:50, not null, index
                            IT & AI | Olahraga | Seni & Kreatif | Kepemimpinan
Award        string         size:100, not null
BadgeLevel   string         size:50, not null
                            Juara 1 | Juara 2 | Juara 3 | Gold Medal
Competition  string         size:255, not null
Organizer    string         size:255, not null
Year         string         size:10, not null, index
StudentName  string         size:150, not null
StudentClass string         size:50, not null (contoh: "XI TJAT 3")
Image        string         size:500, Cloudinary URL (opsional)
Description  string         type:text
CreatedAt    time.Time
UpdatedAt    time.Time
DeletedAt    gorm.DeletedAt
```

#### `models.BKKJob` — Lowongan Kerja
```
ID           uint           PK
Title        string         size:255, not null
Company      string         size:200, not null
Location     string         size:150, not null
JobType      string         size:50, default:'Full-time' | Magang | Kontrak
Deadline     string         size:50
Salary       string         size:100
Requirements string         type:text
Description  string         type:text
CompanyLogo  string         size:500, Cloudinary URL
ApplyURL     string         size:500
Status       string         size:20, default:'active' | "closed"
CreatedAt    time.Time
UpdatedAt    time.Time
DeletedAt    gorm.DeletedAt
```

#### `models.BKKPartner` — Mitra Industri
```
ID          uint           PK
Name        string         size:200, not null
Category    string         size:100, not null
Logo        string         size:500, not null, Cloudinary URL
Description string         type:text
Website     string         size:500
OrderIndex  int            default:0, index
CreatedAt   time.Time
UpdatedAt   time.Time
DeletedAt   gorm.DeletedAt
```

#### `models.BKKAlumni` — Kisah Sukses Alumni BKK
```
ID        uint           PK
Name      string         size:150, not null
GradYear  string         size:10, not null
Company   string         size:200, not null
Role      string         size:150, not null
Quote     string         type:text, not null (testimoni)
Photo     string         size:500, Cloudinary URL
CreatedAt time.Time
UpdatedAt time.Time
DeletedAt gorm.DeletedAt
```

#### `models.Alumni` — Data Kelulusan Peserta Didik
```
ID              uint           PK
NISN            string         size:50, index
Name            string         size:255, not null, index
Angkatan        string         size:20, default:'6'
TahunLulus      string         size:10, default:'2024'
TahunAjaran     string         size:20, default:'2023/2024'
StatusKelulusan string         size:50, default:'LULUS'
Kategori        string         size:50, not null, index
                               Melanjutkan Studi | Bekerja | Wirausaha |
                               Mencari Kerja | Alumni
StatusAktivitas string         size:100
Keterangan      string         size:255
Institusi       string         size:255 (kampus/perusahaan)
Jurusan         string         size:255 (program studi/posisi)
CreatedAt       time.Time
UpdatedAt       time.Time
DeletedAt       gorm.DeletedAt
```

#### `models.Document` — Dokumen Unduhan Publik
```
ID            uint           PK
Title         string         size:255, not null
Category      string         size:100, not null, index
                             Unduh Informasi | Dokumen K3 | Kurikulum
FileURL       string         size:500, not null, Cloudinary URL
FileSize      string         size:50 (contoh: "2.4 MB")
FileType      string         size:50, default:'PDF'
Description   string         type:text
DownloadCount int            default:0
IsPublic      bool           default:true
OrderIndex    int            default:0, index
CreatedAt     time.Time
UpdatedAt     time.Time
DeletedAt     gorm.DeletedAt
```

#### `models.SiteSetting` — Konfigurasi Dinamis Website
```
ID          uint      PK
Key         string    size:100, not null, uniqueIndex
Value       string    type:text, not null
Category    string    size:50, default:'general'
                      general | ppdb | contact | announcement
Description string    size:255
UpdatedAt   time.Time
```

#### `models.AuditLog` — Log Aktivitas Admin
```
ID        uint      PK
UserID    uint      index (FK ke User)
UserName  string    size:100
Action    string    size:50, not null, index
                    CREATE | UPDATE | DELETE | LOGIN | LOGOUT
Entity    string    size:50, not null, index (news, teacher, prestasi, ...)
EntityID  string    size:100
Details   string    type:text (JSON string perubahan)
IPAddress string    size:50
CreatedAt time.Time index
```

### 6.3. Auto-Seeder

| Seeder | Kondisi Aktif | Yang Dilakukan |
|---|---|---|
| `SeedDefaultAdminIfEmpty` | Selalu, jika tabel users kosong | Buat `admin@smktelkom-sda.sch.id`, role `super_admin` |
| `SeedAlumniIfEmpty` | Selalu, jika tabel alumnis kosong | Import 255 alumni dari `alumni-angkatan-6.json` |
| `SeedJurusanIfEmpty` | Hanya development | Seed SIJA & TJAT resmi |
| `SeedNewsIfEmpty` | Hanya development | Seed 12 artikel berita resmi |

> **Catatan**: Seeder konten (Jurusan, Berita, Guru, Prestasi, Ekskul, Fasilitas, BKK, Dokumen) **dinonaktifkan permanen di production**. Seluruh data dikelola via Panel Admin.

---

## 7. Media Storage: Cloudinary

### 7.1. Strategi Penyimpanan Hibrida

| Jenis Aset | Penyimpanan | Alasan |
|---|---|---|
| Foto konten (guru, fasilitas, berita) | **Cloudinary CDN** | Transformasi dinamis, kompresi, global delivery |
| Logo resmi Telkom Schools | **`public/`** lokal | Tidak perlu transformasi, hemat kuota CDN |
| Ikon & ilustrasi SVG | **`public/figma/`** lokal | File vektor, tidak perlu kompresi |
| Dokumen PDF / file unduhan | **Cloudinary** | Delivery terkelola & aman |

### 7.2. Transformasi URL Cloudinary

```
https://res.cloudinary.com/{cloud_name}/image/upload/{transformasi}/{public_id}

f_auto  - Format otomatis (AVIF / WebP sesuai browser)
q_auto  - Kualitas otomatis (kompresi optimal)
g_face  - Smart crop berfokus pada wajah (foto profil)
w_auto  - Lebar responsif
```

### 7.3. Alur Upload Media

```
Admin (Browser) - form pilih file
  v
Frontend: POST /api/cloudinary/sign + metadata (folder, tags)
  v
Backend: generate signed params (signature, timestamp, api_key)
  v
Frontend: direct POST ke Cloudinary Upload API
  v
Cloudinary: simpan, kompresi, return public_id & URL
  v
Backend: simpan URL/public_id ke database via GORM
```

### 7.4. Script Sinkronisasi CLI (`scripts/sync-cloudinary.mjs`)

- Audit aset di Cloudinary (ukuran, nama, tanggal)
- Dry-run sebelum upload massal
- Upload batch aset lokal
- Generate `frontend/src/lib/cloudinary-manifest.json`

---

## 8. Autentikasi & Keamanan

### 8.1. Alur JWT

```
1. Admin akses /gate-internal-skomda (tidak ada link publik)
2. Submit email + password
3. Frontend POST /api/auth/login (rate-limited: 5 req/menit)
4. Backend verifikasi bcrypt hash (cost 12)
5. Jika valid: sign JWT (HS256, expiry 24 jam)
6. JWT disimpan di cookie httpOnly: skomda_admin_token
7. /admin/* request: Middleware baca cookie -> allow / rewrite ke /not-found
8. /api/admin/* request: Header Authorization: Bearer <token>
                          AuthMiddleware verifikasi JWT_SECRET
```

### 8.2. Mekanisme Keamanan

| Mekanisme | Implementasi | Tujuan |
|---|---|---|
| Stealth Admin Route | Next.js Middleware rewrite ke /not-found | Sembunyikan panel admin |
| JWT Bearer Token | golang-jwt/jwt v5, HS256, 24h | Autentikasi stateless admin |
| Password Hashing | bcrypt, cost 12 | Password aman di database |
| Rate Limiting Login | Fiber limiter (5 req/mnt/IP) | Cegah brute-force |
| CORS Allowlist | Fiber cors middleware | Hanya origin frontend diizinkan |
| httpOnly Cookie | Set-Cookie response header | JWT tidak bisa diakses JS (anti XSS) |
| Credential Isolation | Semua secret di backend .env | Tidak ada secret di bundel browser |
| PostgreSQL RLS | Row Level Security di production | Pembatasan di level database |
| Audit Log | models.AuditLog, dicatat di setiap mutasi | Jejak CREATE/UPDATE/DELETE/LOGIN/LOGOUT |

---

## 9. Integrasi Eksternal

| Layanan | Peran | Metode Integrasi | Env Variable |
|---|---|---|---|
| **NexusRouter AI Gateway** | Chatbot menjawab pertanyaan profil, PPDB, jurusan | HTTP POST ke fahlyce.vercel.app/api/v1/skomda/chat | `NEXUS_ROUTER_URL`, `LLM_API_KEY` |
| **Cloudinary** | Upload, storage, transformasi, CDN delivery | REST API + Signed Upload | `CLOUDINARY_URL` |
| **PostgreSQL (Supabase)** | Database production | GORM driver postgres | `DATABASE_URL` |
| **Google Maps** | Embed peta lokasi kampus di footer | Iframe embed publik | - |

---

## 10. Environment Variables

### Backend (`backend/.env`)

| Variable | Contoh Nilai | Wajib | Deskripsi |
|---|---|---|---|
| `PORT` | `8080` | Ya | Port server backend |
| `DATABASE_DRIVER` | `postgres` | Ya | `postgres` untuk production; `sqlite` hanya untuk development/test |
| `DATABASE_URL` | `postgres://user:pass@host:5432/db` | Ya jika postgres | PostgreSQL connection string; wajib di staging/production |
| `CLOUDINARY_URL` | `cloudinary://api_key:secret@cloud` | Ya | Credential Cloudinary |
| `LLM_API_KEY` | `sk-ant-xxxxx` | Ya | API key NexusRouter AI |
| `JWT_SECRET` | `min-32-char-random-string` | Ya | Secret sign & verify JWT (HS256) |
| `ALLOWED_ORIGIN` | `http://localhost:3001` | Ya | CORS origin yang diizinkan |
| `SERVER_ENGINE` | `fiber` | Ya | HTTP engine: `fiber` atau `gin` |
| `NEXUS_ROUTER_URL` | `https://fahlyce.vercel.app` | Ya | Base URL AI gateway |

### Frontend (`frontend/.env.local`)

| Variable | Contoh Nilai | Wajib | Deskripsi |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Ya | Base URL backend API |

---

## 11. Lingkungan Pengembangan & Standar QA

### 11.1. Menjalankan Backend

```bash
cd backend

# Default (Fiber v2)
go run ./src/cmd/server

# Alternatif (Gin)
SERVER_ENGINE=gin go run ./src/cmd/server

# Fiber eksplisit
go run ./src/cmd/fiber
```

### 11.2. Menjalankan Frontend

```bash
cd frontend

npm run dev        # Dev server port 3001 (Turbopack)
npm run typecheck  # Type checking
npm run lint       # Linting
npm run build      # Production build
npm run start      # Jalankan production build
```

### 11.3. Port Development

| Service | Port | Perintah |
|---|---|---|
| Frontend (dev) | 3001 | `npm run dev` |
| Frontend (prod) | 3000 | `npm run start` |
| Backend (Go API) | 8080 | `go run ./src/cmd/server` |

### 11.4. QA Gate (wajib lulus sebelum merge ke `main`)

| # | Perintah | Direktori | Kriteria |
|---|---|---|---|
| 1 | `npm run typecheck` | `frontend/` | 0 error TypeScript |
| 2 | `npm run lint` | `frontend/` | 0 warning & 0 error ESLint |
| 3 | `npm run build` | `frontend/` | Build Next.js berhasil |
| 4 | `go vet ./...` | `backend/` | 0 issue Go vet |
| 5 | `go test -v ./...` | `backend/` | Semua unit test lulus |

---

## 12. Rencana Pengembangan Lanjutan

- **Portal Alumni & BKK Publik**: Halaman pencarian lowongan & direktori alumni terbuka untuk pengunjung.
- **VR Virtual Campus Tour**: Penampil 360 derajat fasilitas sekolah.
- **Notifikasi Push**: Notifikasi untuk pengumuman PPDB dan berita penting.
- **Multi-Admin Role**: Hak akses granular (editor, moderator, superadmin).
- **CDN Caching Layer**: Edge caching (Vercel / Cloudflare) untuk API publik.

---

## 13. Identifikasi Dokumen

| Field | Nilai |
|---|---|
| **Nama Proyek** | SMK Telkom Sidoarjo Website |
| **Kode Proyek** | SKOMDA |
| **Status Arsitektur** | Aktif & Tersinkronisasi Penuh |
| **Bahasa Backend** | Go 1.25.0 |
| **Framework Frontend** | Next.js 16.3.0 |
| **Database Primary** | PostgreSQL (Supabase) |
| **Database Development/Test** | PostgreSQL default; SQLite opt-in |
| **Total Model GORM** | 14 (termasuk 3 sub-model BKK) |
| **Terakhir Diperbarui** | September 2026 |
