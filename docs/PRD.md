# Product Requirement Document (PRD): SMK Telkom Sidoarjo Website Redesign

**Versi:** 2.0  
**Status:** In Progress / Core Features Implemented  
**Terakhir Diperbarui:** September 2026  

---

## 1. Latar Belakang & Masalah

Website resmi SMK Telkom Sidoarjo sebelumnya menghadapi sejumlah tantangan operasional dan citra institusi:

| Area | Masalah Lama | Solusi yang Diterapkan di Redesign |
|---|---|---|
| **Visual & Citra** | Gambar buram, kompresi tidak optimal, tata letak kaku | Desain editorial-modern dengan palet resmi Telkom Schools (`#bc0c11`), background bersih (`#f3f4f6`), dan tipografi Google Fonts (Plus Jakarta Sans & Poppins) |
| **Interaksi & Fungsionalitas** | Banyak tombol dan tautan tidak berfungsi | 100% elemen interaktif terhubung ke rute nyata, termasuk tab jurusan interaktif, modal pencarian global, dan tombol unduh |
| **Struktur Konten & Jurusan** | Struktur program lama membingungkan | Standarisasi 2 program keahlian resmi: **SIJA (Program 4 Tahun)** dan **TJAT (Program 3 Tahun)** dengan kurikulum, keahlian, dan prospek kerja yang terperinci |
| **Kecepatan & Pengiriman Media** | Muat gambar berat dan tidak responsif | Integrasi Cloudinary CDN dengan optimasi format otomatis (AVIF/WebP) dan kompresi cerdas (`f_auto,q_auto`) |
| **Layanan Informasi & FAQ** | Keterbatasan staf menjawab pertanyaan berulang | Asisten AI virtual cerdas (**Skomda Intelligence Chatbot**) yang aktif 24 jam dengan fallback ke kontak Humas sekolah |
| **Aksesibilitas & Pengalaman Mobile** | Tampilan mobile sempit, teks bertabrakan | Desain mobile-first responsif penuh, target ketuk minimum 44px, kontras teks WCAG AA, dan navigasi drawer yang nyaman |
| **Pengelolaan Berita (CMS)** | Pembaruan artikel memerlukan campur tangan developer | Tersedia antarmuka admin mandiri di `/admin/berita` untuk staff humas |

---

## 2. Tujuan Utama (Key Objectives)

1. Menghadirkan identitas digital modern yang mencerminkan sekolah vokasi teknologi berstandar industri.
2. Memastikan seluruh elemen navigasi dan tautan berfungsi sempurna tanpa tautan mati.
3. Menyediakan informasi terstruktur untuk seluruh pemangku kepentingan (calon siswa, orang tua, siswa aktif, alumni, dan mitra industri).
4. Menyediakan asisten virtual interaktif berbasis kecerdasan buatan untuk menjawab pertanyaan seputar profil sekolah dan pendaftaran.
5. Memaksimalkan performa web melalui arsitektur Next.js 16 App Router dan backend Go berlatensi rendah.

---

## 3. Batasan Cakupan (Non-Goals)

- Sistem transaksi pembayaran PPDB penuh (pembayaran formulir disalurkan melalui rekening/kanal resmi eksternal yang telah berjalan).
- Sistem Learning Management System (LMS) kelas online untuk kegiatan belajar harian siswa aktif.
- Aplikasi mobile native (Android/iOS) mandiri.

---

## 4. Target Pengguna & Kebutuhan

| Profil Pengguna | Kebutuhan Utama | Implementasi pada Website |
|---|---|---|
| **Calon Siswa & Orang Tua** | Informasi jurusan SIJA/TJAT, keunggulan sekolah, biaya/PPDB, kontak cepat | Beranda, Profil Jurusan, FAQ Chatbot, Unduh Informasi Brosur |
| **Siswa Aktif** | Info ekstrakurikuler, budaya K3, kegiatan sekolah, prestasi | Halaman Ekstrakurikuler, Prestasi, Berita, Penerapan K3 |
| **Alumni** | Jaringan komunikasi, info legalisir, pengumuman | Pengumuman Kelulusan, Berita Alumni, Portal Alumni (fase berikutnya) |
| **Mitra Industri (DUDI)** | Kerjasama magang, Teaching Factory, rekrutmen | Hub Industri, Halaman TEFA, Marquee Mitra di Beranda |
| **Staff & Humas Sekolah** | Publikasi berita dan kegiatan tanpa coding | Dashboard Admin Berita (`/admin/berita`) |

---

## 5. Rincian Fitur & Status Implementasi

### 5.1. Navigasi & Antarmuka Pengguna (P0) — Status: Selesai (Done)
- Navbar melayang responsif dengan dropdown kategori rapi dan drawer mobile.
- Modal Pencarian Global Cepat (`NavbarSearch`) dengan shortcut `Cmd+K` atau `Ctrl+K`.
- Pengalih Bahasa Instan (Bahasa Indonesia & English) via `LanguageContext`.
- Footer 4 kolom informatif dengan statistik pengunjung langsung, tautan cepat, dan sematan Google Maps.

