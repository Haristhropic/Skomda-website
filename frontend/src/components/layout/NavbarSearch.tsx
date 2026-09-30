"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { MOCK_NEWS, NewsItem, getNewsList } from "@/services/news";
import { DOWNLOAD_DOCUMENTS } from "@/components/sections/unduh/UnduhInformasiClient";
import { PRESTASI_LIST } from "@/data/prestasiData";
import { FASILITAS_LIST } from "@/data/fasilitasData";
import { K3_DOCUMENTS } from "@/data/k3Documents";
import { EKSKUL_LIST } from "@/data/ekstrakurikulerData";
import { PELUANG_KARIER_ITEMS } from "@/data/bkkData";
import { kepalaSekolah, wakilKepalaList } from "@/data/teachers";
import alumniData from "@/data/alumni-angkatan-6.json";
import { TEFA_PRODUCTS } from "@/components/sections/tefa/TefaCatalogSection";
import { DTP_SPECIALIZATIONS } from "@/data/dtpData";

/* ──────────────────────── Types ──────────────────────── */
export interface SearchItem {
  id: string;
  title: string;
  description: string;
  href: string;
  category: "Jurusan" | "Halaman" | "Prestasi" | "Fasilitas" | "Ekskul" | "Karier" | "Dokumen" | "Berita" | "Section" | "Info" | "Kelulusan" | "TeFa";
  badge?: string;
  parentPage?: string;
  iconType: "major" | "page" | "section" | "news" | "doc" | "info" | "star" | "hub" | "facility";
  keywords?: string;
}

interface NavbarSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ──────────────────── Static Database ──────────────────── */
const STATIC_PAGES: SearchItem[] = [
  { id: "p-home", title: "Beranda", description: "Halaman utama SMK Telkom Sidoarjo", href: "/", category: "Halaman", iconType: "page" },
  { id: "p-ppdb", title: "PPDB 2026/2027 (Penerimaan Siswa Baru)", description: "Alur pendaftaran online, seleksi, beasiswa, dan syarat masuk", href: "/ppdb", category: "Halaman", iconType: "doc", keywords: "daftar masuk pendaftaran sekolah biaya beasiswa ppdb formulir siswa baru" },
  { id: "p-trial", title: "Virtual Trial Class 2026", description: "Simulasi kelas praktis gratis SIJA & TJAT bersertifikat resmi", href: "/trial-class", category: "Halaman", iconType: "major", keywords: "trial class workshop gratis kursus demo kelas virtual coding robotika" },
  { id: "p-profil", title: "Profil Sekolah", description: "Sejarah, visi misi, dan identitas SKOMDA", href: "/tentang-kami/profil-sekolah", category: "Halaman", iconType: "page" },
  { id: "p-hub", title: "Hub Industri", description: "Kerjasama dan jejaring mitra industri nasional", href: "/tentang-kami/hub-industri", category: "Halaman", iconType: "hub" },
  { id: "p-prestasi", title: "Prestasi Siswa & Sekolah", description: "Koleksi kejuaraan LKS AI, Web Design, SDLC & kompetisi nasional", href: "/tentang-kami/prestasi", category: "Halaman", iconType: "star", keywords: "prestasi juara kejuaraan lomba pemenang award lks amikom binus" },
  { id: "p-fasilitas", title: "Fasilitas & Lab", description: "Laboratorium AI, IoT, fiber optic & sarana belajar modern", href: "/tentang-kami/fasilitas", category: "Halaman", iconType: "facility", keywords: "fasilitas lab sarana kelas rps gedung aula sarpras" },
  { id: "p-guru", title: "Profil Guru & Pendidik", description: "Tenaga pendidik & instruktur bersertifikasi industri", href: "/tentang-kami/profil-guru", category: "Halaman", iconType: "page" },
  { id: "p-akomodasi", title: "Akomodasi & Kos Siswa", description: "Rekomendasi kos, asrama, dan panduan biaya hidup Sidoarjo", href: "/tentang-kami/akomodasi", category: "Halaman", iconType: "page" },
  { id: "p-jurusan", title: "Profil Jurusan", description: "Program keahlian unggulan SIJA & TJAT berstandar industri", href: "/program/profil-jurusan", category: "Halaman", iconType: "major" },
  { id: "p-ekskul", title: "Ekstrakurikuler", description: "Wadah pengembangan minat, bakat, kepemimpinan & olahraga siswa", href: "/program/ekstrakurikuler", category: "Halaman", iconType: "page", keywords: "ekskul ekstrakurikuler futsal basket esport paskibra pramuka musik" },
  { id: "p-dtp", title: "Digital Talent Program (DTP)", description: "Akselerasi keahlian teknologi khusus, 9 spesialisasi, dan startup digital", href: "/program/digital-talent", category: "Halaman", iconType: "star", keywords: "dtp digital talent program spesialisasi kurikulum teknologi sertifikasi software ai cloud iot" },
  { id: "p-ts21", title: "Program TS21 (Telkom Schools 21st Century)", description: "Kerangka pembelajaran abad 21 Telkom Schools: literasi digital, kolaborasi & inovasi", href: "/program/ts21", category: "Halaman", iconType: "page", keywords: "ts21 telkom schools 21st century framework kurikulum karakter vokasi inovasi" },
  { id: "p-bkk", title: "BKK (Bursa Kerja Khusus)", description: "Peluang karier, lowongan kerja, magang & talenta alumni", href: "/program/bkk", category: "Halaman", iconType: "star", keywords: "bkk bursa kerja khusus lowongan karier magang internship alumni rekrutmen kerja loker" },
  { id: "p-berita", title: "Berita & Agenda", description: "Kabar terbaru, prestasi dan kegiatan civitas akademika", href: "/informasi/berita", category: "Halaman", iconType: "news" },
  { id: "p-kelulusan", title: "Pengumuman Kelulusan & Tracer Study", description: "Portal resmi kelulusan siswa, direktori alumni, dan verifikasi SKL", href: "/informasi/pengumuman-kelulusan", category: "Halaman", iconType: "doc", keywords: "kelulusan lulus skl surat keterangan lulus pengumuman alumni angkatan siswa ijazah tracer study verifikasi data kelulusan" },
  { id: "p-k3", title: "Penerapan K3", description: "Keselamatan & Kesehatan Kerja serta 35 dokumen SOP resmi sekolah", href: "/informasi/penerapan-k3", category: "Halaman", iconType: "info", keywords: "k3 keselamatan kerja sop pedoman dokumen regulasi hiradc" },
  { id: "p-tefa", title: "Teaching Factory (TeFa)", description: "Konsep pembelajaran berbasis produksi nyata & kolaborasi industri", href: "/tefa", category: "Halaman", iconType: "page", keywords: "tefa teaching factory produk jasa karya siswa industri kolaborasi produksi" },
  { id: "p-tefa-overview", title: "Overview Teaching Factory (TeFa)", description: "Visi pembelajaran vokasi berbasis standar industri DUDI", href: "/tefa/overview", category: "Halaman", iconType: "page", keywords: "tefa overview profil teaching factory pembelajaran produksi mitra industri dudi" },
  { id: "p-tefa-produk", title: "Katalog Produk & Jasa TeFa", description: "Layanan pembuatan web, software, instalasi fiber optic, dan IT maintenance", href: "/tefa/produk", category: "Halaman", iconType: "hub", keywords: "produk jasa order tefa software website cctv jaringan iot katalog harga pesanan" },
  { id: "p-tefa-request", title: "Layanan Order & Konsultasi TeFa", description: "Formulir permohonan kerjasama proyek industri dan pemesanan jasa", href: "/tefa/request", category: "Halaman", iconType: "hub", keywords: "order request pesanan proyek kerjasama jasa tefa konsultasi form" },
  { id: "p-unduh", title: "Unduh Informasi & Dokumen", description: "Download brosur PPDB, sertifikat akreditasi, dan regulasi resmi", href: "/unduh-informasi", category: "Halaman", iconType: "doc" },
];

