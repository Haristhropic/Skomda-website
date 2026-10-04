# SMK Telkom Sidoarjo

Aplikasi klien web resmi dan portal manajemen konten **SMK Telkom Sidoarjo**, dibangun menggunakan arsitektur modern **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, dan **Framer Motion**.

---

## 🌟 Fitur & Keunggulan Frontend

### 1. Desain Visual Editorial Modern & Neumorphic Tactile
- **Identitas Warna Resmi**: Mengadopsi palet Telkom Schools: Telkom Red (`#bc0c11`), Dark `#101828`, Neutral `#364153`, dan Background Surface `#f3f4f6`.
- **Standar Aksesibilitas Tinggi**: Memenuhi standar kontras WCAG 2.2 AA dengan tipografi jelas (**Plus Jakarta Sans** untuk headline & navigasi, serta **Poppins** untuk body copy).
- **Interaksi Mikro & Fluid Motion**: Transisi halus dan responsif menggunakan akselerasi GPU via Framer Motion dan Tailwind CSS.
- **Optimasi Core Web Vitals**: Waktu muat instan (LCP tinggi), eliminasi layout shift (CLS 0), dan pemecahan bundel modular dinamis untuk modal interaktif.

### 2. Struktur Navigasi & Halaman Publik Komprehensif
- **Beranda (`/`)**: Hero interaktif dengan foto siswa beresolusi tinggi, kartu statistik sekolah mengambang, Sambutan Kepala Sekolah, Nilai Keunggulan, Marquee logo mitra industri tanpa jeda, Tab interaktif Program Keahlian (SIJA & TJAT), dan Kurasi Berita Terbaru.
- **Tentang Kami**:
  - Profil Sekolah (`/tentang-kami/profil-sekolah`)
  - Hubungan Industri (`/tentang-kami/hub-industri`)
  - Prestasi Siswa & Guru (`/tentang-kami/prestasi`)
  - Sarana & Fasilitas (`/tentang-kami/fasilitas`)
  - Direktori Guru & Tenaga Kependidikan (`/tentang-kami/profil-guru`)
  - Akomodasi / Asrama Siswa (`/tentang-kami/akomodasi`)
- **Program Kejuruan & Karakter**:
  - Profil Jurusan SIJA & TJAT (`/program/profil-jurusan`)
  - Ekstrakurikuler (`/program/ekstrakurikuler`)
  - Digital Talent Program (`/program/digital-talent`) dengan 9 spesialisasi unggulan
  - Program Karakter TS.21 (`/program/ts21`)
  - Trial Class Kejuruan (`/trial-class`) dengan pendaftaran online dan penerbitan tiket masuk instan
  - Virtual Class Interaktif (`/trial-class/virtual-class`) dengan verifikasi tiket, materi video, lab simulasi, dan kuis pemahaman
- **Unit Bisnis & Bursa Kerja**:
  - Teaching Factory (`/tefa`): Showcase produk karya siswa (Web, Mobile, IoT, Jaringan) dan formulir pemesanan proyek industri
  - Bursa Kerja Khusus (`/bkk`): Portal karir vokasi, lowongan kerja terverifikasi, program magang industri, dan alumni tracer
- **Pusat Informasi & Layanan**:
  - Portal Berita Terpadu (`/informasi/berita`) dan Halaman Baca Artikel Dinamis (`/berita/[slug]`)
  - Pengumuman Kelulusan Real-Time (`/informasi/pengumuman-kelulusan`) berbasis NISN dan tanggal lahir
  - Penerapan K3 Lingkungan & Laboratorium (`/informasi/penerapan-k3`)
  - Pusat Unduh Dokumen Resmi (`/unduh-informasi`)
  - Informasi SPMB / PPDB (`/ppdb`)

### 3. Panel Admin CMS Terpadu (`/admin`)
- Autentikasi aman berbasis JWT dengan proteksi rute (`/admin/login`).
- **Dashboard Statistik (`/admin`)**: Ringkasan metrik data secara real-time.
- **Manajemen Berita (`/admin/berita`)**: CRUD artikel, kategori, draft/publish, pencarian, dan unggah media.
- **Digital Talent Program (`/admin/dtp`)**: Pengelolaan kurikulum 9 track DTP, mentor, dan kuota.
- **Manajemen Prestasi (`/admin/prestasi`)**: Rekam jejak juara siswa dan guru.
- **Manajemen Guru (`/admin/guru`)**: Direktori pendidik, NIP, mapel, foto, dan bidang keahlian.
- **Manajemen BKK (`/admin/bkk`)**: Publikasi lowongan kerja, data mitra industri, dan batas waktu.
- **Pendaftar Trial Class (`/admin/trial-class`)**: Database pendaftar calon siswa, live search, filter jurusan/status, direct link WhatsApp, dan ekspor CSV.
- **Dokumen Unduhan (`/admin/dokumen`)**: Repositori file unduhan publik.
- **Ekstrakurikuler (`/admin/ekskul`)**: Pengelolaan klub kesiswaan dan galeri.
- **Sarana & Fasilitas (`/admin/fasilitas`)**: Inventarisasi prasarana dan lab.
- **Kelulusan Siswa (`/admin/kelulusan`)**: Manajemen status kelulusan siswa.
- **Pengaturan Website (`/admin/pengaturan`)**: Konfigurasi kontak humas, media sosial, dan alamat.
- **Audit Logs (`/admin/audit-logs`)**: Riwayat audit aktivitas mutasi data oleh admin.

