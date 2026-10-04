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
    avatar: "/images/program/bkk/clea.webp",
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
    avatar: "/images/program/bkk/adip.webp",
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
    avatar: "/images/program/bkk/jasmine.webp",
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

export const PELUANG_KARIER_EN: Record<
  string,
  {
    titleEn?: string;
    salaryRangeEn?: string;
    postedDateEn?: string;
    deadlineEn?: string;
    descriptionEn?: string;
    responsibilitiesEn?: string[];
    requirementsEn?: string[];
  }
> = {
  "telkom-frontend-dev": {
    titleEn: "Frontend Developer",
    salaryRangeEn: "Competitive / Industry Standard",
    postedDateEn: "September 10, 2026",
    deadlineEn: "September 30, 2026",
    descriptionEn:
      "Develop and maintain modern web application user interfaces using React, Next.js, and Tailwind CSS within the Telkom Group digital ecosystem.",
    responsibilitiesEn: [
      "Develop responsive, modular, and high-performance web UI components.",
      "Integrate RESTful APIs with backend engineering teams.",
      "Ensure web accessibility compliance and cross-browser compatibility.",
      "Perform automated UI testing and peer code reviews regularly.",
    ],
    requirementsEn: [
      "Graduate of SMK Telkom Sidoarjo majoring in SIJA or final-year job-ready student.",
      "Proficient in JavaScript / TypeScript, React or Next.js, and Tailwind CSS.",
      "Understand Git version control and collaborative workflows.",
      "Possess a demonstrable portfolio of web projects.",
    ],
  },
  "indosat-network-technician": {
    titleEn: "Network Technician",
    salaryRangeEn: "Allowance & Transport",
    postedDateEn: "September 8, 2026",
    deadlineEn: "September 25, 2026",
    descriptionEn:
      "Support installation operations, fiber optic transmission link monitoring, and network BTS infrastructure maintenance across the Sidoarjo area.",
    responsibilitiesEn: [
      "Assist senior technicians in routine maintenance of network devices and BTS cells.",
      "Document fiber optic cable measurements (OTDR & optical power meter).",
      "Provide prompt field troubleshooting and network disruption resolution.",
      "Compile technical inspection reports for transmission links.",
    ],
    requirementsEn: [
      "Active student or graduate of TJAT SMK Telkom Sidoarjo.",
      "Understand fundamentals of wireless network transmission and fiber optics.",
      "High attention to detail and good field operational communication.",
      "Willing to comply with industrial Occupational Health and Safety (K3) protocols.",
    ],
  },
  "lintasarta-it-support": {
    titleEn: "IT Support Specialist",
    salaryRangeEn: "Competitive / Industry Standard",
    postedDateEn: "September 5, 2026",
    deadlineEn: "September 28, 2026",
    descriptionEn:
      "Provide technical support for computer hardware, operating systems, local area network (LAN/WLAN) configuration, and enterprise partner application troubleshooting.",
    responsibilitiesEn: [
      "Handle IT technical support requests from internal users and clients.",
      "Perform installation and configuration of PCs/laptops, printers, and office network equipment.",
      "Monitor stability of internet connections and local on-premise servers.",
      "Manage information technology asset inventory.",
    ],
    requirementsEn: [
      "Graduate of SMK Telkom Sidoarjo majoring in SIJA or TJAT.",
      "Solid understanding of hardware troubleshooting, Windows/Linux OS, and basic routing.",
      "Friendly demeanor, communicative, and solutions-driven attitude.",
      "MikroTik (MTCNA) or Cisco (CCNA) certification is an advantage.",
    ],
  },
  "bdx-cloud-infrastructure": {
    titleEn: "Data Center Infrastructure Specialist",
    salaryRangeEn: "Competitive",
    postedDateEn: "September 1, 2026",
    deadlineEn: "September 24, 2026",
    descriptionEn:
      "Manage data center facilities, server virtualization nodes, and monitoring of high-voltage power delivery and ultra-high-speed network backbones.",
    responsibilitiesEn: [
      "Monitor environmental health of data center suites, cooling units, and server racks.",
      "Assist with routing, switching, and Tier-3 interconnection configuration.",
      "Collaborate with 24/7 operations teams to mitigate disruption risks.",
    ],
    requirementsEn: [
      "SIJA or TJAT graduate with knowledge of IT electrical loads, rack servers, and fiber optics.",
      "Disciplined, meticulous, and ready to comply with global data center SOPs.",
      "Strong technical documentation capabilities.",
    ],
  },
  "cisco-network-engineer": {
    titleEn: "Junior Network Engineer",
    salaryRangeEn: "Stipend & Mentorship",
    postedDateEn: "August 28, 2026",
    deadlineEn: "September 20, 2026",
    descriptionEn:
      "Support Cisco enterprise switching & routing deployments, VLAN architecture, and network throughput testing for enterprise partners.",
    responsibilitiesEn: [
      "Assist with initial setup of Cisco IOS routers and switches.",
      "Perform packet capture analysis and network latency diagnostic benchmarks.",
      "Assist in preparing project network topology diagrams.",
    ],
    requirementsEn: [
      "Active student or graduate of TJAT SMK Telkom Sidoarjo.",
      "Master basic Cisco Networking Academy fundamentals (CCNA modules).",
      "High motivation to grow in professional network engineering.",
    ],
  },
};

export function getLocalizedPeluangKarier(
  item: PeluangKarierItem,
  isEn: boolean
): PeluangKarierItem {
  if (!isEn) return item;
  const trans =
    PELUANG_KARIER_EN[item.id] ||
    Object.values(PELUANG_KARIER_EN).find(
      (v) => v.titleEn?.toLowerCase() === item.title.toLowerCase()
    );
  if (!trans) return item;
  return {
    ...item,
    title: trans.titleEn || item.title,
    salaryRange: trans.salaryRangeEn || item.salaryRange,
    postedDate: trans.postedDateEn || item.postedDate,
    deadline: trans.deadlineEn || item.deadline,
    description: trans.descriptionEn || item.description,
    responsibilities: trans.responsibilitiesEn || item.responsibilities,
    requirements: trans.requirementsEn || item.requirements,
  };
}

export const ALUMNI_STORIES_EN: Record<
  string,
  {
    alumniInfoEn: string;
    quoteEn: string;
    storyEn: string;
  }
> = {
  olvan: {
    alumniInfoEn: "TJAT Alumni 2024",
    quoteEn:
      "The knowledge and hands-on experience at SKOMDA gave me confidence when stepping into the information technology industry.",
    storyEn:
      "During his studies in TJAT at SMK Telkom Sidoarjo, Olvan was active in practical network labs and BKK career mentorship. Through the school's recruitment network, Olvan was immediately hired by Telkom Indonesia's infrastructure operations unit upon graduation.",
  },
  quinnsachi: {
    alumniInfoEn: "SIJA Alumni 2023",
    quoteEn:
      "The 4-year SIJA curriculum provided deep coding and cloud computing expertise that aligned directly with professional industry standards.",
    storyEn:
      "Quinnsachi's career accelerated thanks to industry certifications earned at school. BKK facilitated an industrial internship that seamlessly converted into a full-time contract offer.",
  },
};

export function getLocalizedAlumniStory(
  item: AlumniStoryItem,
  isEn: boolean
): AlumniStoryItem {
  if (!isEn) return item;
  const trans = ALUMNI_STORIES_EN[item.id];
  if (!trans) return item;
  return {
    ...item,
    alumniInfo: trans.alumniInfoEn || item.alumniInfo,
    quote: trans.quoteEn || item.quote,
    story: trans.storyEn || item.story,
  };
}