const JURUSAN_ITEMS: SearchItem[] = [
  {
    id: "j-sija",
    title: "SIJA (Sistem Informasi Jaringan & Aplikasi)",
    description: "Program 4 Tahun: Software Engineering, Cloud Computing, Cyber Security & IoT",
    href: "/program/profil-jurusan?jurusan=SIJA#kompetensi",
    category: "Jurusan",
    badge: "Program 4 Tahun",
    iconType: "major",
    keywords: "sija software web fullstack cloud aws iot coding pemrograman 4 tahun",
  },
  {
    id: "j-tjat",
    title: "TJAT (Teknik Jaringan Akses Telekomunikasi)",
    description: "Program 3 Tahun: Fiber Optic, Jaringan Nirkabel, Microwave & ISP",
    href: "/program/profil-jurusan?jurusan=TJAT#kompetensi",
    category: "Jurusan",
    badge: "Program 3 Tahun",
    iconType: "major",
    keywords: "tjat fiber optic ftth wireless bts seluler jaringan telekomunikasi 3 tahun",
  },
];

/* ─── Page Section Headings & Subsections ─── */
const PAGE_SECTIONS: SearchItem[] = [
  // Beranda
  {
    id: "sec-sambutan",
    title: "Sambutan Kepala Sekolah",
    description: "Pesan dan visi dari Kepala SMK Telkom Sidoarjo, Abror S.Hum., M.Pd.",
    href: "/#sambutan",
    category: "Section",
    parentPage: "Beranda",
    iconType: "section",
    keywords: "sambutan kepala sekolah kepsek abror pidato pimpinan pesan direktif greeting",
  },
  {
    id: "sec-keunggulan",
    title: "Keunggulan SMK Telkom Sidoarjo",
    description: "6 alasan memilih Skomda: kurikulum industri, sertifikasi internasional & fasilitas modern",
    href: "/#keunggulan",
    category: "Section",
    parentPage: "Beranda",
    iconType: "section",
    keywords: "keunggulan mengapa memilih skomda fasilitas kurikulum prestasi alasan benefit why choose us",
  },
  {
    id: "sec-mitra-home",
    title: "Mitra Industri & Perusahaan Rekanan",
    description: "Jejaring kemitraan Telkom Group, Wowrack, Weza, dan korporasi teknologi",
    href: "/#mitra",
    category: "Section",
    parentPage: "Beranda",
    iconType: "section",
    keywords: "mitra rekanan kerja sama industri telkom wowrack weza dudi marquee partners",
  },
  {
    id: "sec-program-home",
    title: "Program Keahlian Vokasi (SIJA & TJAT)",
    description: "Ringkasan kurikulum program keahlian SIJA (4 tahun) dan TJAT (3 tahun)",
    href: "/#program",
    category: "Section",
    parentPage: "Beranda",
    iconType: "section",
    keywords: "program keahlian jurusan vokasi sija tjat sistem informasi telekomunikasi",
  },
  {
    id: "sec-berita-home",
    title: "Kabar & Berita Terkini",
    description: "Liputan agenda, prestasi siswa, dan pengumuman kegiatan terbaru sekolah",
    href: "/#informasi",
    category: "Section",
    parentPage: "Beranda",
    iconType: "section",
    keywords: "berita informasi kabar terkini agenda artikel pengumuman latest news",
  },

  // PPDB
  {
    id: "sec-alur-ppdb",
    title: "Alur Pendaftaran PPDB 2026/2027",
    description: "4 langkah mudah: Pendaftaran Online, Seleksi TKD & Wawancara, Daftar Ulang, Penerimaan",
    href: "/ppdb#alur-pendaftaran",
    category: "Section",
    parentPage: "PPDB",
    iconType: "section",
    keywords: "alur pendaftaran tahapan registrasi tes seleksi wawancara langkah ppdb",
  },
  {
    id: "sec-jalur-ppdb",
    title: "Jalur Pendaftaran & Beasiswa PPDB",
    description: "Jalur Prestasi Akademik/Non-Akademik, Jalur Rapor, dan Jalur Reguler",
    href: "/ppdb#jalur-masuk",
    category: "Section",
    parentPage: "PPDB",
    iconType: "section",
    keywords: "jalur masuk beasiswa prestasi beasiswa telkom potongan biaya rapor reguler",
  },

  // Profil Sekolah
  {
    id: "sec-visi-misi",
    title: "Visi & Misi Sekolah",
    description: "Visi sekolah vokasi terdepan dan 6 misi pembinaan karakter serta lulusan BMW",
    href: "/tentang-kami/profil-sekolah#visi-misi",
    category: "Section",
    parentPage: "Profil Sekolah",
    iconType: "section",
    keywords: "visi misi tujuan sasaran bmw bekerja melanjutkan wirausaha integritas nilai sekolah",
  },
  {
    id: "sec-akreditasi-profil",
    title: "Akreditasi A UNGGUL (BAN-SM)",
    description: "Peringkat Akreditasi A (Nilai 93) BAN-SM & standar manajemen mutu ISO 21001:2018",
    href: "/tentang-kami/profil-sekolah#akreditasi",
    category: "Section",
    parentPage: "Profil Sekolah",
    iconType: "section",
    keywords: "akreditasi unggul ban-sm nilai 93 mutu iso 21001 sertifikat status kelayakan badan akreditasi",
  },
  {
    id: "sec-struktur-organisasi",
    title: "Struktur Organisasi & Pimpinan",
    description: "Bagan susunan pimpinan sekolah, wakil kepala sekolah, kaprog, dan tata kelola",
    href: "/tentang-kami/profil-sekolah#struktur-organisasi",
    category: "Section",
    parentPage: "Profil Sekolah",
    iconType: "section",
    keywords: "struktur organisasi manajemen pimpinan susunan pengurus waka kaprodi kepsek bagan dewan guru",
  },

  // Hub Industri
  {
    id: "sec-mitra-industri",
    title: "Daftar Mitra Industri & Kerjasama",
    description: "Direktori kemitraan perusahaan PKL/magang, rekrutmen kerja, dan sertifikasi",
    href: "/tentang-kami/hub-industri#mitra-industri",
    category: "Section",
    parentPage: "Hub Industri",
    iconType: "section",
    keywords: "mitra industri daftar mou pkl magang bumn swasta telkom vendor rekrutmen dudi corporate",
  },
  {
    id: "sec-skema-kerjasama",
    title: "Skema Kerjasama Industri",
    description: "Bentuk kemitraan: Prakerin/PKL, Guru Tamu Praktisi, Teaching Factory & Rekrutmen",
    href: "/tentang-kami/hub-industri#skema-kerjasama",
    category: "Section",
    parentPage: "Hub Industri",
    iconType: "section",
    keywords: "skema bentuk program kerjasama guru tamu magang tefa teaching factory kurikulum industri sinkronisasi",
  },

  // Akomodasi
  {
    id: "sec-rekomendasi-kos",
    title: "Rekomendasi Kos & Tempat Tinggal",
    description: "Daftar kos putra, kos putri, dan hunian nyaman di sekitar lingkungan sekolah",
    href: "/tentang-kami/akomodasi#rekomendasi-hunian",
    category: "Section",
    parentPage: "Akomodasi",
    iconType: "section",
    keywords: "kos kost asrama hunian kontrakan putra putri kamar sewa tempat tinggal penginapan boarding",
  },
  {
    id: "sec-biaya-hidup",
    title: "Estimasi Biaya Hidup Sidoarjo",
    description: "Rincian perkiraan pengeluaran makan, sewa tempat tinggal, transport, dan uang saku",
    href: "/tentang-kami/akomodasi#biaya-hidup",
    category: "Section",
    parentPage: "Akomodasi",
    iconType: "section",
    keywords: "biaya hidup pengeluaran estimasi makan kos transport laundry uang saku bulanan tarif living cost",
  },

  // BKK
  {
    id: "sec-bkk-peluang",
    title: "Peluang Karier & Rekrutmen BKK",
    description: "Lowongan kerja eksklusif mitra industri bagi lulusan dan siswa magang SKOMDA",
    href: "/program/bkk#peluang-karier",
    category: "Section",
    parentPage: "BKK",
    iconType: "section",
    keywords: "loker bkk lowongan rekrutmen kerja magang bursa kerja",
  },

  // K3
  {
    id: "sec-k3-dokumen",
    title: "Dokumen & SOP Keselamatan Kerja (K3)",
    description: "Pusat unduhan dan pratinjau 35 dokumen resmi panduan, HIRADC, dan regulasi K3",
    href: "/informasi/penerapan-k3#k3-dokumen-section",
    category: "Section",
    parentPage: "Penerapan K3",
    iconType: "section",
    keywords: "k3 dokumen sop regulasi panduan keselamatan kerja unduh pdf",
  },

  // Pengumuman Kelulusan
  {
    id: "sec-kelulusan-portal",
    title: "Portal Pencarian Kelulusan & SKL Digital",
    description: "Pencarian status kelulusan siswa, penelusuran tamatan (Tracer Study), dan pratinjau SKL",
    href: "/informasi/pengumuman-kelulusan#portal-kelulusan",
    category: "Section",
    parentPage: "Pengumuman Kelulusan",
    iconType: "section",
    keywords: "pencarian kelulusan portal cek skl siswa lulus alumni tracer study surat keterangan lulus",
  },

  // Teaching Factory (TeFa)
  {
    id: "sec-tefa-katalog",
    title: "Katalog Produk & Solusi Digital TeFa",
    description: "Daftar produk website profil, desain UI/UX, instalasi jaringan, dan IT maintenance",
    href: "/tefa/produk",
    category: "Section",
    parentPage: "Teaching Factory",
    iconType: "section",
    keywords: "katalog produk tefa jasa pembuatan website uiux instalasi jaringan it maintenance",
  },
  {
    id: "sec-tefa-request",
    title: "Formulir Pemesanan & Konsultasi Proyek TeFa",
    description: "Ajukan permohonan pengerjaan proyek digital atau instalasi jaringan bersama tim TeFa SKOMDA",
    href: "/tefa/request",
    category: "Section",
    parentPage: "Teaching Factory",
    iconType: "section",
    keywords: "formulir request order jasa proyek tefa konsultasi kerjasama sekolah",
  },
  {
    id: "sec-tefa-skema",
    title: "Konsep & Alur Pembelajaran TeFa",
    description: "Standar alur kerja produksi industri, bimbingan guru praktisi, dan garansi hasil karya",
    href: "/tefa/overview",
    category: "Section",
    parentPage: "Teaching Factory",
    iconType: "section",
    keywords: "konsep tefa alur pembelajaran produksi nyata integrasi kurikulum industri",
  },

  // Digital Talent Program (DTP)
  {
    id: "sec-dtp-spesialisasi",
    title: "9 Bidang Spesialisasi Unggulan DTP",
    description: "Software Developer, UI/UX, AI, Cloud, Cyber Security, Network, IoT, dan Fiber Optic",
    href: "/program/digital-talent#spesialisasi",
    category: "Section",
    parentPage: "Digital Talent Program",
    iconType: "section",
    keywords: "9 spesialisasi dtp software ai cloud cyber network iot fiber optic ui ux",
  },
  {
    id: "sec-dtp-kurikulum",
    title: "Kurikulum & Akselerasi DTP",
    description: "Pembekalan materi intensif berstandar industri dan pembinaan sertifikasi profesional",
    href: "/program/digital-talent#kurikulum",
    category: "Section",
    parentPage: "Digital Talent Program",
    iconType: "section",
    keywords: "kurikulum dtp silabus materi pembelajaran akselerasi sertifikasi internasional",
  },

  // Profil Jurusan
  {
    id: "sec-jurusan-sija",
    title: "Kompetensi Keahlian SIJA (Program 4 Tahun)",
    description: "Spesialisasi rekayasa perangkat lunak, sistem komputasi awan (cloud), dan keamanan siber",
    href: "/program/profil-jurusan?jurusan=SIJA#kompetensi",
    category: "Section",
    parentPage: "Profil Jurusan",
    iconType: "section",
    keywords: "sija 4 tahun kurikulum rpl software cloud cyber kompetensi",
  },
  {
    id: "sec-jurusan-tjat",
    title: "Kompetensi Keahlian TJAT (Program 3 Tahun)",
    description: "Spesialisasi teknik jaringan akses telekomunikasi, serat optik FTTH, dan nirkabel",
    href: "/program/profil-jurusan?jurusan=TJAT#kompetensi",
    category: "Section",
    parentPage: "Profil Jurusan",
    iconType: "section",
    keywords: "tjat 3 tahun fiber optic ftth wireless telekomunikasi jaringan",
  },

  // Profil Guru
  {
    id: "sec-guru-pimpinan",
    title: "Pimpinan & Dewan Tenaga Pendidik",
    description: "Profil Kepala Sekolah, Wakil Kepala Sekolah, dan staf kepemimpinan SKOMDA",
    href: "/tentang-kami/profil-guru#pimpinan",
    category: "Section",
    parentPage: "Profil Guru",
    iconType: "section",
    keywords: "pimpinan kepala sekolah waka kaprog pendidik manajemen guru",
  },
];