### 4. Asisten Virtual Cerdas (Skomda Intelligence Chatbot)
- Widget melayang `SkomdaChatWidget` yang terhubung ke service backend Go.
- Menjawab pertanyaan pengunjung terkait jurusan, kurikulum, fasilitas, dan PPDB dalam format Markdown.
- Dilengkapi rekomendasi pertanyaan cepat (*quick suggestion chips*), riwayat obrolan, dan fallback otomatis ke kontak resmi WhatsApp Humas jika terjadi kendala jaringan.

### 5. Pencarian Cepat Global (Global Search Modal)
- Komponen `NavbarSearch` dengan pintasan keyboard `Cmd+K` atau `Ctrl+K`.
- Menelusuri seluruh halaman portal, program keahlian, dan arsip berita secara instan tanpa memuat ulang halaman.

### 6. Dukungan Multi-Bahasa (Bilingual i18n)
- Status bahasa dikelola via `LanguageContext` dengan terjemahan Bahasa Indonesia (`src/locales/id.json`) dan Bahasa Inggris (`src/locales/en.json`).
- Pengalihan bahasa instan dari header navbar dengan penyimpanan preferensi di browser pengguna.

### 7. Pengoptimalan Media Cloudinary CDN
- Helper `src/lib/cloudinary.ts` untuk konversi format otomatis (AVIF/WebP), kompresi kualitas adaptif (`q_auto`), dan deteksi wajah pada foto profil guru (`g_face`).

---

## 📁 Struktur Direktori Frontend

```
frontend/
├── public/                     # Aset statis publik (logo, SVG, ilustrasi)
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Panel Admin CMS (12 modul manajemen data)
│   │   ├── berita/[slug]/      # Halaman artikel dinamis
│   │   ├── gate-internal-skomda/ # Portal otentikasi internal
│   │   ├── informasi/          # Berita, pengumuman kelulusan, penerapan K3
│   │   ├── program/            # Profil jurusan, DTP, TS21, ekstrakurikuler
│   │   ├── tefa/               # Showcase Teaching Factory & formulir proyek
│   │   ├── tentang-kami/       # Profil sekolah, guru, fasilitas, asrama
│   │   ├── trial-class/        # Registrasi trial class & virtual class interaktif
│   │   ├── unduh-informasi/    # Pusat unduhan dokumen resmi
│   │   ├── globals.css         # Styling global & animasi neumorphism
│   │   ├── layout.tsx          # Root layout (Google Fonts, LanguageProvider, Chatbot)
│   │   └── page.tsx            # Halaman Beranda utama
│   ├── components/             # Komponen reusable
│   │   ├── chatbot/            # SkomdaChatWidget & message bubbles
│   │   ├── layout/             # Navbar, Footer, Global Search Modal
│   │   └── sections/           # Komponen seksi visual per halaman
│   ├── context/                # Provider status aplikasi (LanguageContext)
│   ├── data/                   # Data terstruktur statis & fallback awal
│   ├── lib/                    # Helper URL Cloudinary & optimasi aset
│   ├── locales/                # Kamus terjemahan bilingual (id.json & en.json)
│   └── services/               # Klien HTTP fetch ke REST API Go
├── package.json                # Dependencies manifest
├── tailwind.config.ts          # Konfigurasi Tailwind CSS & token warna
└── tsconfig.json               # Konfigurasi compiler TypeScript
```

---

## 🚀 Panduan Menjalankan Frontend

### 1. Instalasi Dependensi
```bash
cd frontend
npm install
```

### 2. Menjalankan Server Development
```bash
npm run dev
```
Aplikasi akan aktif di `http://localhost:3001` (atau `http://localhost:3000`).

### 3. Build & Menjalankan Bundel Produksi
```bash
npm run build
npm run start
```

---

## 🧪 Pemeriksaan Kualitas Kode (QA)

Sebelum membuat pull request atau melakukan deployment, pastikan seluruh pemeriksaan berikut berhasil:

```bash
# 1. Verifikasi tipe data TypeScript (wajib 0 error)
npm run typecheck

# 2. Pemeriksaan aturan sintaksis kode ESLint
npm run lint

# 3. Pengujian kompilasi build produksi Next.js
npm run build
```
