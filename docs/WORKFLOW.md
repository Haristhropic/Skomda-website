# Workflow & Implementation Roadmap: SMK Telkom Sidoarjo Website

Panduan alur kerja pengembangan, status pencapaian fase, dan checklist jaminan kualitas (QA) untuk website resmi **SMK Telkom Sidoarjo**.

---

## 📊 Status Pencapaian Fase (Progress Overview)

| Fase | Deskripsi & Ruang Lingkup | Status | Output Utama |
|---|---|---|---|
| **Fase 0** | Audit situs lama, inventarisasi aset & data resmi sekolah | **Selesai** | Data kurikulum SIJA & TJAT, struktur navigasi, aset visual |
| **Fase 1** | Design system editorial-modern & pondasi arsitektur | **Selesai** | Token warna Tailwind, Google Fonts Plus Jakarta Sans + Poppins, GORM DB seeder |
| **Fase 2** | Pembuatan halaman publik inti (15+ Halaman) | **Selesai** | Beranda, 6 Halaman Tentang Kami, 4 Halaman Program, Pusat Berita, TEFA, Unduh Info |
| **Fase 3** | Fitur interaktif lanjutan & tooling manajemen | **Selesai** | AI Chatbot (Skomda Intelligence), Global Search Modal (Cmd+K), Multi-bahasa (ID/EN), Admin CMS Berita (`/admin/berita`), Pipeline Media Cloudinary |
| **Fase 4** | Integrasi ekosistem alumni, BKK, & tour 360 | **Fase Berikutnya** | Direktori alumni terverifikasi, papan lowongan BKK mitra industri, embed VR Campus Tour |

---

## 🔄 Alur Kerja Pengembangan Harian

### 1. Pengembangan Antarmuka Frontend (Next.js 16)
1. **Pemeriksaan Standar Desain**: Selalu rujuk [`docs/design.md`](file:///c:/Users/nadem/Skomda-website/docs/design.md) untuk palet warna, tipografi, dan skala border-radius.
2. **Pengembangan Komponen**:
   - Manfaatkan komponen modular di `frontend/src/components/`.
   - Pastikan teks antarmuka mendukung dwibahasa via `useLanguage()` dan kamus `locales/{id,en}.json`.
   - Gunakan `<Image>` dengan atribut `alt` deskriptif dan optimasi Cloudinary helper di `src/lib/cloudinary.ts`.
3. **Verifikasi Sebelum Selesai**:
   ```bash
   cd frontend
   npm run typecheck   # Wajib 0 error TypeScript
   npm run lint        # Wajib 0 warning/error ESLint
   ```

### 2. Pengembangan Layanan Backend (Go Fiber / Gin)
1. **Pemisahan Lapisan Kode**:
   - Handler tipis di `src/api/{domain}/` atau `src/api/fiber_routes.go`.
   - Logika integrasi pihak ketiga di `src/client/`.
   - Skema database di `src/models/` dengan validasi tag struct yang jelas.
2. **Kesesuaian Database**:
   - Gunakan PostgreSQL untuk staging/production; SQLite hanya sebagai driver eksplisit pada `development`/`test`, tanpa fallback saat PostgreSQL gagal.
   - Gunakan `serializer:json` untuk data array seperti daftar keahlian atau prospek karier.
3. **Verifikasi Sebelum Selesai**:
   ```bash
   cd backend
   go vet ./...
   go test -v ./...
   ```

### 3. Pengelolaan Media Gambar (Cloudinary)
1. Tempatkan gambar baru di `frontend/public/images/{kategori}/`.
2. Jalankan audit lokal:
   ```bash
   node scripts/sync-cloudinary.mjs
   ```
3. Upload gambar ke Cloudinary CDN jika kredensial `CLOUDINARY_URL` tersedia:
   ```bash
   node scripts/sync-cloudinary.mjs --upload
   ```

---

## 🛡️ Quality Gate (Checklist Wajib Sebelum Commit & Rilis)

Sebelum fitur atau pembaruan dianggap selesai, verifikasi seluruh item berikut:

- [x] **Zero Broken Links**: Seluruh tombol, menu dropdown, dan tautan di navbar/footer mengarah ke rute aktif yang valid.
- [x] **Zero TypeScript Errors**: `npm run typecheck` menghasilkan 0 error pada seluruh rute dan komponen.
- [x] **Zero Linter Warnings**: `npm run lint` lulus tanpa warning maupun error.
- [x] **Valid Backend Compilation & Tests**: `go vet ./...` dan `go test ./...` lulus 100%.
- [x] **Mobile Responsiveness**: Tampilan diuji pada lebar 360px, 768px, 1024px, dan desktop tanpa ada overflow horizontal.
- [x] **Safe AI Chatbot Fallback**: Saat server AI tidak dapat dijangkau, chatbot merespons dengan pesan bantuan resmi dan kontak Humas sekolah tanpa memicu error 500.
- [x] **Accessibility (WCAG AA)**: Kontras teks memenuhi standar, seluruh gambar memiliki teks alternatif (`alt`), dan elemen interaktif memiliki focus state yang jelas.