### 5.2. Program Keahlian Vokasi (P0) — Status: Selesai (Done)
- **SIJA (Sistem Informasi Jaringan dan Aplikasi - 4 Tahun)**:
  - Pembelajaran rekayasa perangkat lunak, arsitektur basis data, cloud computing, dan keamanan siber.
- **TJAT (Teknik Jaringan Akses Telekomunikasi - 3 Tahun)**:
  - Pembelajaran teknologi fiber optik, komunikasi nirkabel, dan rekayasa jaringan akses telekomunikasi.
- Akses via tab interaktif di Beranda dan halaman detail di `/program/profil-jurusan`.

### 5.3. Halaman Institusional & Fasilitas (P0) — Status: Selesai (Done)
- Profil Sekolah (`/tentang-kami/profil-sekolah`): Visi misi, sejarah, SK akreditasi, struktur organisasi.
- Hubungan Industri (`/tentang-kami/hub-industri`): Daftar mitra strategis dan program kerja sama.
- Sarana & Prasarana (`/tentang-kami/fasilitas`): Galeri laboratorium komputer, bengkel fiber optik, dan ruang belajar.
- Direktori Pendidik (`/tentang-kami/profil-guru`): Daftar guru dan tenaga kependidikan berbasis foto teroptimasi.
- Prestasi (`/tentang-kami/prestasi`): Dokumentasi capaian kompetisi siswa.
- Akomodasi (`/tentang-kami/akomodasi`): Panduan asrama dan akomodasi siswa dari luar daerah.

### 5.4. Pusat Informasi & Berita (P0) — Status: Selesai (Done)
- Katalog berita lengkap dengan filter kategori, pencarian, dan penomoran halaman di `/informasi/berita`.
- Halaman baca berita dinamis di `/berita/[slug]` dilengkapi widget share artikel.
- Halaman Pengumuman Kelulusan (`/informasi/pengumuman-kelulusan`) dan Penerapan K3 (`/informasi/penerapan-k3`).
- Halaman Unduh Informasi (`/unduh-informasi`) untuk brosur PPDB dan dokumen akademik.

### 5.5. Asisten Virtual Cerdas (AI Chatbot) (P0) — Status: Selesai (Done)
- Widget melayang `SkomdaChatWidget` terhubung ke backend Go (`/api/chatbot/message`) dan gateway AI NexusRouter.
- Rendering format teks Markdown, daftar pertanyaan cepat, dan riwayat obrolan.
- Mekanisme fallback otomatis ke kontak WhatsApp Humas dan link unduh brosur bila sambungan internet terkendala.

### 5.6. Teaching Factory (TEFA) (P1) — Status: Selesai (Done)
- Halaman `/tefa` yang menampilkan lini produksi vokasi siswa dan layanan jasa berbasis industri.

### 5.7. Portal Pengelola Konten (Admin Berita CMS) (P0) — Status: Selesai (Done)
- Antarmuka di `/admin/berita` untuk staff humas melakukan CRUD artikel secara mandiri dengan live card preview dan upload media.

### 5.8. Direktori Alumni & Lowongan BKK (P1) — Status: Rencana Fase Berikutnya
- Formulir pendaftaran database alumni terverifikasi dan papan informasi lowongan kerja kerja sama BKK.

### 5.9. VR Campus Tour 360 Derajat (P2) — Status: Rencana Fase Berikutnya
- Integrasi penampil 360 derajat atau video walkthrough fasilitas sekolah.

---

## 6. Metrik Keberhasilan (Success Metrics)

| Metrik | Target Pasca-Rilis | Status Pengujian Saat Ini |
|---|---|---|
| **Lighthouse Accessibility** | ≥ 90 | Lulus (Semantic HTML, alt text, focus state terpasang) |
| **Lighthouse Performance** | ≥ 85 | Lulus (AVIF/WebP Cloudinary, CSS transitions) |
| **Zero Broken Links** | 0 tautan rusak | Lulus (Semua tombol dan link navbar terhubung ke rute nyata) |
| **Type Safety & Lint** | 0 error | Lulus (`npm run typecheck` & `npm run lint` bersih) |
| **Chatbot Fallback Safety** | 100% aman | Lulus (Tidak ada halusinasi saat offline, langsung fallback ke kontak Humas) |

---

## 7. Status Resolusi Keputusan (Resolved Decisions)

1. **Konfirmasi Program Keahlian**: Resmi disepakati dan dikunci pada 2 program keahlian vokasi: **SIJA (4 Tahun)** dan **TJAT (3 Tahun)**. Informasi lama mengenai TKJ/RPL/TAV telah diperbarui di seluruh basis kode.
2. **Arsitektur Backend**: Backend menggunakan **Go dengan arsitektur Dual-Engine (Fiber v2 default & Gin)** serta GORM untuk kecepatan eksekusi tinggi dan efisiensi memori.
3. **Database Local vs Cloud**: Staging/production memakai **Supabase PostgreSQL**. SQLite hanya boleh dipilih eksplisit untuk `development`/`test`; kegagalan PostgreSQL tidak pernah memicu fallback otomatis.
4. **Strategi Media**: Menggunakan strategi hibrida Cloudinary (CDN foto konten, lokal untuk SVG dan ikon).
