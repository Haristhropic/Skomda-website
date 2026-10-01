export interface PeranBkkItem {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface PeluangKarierItem {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: "Full Time" | "Internship";
  jurusan: "SIJA" | "TJAT" | "SIJA & TJAT" | (string & {});
  postedDate: string;
  deadline: string;
  salaryRange?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  applyEmail: string;
}

export interface TalentaSkomdaItem {
  id: string;
  name: string;
  role: string;
  major: "SIJA" | "TJAT";
  status: string;
  avatar: string;
  skills: string[];
  portfolioUrl?: string;
  linkedinUrl?: string;
  bio: string;
  achievements: string[];
}

export interface AlumniStoryItem {
  id: string;
  name: string;
  role: string;
  company: string;
  alumniInfo: string;
  quote: string;
  avatar: string;
  story: string;
}

export interface MitraBkkItem {
  name: string;
  logo: string;
  category: string;
}

export const PERAN_BKK_ITEMS: PeranBkkItem[] = [
  {
    id: "peluang",
    number: "01",
    title: "Peluang",
    description: "Temukan informasi lowongan dan kesempatan karier.",
  },
  {
    id: "persiapan",
    number: "02",
    title: "Persiapan",
    description: "Akses pengembangan karier dan kesiapan kerja.",
  },
  {
    id: "koneksi",
    number: "03",
    title: "Koneksi",
    description: "Terhubung dengan alumni dan mitra industri.",
  },
];

export const PELUANG_KARIER_ITEMS: PeluangKarierItem[] = [
  {
    id: "telkom-frontend-dev",
    title: "Frontend Developer",
    company: "PT Telkom Indonesia",
    logo: "/images/partners/logo-telkom-indonesia.jpg",
    location: "Surabaya",
    type: "Full Time",
    jurusan: "SIJA",
    postedDate: "10 September 2026",
    deadline: "30 September 2026",
    salaryRange: "Kompetitif / Standar Industri",
    description:
      "Mengembangkan dan merawat antarmuka aplikasi web modern menggunakan React, Next.js, dan Tailwind CSS dalam ekosistem digital Telkom Group.",
    responsibilities: [
      "Mengembangkan komponen UI web yang responsif, modular, dan berperforma tinggi.",
      "Melakukan integrasi API RESTful dengan tim backend.",
      "Memastikan kepatuhan standar aksesibilitas web dan cross-browser compatibility.",
      "Melakukan pengujian UI dan code review secara berkala.",
    ],
    requirements: [
      "Lulusan SMK Telkom Sidoarjo jurusan SIJA atau siswa tingkat akhir siap kerja.",
      "Menguasai JavaScript / TypeScript, React atau Next.js, dan Tailwind CSS.",
      "Memahami konsep version control Git dan alur kerja kolaboratif.",
      "Memiliki portofolio proyek web yang dapat didemonstrasikan.",
    ],
    applyEmail: "karir@telkom.co.id",
  },
  {
    id: "indosat-network-technician",
    title: "Network Technician",
    company: "PT Indosat Ooredoo Hutchison",
    logo: "/images/partners/Indosat_Ooredoo_logo.svg",
    location: "Sidoarjo",
    type: "Internship",
    jurusan: "TJAT",
    postedDate: "8 September 2026",
    deadline: "25 September 2026",
    salaryRange: "Uang Saku & Transport",
    description:
      "Mendukung operasional instalasi, monitoring jalur transmisi fiber optic, dan pemeliharaan infrastruktur jaringan BTS area Sidoarjo.",
    responsibilities: [
      "Membantu teknisi senior dalam pemeliharaan rutin perangkat jaringan dan BTS.",
      "Melakukan dokumentasi pengukuran kabel fiber optic (OTDR & power meter).",
      "Membantu penanganan gangguan jaringan lapangan secara responsif.",
      "Menyusun laporan teknis berkala hasil inspeksi transmisi.",
    ],
    requirements: [
      "Siswa aktif atau lulusan jurusan TJAT SMK Telkom Sidoarjo.",
      "Memahami dasar transmisi jaringan nirkabel dan fiber optik.",
      "Memiliki ketelitian tinggi dan kemampuan komunikasi kerja lapangan yang baik.",
      "Bersedia mengikuti protokol Keselamatan dan Kesehatan Kerja (K3) industri.",
    ],
    applyEmail: "recruitment@ioh.co.id",
  },
  {
    id: "lintasarta-it-support",
    title: "IT Support",
    company: "PT Aplikanusa Lintasarta",
    logo: "/images/partners/Logo-Lintasarta.png",
    location: "Surabaya",
    type: "Full Time",
    jurusan: "SIJA",
    postedDate: "5 September 2026",
    deadline: "28 September 2026",
    salaryRange: "Kompetitif / Standar Industri",
    description:
      "Memberikan dukungan teknis perangkat keras, sistem operasi, konfigurasi jaringan lokal (LAN/WLAN), dan troubleshooting aplikasi kantor mitra.",
    responsibilities: [
      "Menangani tiket permintaan bantuan teknis IT dari user internal dan klien.",
      "Melakukan instalasi, konfigurasi PC/laptop, printer, dan perangkat jaringan kantor.",
      "Memantau stabilitas koneksi internet dan server lokal.",
      "Mengelola inventaris aset perangkat teknologi informasi.",
    ],
    requirements: [
      "Lulusan SMK Telkom Sidoarjo jurusan SIJA atau TJAT.",
      "Memiliki pemahaman troubleshooting hardware, Windows/Linux, dan routing dasar.",
      "Sikap ramah, komunikatif, dan berorientasi solusi.",
      "Sertifikasi Mikrotik (MTCNA) atau Cisco (CCNA) menjadi nilai tambah.",
    ],
    applyEmail: "career@lintasarta.co.id",
  },
  {
    id: "bdx-cloud-infrastructure",
    title: "Data Center Infrastructure Specialist",
    company: "BDX Data Centers",
    logo: "/images/partners/bdx_data_center.jpg",
    location: "Surabaya",
    type: "Full Time",
    jurusan: "SIJA",
    postedDate: "1 September 2026",
    deadline: "24 September 2026",
    salaryRange: "Kompetitif",
    description:
      "Mengelola fasilitas data center, server virtualisasi, dan pemantauan sistem catu daya serta jaringan berkecepatan tinggi.",
    responsibilities: [
      "Memantau kesehatan lingkungan data center, sistem pendingin, dan rack server.",
      "Membantu konfigurasi routing, switching, dan konektivitas interkoneksi tier 3.",
      "Bekerja sama dengan tim operasional 24/7 dalam mitigasi risiko gangguan.",
    ],
    requirements: [
      "Lulusan SIJA atau TJAT dengan pemahaman kelistrikan IT, server rack, dan fiber optik.",
      "Disiplin, teliti, dan siap bekerja sesuai SOP industri data center global.",
      "Memiliki kemampuan dokumentasi teknis yang rapi.",
    ],
    applyEmail: "careers@bdxworld.com",
  },
  {
    id: "cisco-network-engineer",
    title: "Junior Network Engineer",
    company: "Cisco Systems",
    logo: "/images/partners/logo_cisco.png",
    location: "Surabaya",
    type: "Internship",
    jurusan: "TJAT",
    postedDate: "28 Agustus 2026",
    deadline: "20 September 2026",
    salaryRange: "Uang Saku & Pembinaan",
    description:
      "Mendukung implementasi switching & routing enterprise Cisco, konfigurasi VLAN, dan pengujian throughput jaringan mitra.",
    responsibilities: [
      "Membantu setup awal router dan switch Cisco berbasis IOS.",
      "Melakukan pengujian packet capture dan diagnostik performa jaringan.",
      "Membantu penyusunan diagram topologi jaringan proyek.",
    ],
    requirements: [
      "Siswa aktif atau lulusan jurusan TJAT SMK Telkom Sidoarjo.",
      "Menguasai dasar Cisco Networking Academy (CCNA modules).",
      "Memiliki motivasi tinggi untuk bertumbuh di bidang network engineering.",
    ],
    applyEmail: "recruitment-id@cisco.com",
  },
];

export const TALENTA_SKOMDA_ITEMS: TalentaSkomdaItem[] = [
  {
    id: "nadya-putri",
    name: "Nadya Putri A.",
    role: "UI/UX Designer",
    major: "SIJA",
    status: "SIJA · Alumni 2026",
    avatar: "/images/home/hero/image4.png",
    skills: ["Figma", "UI Design", "Front-End"],
    bio: "Spesialis dalam merancang sistem antarmuka web dan mobile yang user-friendly, interaktif, serta berorientasi pada kemudahan pengguna.",
    achievements: [
      "Juara 1 Lomba Desain Antarmuka Web Pelajar Jawa Timur 2025",
      "Sertifikasi Kompetensi BNSP Junior Graphic & UI Designer",
    ],
  },
  {
    id: "rafii-dwi",
    name: "Rafii Dwi K.",
    role: "Network Engineer",
    major: "TJAT",
    status: "TJAT · Alumni 2025",
    avatar: "/images/home/hero/image1.png",
    skills: ["Network", "Mikrotik", "IT Support"],
    bio: "Fokus pada perancangan infrastruktur jaringan nirkabel, routing Mikrotik/Cisco, dan troubleshooting jaringan berskala enterprise.",
    achievements: [
      "Sertifikasi Internasional MTCNA (MikroTik Certified Network Associate)",
      "Peserta Terbaik Uji Kompetensi Keahlian TJAT Telkom Schools",
    ],
  },
  {
    id: "salsa-nabila",
    name: "Salsa Nabila",
    role: "Web Developer",
    major: "SIJA",
    status: "SIJA · Alumni 2026",
    avatar: "/images/program/profil-jurusan/student-sija.png",
    skills: ["HTML", "CSS", "JavaScript"],
    bio: "Pengembang aplikasi web yang menyukai arsitektur modern TypeScript, React, dan API backend, aktif membangun solusi digital sekolah.",
    achievements: [
      "Finalis Lomba Web Development Vokasi Nasional 2025",
      "Kontributor Inti Proyek Website Teaching Factory SKOMDA",
    ],
  },
];

export const ALUMNI_STORIES_ITEMS: AlumniStoryItem[] = [
  {
    id: "olvan",
    name: "Olvan",
    role: "IT Support Engineer",
    company: "PT Telkom Indonesia",
    alumniInfo: "Alumni TJAT 2024",
    quote:
      "Ilmu dan pengalaman di SKOMDA membantu saya lebih percaya diri saat memasuki dunia kerja industri teknologi informasi.",
    avatar: "/images/home/hero/image1.png",
    story:
      "Selama belajar di jurusan TJAT SMK Telkom Sidoarjo, Olvan aktif dalam praktikum instalasi jaringan dan program bimbingan karier BKK. Melalui jejaring rekrutmen sekolah, Olvan langsung diserap bekerja di unit operasional infrastruktur Telkom Indonesia segera setelah kelulusan.",
  },
  {
    id: "quinnsachi",
    name: "Quinnsachi",
    role: "Cloud DevOps Associate",
    company: "PT Radnet Digital Indonesia",
    alumniInfo: "Alumni SIJA 2023",
    quote:
      "Kurikulum 4 tahun SIJA memberikan kedalaman ilmu coding dan cloud computing yang langsung relevan dengan standar kerja profesional.",
    avatar: "/images/home/hero/image4.png",
    story:
      "Karier Quinnsachi melesat berkat fondasi sertifikasi industri yang diraihnya di sekolah. BKK memfasilitasi masa magang industri yang kemudian bertransisi langsung menjadi tawaran kontrak kerja penuh.",
  },
];

export const MITRA_BKK_LOGOS = [
  { name: "Telkom Indonesia", src: "/images/partners/logo-telkom-indonesia.jpg" },
  { name: "Indosat Ooredoo Hutchison", src: "/images/partners/Indosat_Ooredoo_logo.svg" },
  { name: "PT Aplikanusa Lintasarta", src: "/images/partners/Logo-Lintasarta.png" },
  { name: "BDX Data Centers", src: "/images/partners/bdx_data_center.jpg" },
  { name: "Cisco Systems", src: "/images/partners/logo_cisco.png" },
  { name: "Huawei Technologies", src: "/images/partners/logo_huawei.webp" },
  { name: "MikroTik", src: "/images/partners/logo_mikrotik.png" },
  { name: "ZTE Corporation", src: "/images/partners/logo_zte.webp" },
  { name: "Schneider Electric", src: "/images/partners/logo_schneider.svg" },
];