const POPULAR_TAGS = [
  "Pengumuman Kelulusan",
  "Cek SKL",
  "Teaching Factory",
  "Katalog TeFa",
  "Digital Talent (DTP)",
  "PPDB 2026",
  "Trial Class",
  "SIJA",
  "TJAT",
  "Prestasi",
  "Lab AI",
  "Lowongan BKK",
  "Dokumen K3",
  "Mitra Industri",
  "Akomodasi Kos",
];

const QUICK_FEATURED_ITEMS: SearchItem[] = [
  {
    id: "q-ppdb",
    title: "PPDB 2026/2027 (Penerimaan Siswa Baru)",
    description: "Alur 4 tahap pendaftaran, seleksi, beasiswa, dan syarat masuk",
    href: "/ppdb",
    category: "Halaman",
    iconType: "doc",
  },
  {
    id: "q-kelulusan",
    title: "Pengumuman Resmi Kelulusan & SKL",
    description: "Pangkalan data kelulusan siswa dan pratinjau Surat Keterangan Lulus (SKL)",
    href: "/informasi/pengumuman-kelulusan",
    category: "Halaman",
    iconType: "doc",
  },
  {
    id: "q-tefa",
    title: "Teaching Factory (Katalog & Jasa)",
    description: "Solusi website profesional, UI/UX, instalasi jaringan, dan IT maintenance",
    href: "/tefa/produk",
    category: "Halaman",
    iconType: "hub",
  },
  {
    id: "q-dtp",
    title: "Digital Talent Program (DTP)",
    description: "9 bidang spesialisasi teknologi unggulan dan akselerasi startup digital",
    href: "/program/digital-talent",
    category: "Halaman",
    iconType: "star",
  },
  {
    id: "q-trial",
    title: "Virtual Trial Class 2026",
    description: "Simulasi kelas praktis gratis SIJA & TJAT bersertifikat resmi",
    href: "/trial-class",
    category: "Halaman",
    iconType: "major",
  },
  {
    id: "q-sija",
    title: "Jurusan SIJA (Program 4 Tahun)",
    description: "Software engineering, cloud architecture, cybersecurity & IoT",
    href: "/program/profil-jurusan?jurusan=SIJA#kompetensi",
    category: "Jurusan",
    iconType: "major",
  },
  {
    id: "q-tjat",
    title: "Jurusan TJAT (Program 3 Tahun)",
    description: "Teknik jaringan fiber optic, wireless microwave & seluler 5G",
    href: "/program/profil-jurusan?jurusan=TJAT#kompetensi",
    category: "Jurusan",
    iconType: "major",
  },
  {
    id: "q-prestasi",
    title: "Prestasi Unggulan Siswa SKOMDA",
    description: "Koleksi kejuaraan LKS AI, Web Design, SDLC & inovasi digital",
    href: "/tentang-kami/prestasi",
    category: "Halaman",
    iconType: "star",
  },
  {
    id: "q-fasilitas",
    title: "Fasilitas & Laboratorium Standar Industri",
    description: "Lab AI & IoT, Fiber Optic FTTH, Smart Classroom, dan Gedung RPS",
    href: "/tentang-kami/fasilitas",
    category: "Halaman",
    iconType: "facility",
  },
  {
    id: "q-bkk",
    title: "BKK & Lowongan Kerja Industri",
    description: "Loker Telkom, Indosat, Wowrack, dan jejaring magang kerja",
    href: "/program/bkk",
    category: "Halaman",
    iconType: "star",
  },
];

/* ──────────────────── Clean Minimalist Icons ──────────────────── */
function ItemIcon({ type }: { type: SearchItem["iconType"] }) {
  const cls = "size-4 text-slate-600 transition-colors";
  switch (type) {
    case "major":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    case "section":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="9" x2="20" y2="9" />
          <line x1="4" y1="15" x2="20" y2="15" />
          <line x1="10" y1="3" x2="8" y2="21" />
          <line x1="16" y1="3" x2="14" y2="21" />
        </svg>
      );
    case "news":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <path d="M18 14h-8" />
          <path d="M15 18h-5" />
          <path d="M10 6h8v4h-8V6Z" />
        </svg>
      );
    case "doc":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      );
    case "star":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      );
    case "facility":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01" /><path d="M16 6h.01" />
          <path d="M8 10h.01" /><path d="M16 10h.01" />
          <path d="M8 14h.01" /><path d="M16 14h.01" />
        </svg>
      );
    case "hub":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case "info":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      );
    case "page":
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      );
  }
}

/* ──────────────────── Component ──────────────────── */
export default function NavbarSearch({ isOpen, onClose }: NavbarSearchProps) {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const [liveNews, setLiveNews] = useState<NewsItem[]>(MOCK_NEWS);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch live news from backend when search modal is opened
  useEffect(() => {
    if (isOpen) {
      getNewsList()
        .then((items) => {
          if (items && items.length > 0) {
            setLiveNews(items);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Combine full dataset across all school domains
  const dataset = useMemo<SearchItem[]>(() => {
    // 1. Prestasi Siswa
    const prestasiItems: SearchItem[] = PRESTASI_LIST.map((p): SearchItem => ({
      id: `prestasi-${p.id}`,
      title: `${p.award}: ${p.title}`,
      description: `${p.competition} (${p.organizer}) • Siswa: ${p.studentName} (${p.studentClass})`,
      href: `/tentang-kami/prestasi#daftar-prestasi`,
      category: "Prestasi",
      badge: p.badgeLevel,
      iconType: "star",
      keywords: `${p.studentName} ${p.studentClass} ${p.competition} ${p.organizer} ${p.award} ${p.category} ${p.year} juara pemenang lomba kejuaraan`,
    }));

    // 2. Fasilitas Sekolah
    const fasilitasItems: SearchItem[] = FASILITAS_LIST.map((f): SearchItem => ({
      id: `fasilitas-${f.id}`,
      title: f.name,
      description: f.description,
      href: `/tentang-kami/fasilitas#daftar-fasilitas`,
      category: "Fasilitas",
      badge: f.category,
      iconType: "facility",
      keywords: `${f.specs ? f.specs.join(" ") : ""} lab sarana prasarana gedung ruangan kampus`,
    }));

    // 3. Dokumen K3 Resmi
    const k3Items: SearchItem[] = K3_DOCUMENTS.map((k): SearchItem => ({
      id: `k3-${k.id}`,
      title: k.title,
      description: `${k.category} • Dokumen Resmi Format ${k.format} (${k.fileSize})`,
      href: `/informasi/penerapan-k3#k3-dokumen-section`,
      category: "Dokumen",
      badge: "K3 SKOMDA",
      iconType: "doc",
      keywords: `k3 keselamatan kerja kesehatan sop regulasi pedoman hiradc ${k.category}`,
    }));

    // 4. Ekstrakurikuler
    const ekskulItems: SearchItem[] = EKSKUL_LIST.map((e): SearchItem => ({
      id: `ekskul-${e.id}`,
      title: `Ekstrakurikuler ${e.name}`,
      description: e.description,
      href: `/program/ekstrakurikuler#daftar-ekskul`,
      category: "Ekskul",
      badge: e.category,
      iconType: "star",
      keywords: `ekskul ekstrakurikuler minat bakat organisasi ${e.name} ${e.category}`,
    }));

    // 5. Lowongan & Peluang Karier BKK
    const karierItems: SearchItem[] = PELUANG_KARIER_ITEMS.map((c): SearchItem => ({
      id: `karier-${c.id}`,
      title: `${c.title} - ${c.company}`,
      description: `${c.type} (${c.jurusan}) • Lokasi: ${c.location} • Batas: ${c.deadline}`,
      href: `/program/bkk#peluang-karier`,
      category: "Karier",
      badge: c.type,
      iconType: "hub",
      keywords: `loker lowongan kerja magang internship rekrutmen bkk ${c.title} ${c.company} ${c.jurusan} ${c.location}`,
    }));

    // 6. Berita & Agenda
    const newsItems: SearchItem[] = liveNews.map((n): SearchItem => ({
      id: `news-${n.slug}`,
      title: n.title,
      description: n.summary || `Kategori: ${n.category}`,
      href: `/berita/${n.slug}`,
      category: "Berita",
      badge: n.category,
      iconType: "news",
      keywords: `berita kabar informasi artikel pengumuman ${n.category} ${n.author || ""}`,
    }));

    // 7. Dokumen Unduh Informasi
    const docItems: SearchItem[] = DOWNLOAD_DOCUMENTS.map((d): SearchItem => ({
      id: `doc-${d.id}`,
      title: d.title,
      description: d.description,
      href: "/unduh-informasi",
      category: "Dokumen",
      badge: d.category,
      iconType: "doc",
    }));

    // 8. Guru & Pimpinan
    const guruItems: SearchItem[] = [
      {
        id: "guru-abror",
        title: `${kepalaSekolah.name} (${kepalaSekolah.title})`,
        description: kepalaSekolah.bio,
        href: "/tentang-kami/profil-guru",
        category: "Halaman",
        badge: "Kepala Sekolah",
        iconType: "page",
        keywords: "kepala sekolah kepsek pimpinan abror profil guru manajemen",
      },
      ...wakilKepalaList.slice(0, 4).map((w, idx): SearchItem => ({
        id: `guru-waka-${idx}`,
        title: `${w.name} - ${w.role}`,
        description: `Tenaga Pendidik & Manajemen SMK Telkom Sidoarjo (${w.role})`,
        href: "/tentang-kami/profil-guru",
        category: "Halaman",
        badge: w.role,
        iconType: "page",
        keywords: `guru waka wakil kepala sekolah pimpinan pendidik ${w.name} ${w.role}`,
      })),
    ];

    // 9. Quick Info PPDB & Sertifikasi
    const quickInfo: SearchItem[] = [
      { id: "i-ppdb", title: "Brosur PPDB 2026/2027", description: "Alur pendaftaran, biaya, beasiswa dan persyaratan siswa baru", href: "/unduh-informasi", category: "Info", badge: "PPDB", iconType: "info", keywords: "daftar masuk pendaftaran sekolah biaya brosur" },
      { id: "i-akreditasi", title: "Akreditasi A Unggul", description: "Sertifikasi BAN-SM nilai tertinggi sekolah vokasi (93)", href: "/unduh-informasi", category: "Info", badge: "Akreditasi", iconType: "info", keywords: "status sertifikat nilai unggul" },
      { id: "i-sertifikasi", title: "Sertifikasi Industri (Cisco, BNSP, AWS, MikroTik)", description: "Uji kompetensi internasional siap kerja di industri global", href: "/program/profil-jurusan#keunggulan-sertifikasi", category: "Info", badge: "Sertifikasi", iconType: "info", keywords: "lisensi keahlian sertifikasi dudi" },
    ];

    // 10. Alumni Kelulusan Siswa (255 Siswa Resmi)
    const alumniItems: SearchItem[] = alumniData.map((a): SearchItem => ({
      id: `alumni-${a.id}`,
      title: a.name,
      description: `${a.statusKelulusan} • ${a.keterangan || "Lulusan Resmi"} (T.A. ${a.tahunAjaran})`,
      href: `/informasi/pengumuman-kelulusan?q=${encodeURIComponent(a.name)}#portal-kelulusan`,
      category: "Kelulusan",
      badge: a.kategori,
      iconType: "doc",
      keywords: `${a.name} ${a.nisn} ${a.kategori} ${a.statusAktivitas} ${a.keterangan} ${a.institusi || ""} ${a.jurusan || ""} kelulusan lulus skl alumni angkatan 6 siswa`,
    }));

    // 11. Teaching Factory (TeFa) Products & Services
    const tefaItems: SearchItem[] = TEFA_PRODUCTS.map((p): SearchItem => ({
      id: `tefa-prod-${p.id}`,
      title: `${p.title} (TeFa)`,
      description: `${p.category} • ${p.desc} • ${p.majorBadge || "Karya Siswa"}`,
      href: `/tefa/produk`,
      category: "TeFa",
      badge: p.category,
      iconType: "hub",
      keywords: `tefa teaching factory produk jasa layanan order pesanan ${p.title} ${p.category} ${p.desc} ${(p.features || []).join(" ")}`,
    }));

    // 12. DTP 9 Bidang Spesialisasi
    const dtpItems: SearchItem[] = DTP_SPECIALIZATIONS.map((d): SearchItem => ({
      id: `dtp-spec-${d.id}`,
      title: `DTP: ${d.title}`,
      description: `${d.category} • ${d.shortDesc}`,
      href: `/program/digital-talent#spesialisasi`,
      category: "Jurusan",
      badge: `DTP ${d.number}`,
      iconType: "star",
      keywords: `dtp digital talent program spesialisasi ${d.title} ${d.category} ${d.coreSkills.join(" ")} ${d.tools.join(" ")}`,
    }));

    return [
      ...JURUSAN_ITEMS,
      ...dtpItems,
      ...STATIC_PAGES,
      ...tefaItems,
      ...alumniItems,
      ...prestasiItems,
      ...fasilitasItems,
      ...PAGE_SECTIONS,
      ...karierItems,
      ...ekskulItems,
      ...k3Items,
      ...docItems,
      ...newsItems,
      ...guruItems,
      ...quickInfo,
    ];
  }, [liveNews]);

  // Filter with smart scoring
  const filteredResults = useMemo<SearchItem[]>(() => {
    if (!query.trim()) return [];

    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 0);

    return dataset
      .map((item) => {
        const titleLower = item.title.toLowerCase();
        const descLower = item.description.toLowerCase();
        const catLower = item.category.toLowerCase();
        const parentLower = (item.parentPage || "").toLowerCase();
        const kwLower = (item.keywords || "").toLowerCase();
        const badgeLower = (item.badge || "").toLowerCase();
        let score = 0;

        for (const t of terms) {
          if (titleLower.includes(t)) {
            score += 8;
            if (titleLower.startsWith(t)) score += 4;
          } else if (kwLower.includes(t)) {
            score += 5;
          } else if (parentLower.includes(t)) {
            score += 4;
          } else if (badgeLower.includes(t)) {
            score += 3;
          } else if (descLower.includes(t)) {
            score += 2;
          } else if (catLower.includes(t)) {
            score += 1;
          } else {
            return { item, score: -1 };
          }
        }
        return { item, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item)
      .slice(0, 24);
  }, [query, dataset]);

  // Group filtered results logically
  const groupedResults = useMemo(() => {
    const order = ["Jurusan", "Kelulusan", "TeFa", "Prestasi", "Fasilitas", "Ekskul", "Karier", "Halaman", "Dokumen", "Berita", "Section", "Info"];
    const map = new Map<string, SearchItem[]>();
    
    for (const cat of order) {
      const matched = filteredResults.filter((r) => r.category === cat);
      if (matched.length > 0) {
        let label = cat;
        if (cat === "Jurusan") label = lang === "EN" ? "Majors & Programs" : "Jurusan & Keahlian";
        else if (cat === "Kelulusan") label = lang === "EN" ? "Graduation & Alumni" : "Pengumuman Kelulusan & Alumni";
        else if (cat === "TeFa") label = lang === "EN" ? "Teaching Factory (Products & Services)" : "Teaching Factory (Produk & Jasa)";
        else if (cat === "Prestasi") label = lang === "EN" ? "Student Achievements" : "Prestasi Siswa";
        else if (cat === "Fasilitas") label = lang === "EN" ? "Campus Facilities" : "Fasilitas & Sarana";
        else if (cat === "Ekskul") label = lang === "EN" ? "Extracurriculars" : "Ekstrakurikuler";
        else if (cat === "Karier") label = lang === "EN" ? "Career & BKK Jobs" : "Peluang Karier & BKK";
        else if (cat === "Dokumen") label = lang === "EN" ? "Official Documents & K3" : "Dokumen & Panduan K3";
        else if (cat === "Halaman") label = lang === "EN" ? "Pages" : "Halaman";
        else if (cat === "Berita") label = lang === "EN" ? "News & Updates" : "Berita & Agenda";
        else if (cat === "Section") label = lang === "EN" ? "Page Sections" : "Bagian Halaman (Section)";
        else if (cat === "Info") label = lang === "EN" ? "Information" : "Informasi Cepat";
        map.set(label, matched);
      }
    }
    return map;
  }, [filteredResults, lang]);

  // Focus on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleSelect = useCallback(
    (href: string) => {
      onClose();

      if (typeof window !== "undefined" && href.includes("#")) {
        const [targetPath, hash] = href.split("#");
        const currentPath = window.location.pathname;
        const isCurrentPage =
          targetPath === "" ||
          targetPath === currentPath ||
          (targetPath === "/" && currentPath === "/");

        if (isCurrentPage && hash) {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            window.history.pushState(null, "", href);
            return;
          }
        }
      }

      router.push(href);
    },
    [onClose, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentList = query.trim() ? filteredResults : QUICK_FEATURED_ITEMS;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, currentList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentList[selectedIndex]) {
        handleSelect(currentList[selectedIndex].href);
      }
    }
  };

  let counter = -1;

  return (
    <>
      {/* Solid Dark Backdrop Dimmer */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="search-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={onClose}
                className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[45] pointer-events-auto cursor-pointer"
              />
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Inline Expanded Search Header Bar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="search-bar-header"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3, transition: { duration: 0.15, ease: "easeIn" } }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 px-4 sm:px-7 flex items-center w-full h-full gap-3 bg-white rounded-full z-20"
          >
            {/* Search Icon */}
            <div className="flex items-center justify-center shrink-0 text-slate-400 pl-0.5">
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={t("searchModal.inputPlaceholder", "Cari siswa, kelulusan, SKL, TeFa, prestasi, PPDB, jurusan...")}
              className="flex-1 bg-transparent font-jakarta text-[14px] sm:text-[15px] font-semibold text-slate-900 placeholder-slate-400 outline-none min-w-0"
              autoComplete="off"
              spellCheck={false}
            />

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="size-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Hapus teks"
                >
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="btn-secondary !h-[34px] !min-h-[34px] !px-3.5 sm:!px-4 !text-xs !font-bold cursor-pointer"
              >
                {t("searchModal.closeHint", "Tutup")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results & Quick Access Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="search-dropdown-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.15, ease: "easeIn" } }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-[calc(100%+10px)] w-full bg-white rounded-3xl p-2 shadow-[0px_20px_50px_-12px_rgba(0,0,0,0.18)] border border-slate-200/90 z-[55] pointer-events-auto overflow-hidden"
            style={{ backgroundColor: "#ffffff" }}
          >
            {/* Inner Scroll Container */}
            <div className="max-h-[68vh] overflow-y-auto custom-scrollbar p-3 sm:p-4 flex flex-col gap-4">
              {/* Default State: Clean Quick Access Menu */}
              {!query.trim() ? (
                <div className="flex flex-col gap-4">
                  {/* Popular Search Tags */}
                  <div>
                    <p className="font-jakarta text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
                      {t("searchModal.popularSearches", "Pencarian Populer")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setQuery(tag);
                            inputRef.current?.focus();
                          }}
                          className="btn-secondary !h-[32px] !min-h-[32px] !px-3 !py-1 !text-xs !font-semibold cursor-pointer"
                        >
                          <svg className="size-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                          <span>{tag}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clean List Quick Access Links */}
                  <div>
                    <p className="font-jakarta text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                      {lang === "EN" ? "Quick Access Pages & Programs" : "Akses Cepat Halaman & Program"}
                    </p>
                    <div className="flex flex-col gap-1">
                      {QUICK_FEATURED_ITEMS.map((item, idx) => {
                        const isSelected = idx === selectedIndex;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelect(item.href)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-left transition-all cursor-pointer ${isSelected
                                ? "bg-slate-100/90 text-slate-900"
                                : "bg-white hover:bg-slate-50 text-slate-700"
                              }`}
                          >
                            <div
                              className={`size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected
                                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                                  : "bg-slate-100/80 border border-slate-200/50 text-slate-600"
                                }`}
                            >
                              <ItemIcon type={item.iconType} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <span
                                className={`font-jakarta text-sm font-bold truncate block transition-colors ${isSelected ? "text-[#bc0c11]" : "text-slate-900"
                                  }`}
                              >
                                {item.title}
                              </span>
                              <p className="font-jakarta text-xs text-slate-500 truncate mt-0.5">
                                {item.description}
                              </p>
                            </div>

                            <svg
                              className={`size-4 shrink-0 transition-transform ${isSelected ? "text-slate-700 translate-x-1" : "text-slate-300 opacity-0"
                                }`}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : filteredResults.length > 0 ? (
                /* Search Results State */
                <div className="flex flex-col gap-3.5">
                  {Array.from(groupedResults.entries()).map(([category, items]) => (
                    <div key={category} className="flex flex-col">
                      <div className="px-2 pt-1 pb-1.5 flex items-center justify-between">
                        <span className="font-jakarta text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {category}
                        </span>
                        <span className="font-jakarta text-[11px] font-medium text-slate-400">
                          {items.length} hasil
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        {items.map((item) => {
                          counter++;
                          const idx = counter;
                          const isSelected = idx === selectedIndex;

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleSelect(item.href)}
                              onMouseEnter={() => setSelectedIndex(idx)}
                              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-left transition-all cursor-pointer ${isSelected
                                  ? "bg-slate-100/90 text-slate-900"
                                  : "bg-white hover:bg-slate-50 text-slate-700"
                                }`}
                            >
                              <div
                                className={`size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected
                                    ? "bg-white text-[#bc0c11] shadow-xs border border-slate-200"
                                    : "bg-slate-100/80 border border-slate-200/50 text-slate-600"
                                  }`}
                              >
                                <ItemIcon type={item.iconType} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <span
                                  className={`font-jakarta text-sm font-bold truncate block transition-colors ${isSelected ? "text-[#bc0c11]" : "text-slate-900"
                                    }`}
                                >
                                  {item.title}
                                </span>
                                <p className="font-jakarta text-xs text-slate-500 truncate mt-0.5">
                                  {item.description}
                                </p>
                              </div>

                              <svg
                                className={`size-4 shrink-0 transition-transform ${isSelected ? "text-[#bc0c11] translate-x-1" : "text-slate-300 opacity-0"
                                  }`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty Result State */
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="size-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                    <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <p className="font-jakarta text-sm font-bold text-slate-900">
                    {lang === "EN" ? `No results for "${query}"` : `Tidak ada hasil untuk "${query}"`}
                  </p>
                  <p className="font-jakarta text-xs text-slate-500 mt-1">
                    {lang === "EN"
                      ? "Try keywords like 'Graduation', 'SKL', 'TeFa', 'PPDB', 'LKS AI', 'SIJA', or 'BKK'"
                      : "Coba kata kunci seperti 'Kelulusan', 'SKL', 'Ahmad', 'TeFa', 'PPDB', 'SIJA', atau 'BKK'"}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
