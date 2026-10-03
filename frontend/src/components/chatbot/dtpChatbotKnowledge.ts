export interface ChatSource {
  title: string;
  url: string;
  category?: string;
  score?: number;
}

/**
 * Checks if the user message is inquiring about DTP (Digital Talent Program) or its specializations.
 */
export function isDtpQuery(query: string): boolean {
  const lower = query.toLowerCase().trim();

  // Exact or word boundary matches for DTP
  if (/\bdtp\b/i.test(lower)) return true;

  // Digital Talent phrase matches
  if (lower.includes("digital talent") || lower.includes("digital talent program")) {
    return true;
  }

  // Common variations asking for 9 specializations / tracks in Skomda
  if (
    (lower.includes("9") || lower.includes("sembilan")) &&
    (lower.includes("spesialisasi") || lower.includes("peminatan") || lower.includes("keahlian") || lower.includes("track"))
  ) {
    return true;
  }

  // Spesialisasi questions in context of school program
  if (
    lower.includes("spesialisasi") &&
    (lower.includes("program") || lower.includes("skomda") || lower.includes("telkom") || lower.includes("sekolah"))
  ) {
    return true;
  }

  return false;
}

export const DTP_SOURCES_ID: ChatSource[] = [
  {
    title: "Digital Talent Program (DTP) - 9 Spesialisasi Industri",
    url: "/program/digital-talent",
    category: "Program Unggulan",
    score: 0.98,
  },
  {
    title: "Kurikulum & Sertifikasi Internasional DTP",
    url: "/program/digital-talent#kurikulum",
    category: "Sertifikasi",
    score: 0.92,
  },
];

export const DTP_SOURCES_EN: ChatSource[] = [
  {
    title: "Digital Talent Program (DTP) - 9 Industry Specializations",
    url: "/program/digital-talent",
    category: "Featured Program",
    score: 0.98,
  },
  {
    title: "DTP Curriculum & International Certifications",
    url: "/program/digital-talent#kurikulum",
    category: "Certifications",
    score: 0.92,
  },
];

export const DTP_RESPONSE_ID = `### Digital Talent Program (DTP) SMK Telkom Sidoarjo

**Digital Talent Program (DTP)** adalah program unggulan dan inisiatif strategis di SMK Telkom Sidoarjo yang dirancang untuk membekali siswa dengan kompetensi teknologi digital mutakhir berstandar industri global serta sertifikasi internasional resmi.

Melalui DTP, siswa tidak hanya belajar teori di kelas, tetapi juga langsung mempraktikkan keahliannya melalui project nyata (*Project-Based Learning*), inkubasi karya digital, dan pendampingan intensif dari mentor praktisi industri.

Di SMK Telkom Sidoarjo, terdapat **9 Pilihan Spesialisasi / Peminatan DTP**:

1. **Software Developer** (*Kategori: Software & AI*)
   Fokus pada pembuatan website dan aplikasi modern: perancangan database terstruktur, arsitektur RESTful API, penguasaan framework modern (Laravel, React, Node.js), hingga deployment aplikasi berbasis container (Docker & Linux Server).

2. **Network System Administrator** (*Kategori: Network & Cloud*)
   Pengelolaan dan pemeliharaan server fisik maupun virtual (Linux Server, Windows Server, Proxmox, VMware) agar operasional sistem enterprise berjalan aman, stabil, dan memiliki ketersediaan tinggi (*high availability*).

3. **Network Infrastructure Engineer** (*Kategori: Network & Cloud*)
   Pembangunan dan pengelolaan infrastruktur jaringan telekomunikasi berkecepatan tinggi: terminasi & penyambungan kabel fiber optic (*splicing*), pengukuran OTDR, konfigurasi perangkat OLT/ONT, serta routing & switching MikroTik.

4. **Visual Communication Designer** (*Kategori: Design & Creative*)
   Eksplorasi komunikasi visual terpadu: perancangan identitas brand, desain antarmuka pengguna (UI/UX Design & interactive prototyping Figma), motion graphics, videografi & fotografi profesional, serta produksi konten digital kreatif.

5. **Internet of Things (IoT) Engineer** (*Kategori: Hardware & Security*)
   Integrasi perangkat keras dan internet: pemrograman mikrokontroler (ESP32 / MicroPython), sensor cerdas dan aktuator industri, komunikasi data protokol IoT (MQTT & HTTP), serta dashboard monitoring real-time.

6. **Cloud Engineer** (*Kategori: Network & Cloud*)
   Penyusunan dan pengelolaan arsitektur cloud computing (AWS, Google Cloud Platform, Microsoft Azure): virtualisasi, containerization Docker, otomasi pipeline CI/CD (GitHub Actions), dan sistem observabilitas/monitoring server.

7. **Artificial Intelligence (AI) Specialist** (*Kategori: Software & AI*)
   Pengembangan kecerdasan buatan terapan: pemrograman Python untuk data & AI, analisis data (EDA), Machine Learning, Deep Learning, Natural Language Processing (NLP), Computer Vision, serta implementasi model AI siap pakai untuk kebutuhan industri.

8. **Digital Marketing Specialist** (*Kategori: Design & Creative*)
   Strategi pemasaran digital komprehensif: riset pasar dan buyer persona, creative copywriting, optimasi mesin pencari (SEO & SEM Google Ads), periklanan berbayar media sosial (Meta Ads Manager), dan analitik performa konversi.

9. **Cyber Security Specialist** (*Kategori: Hardware & Security*)
   Keamanan sistem informasi dan infrastruktur data: identifikasi kerentanan (*vulnerability assessment*), pengujian penetrasi keamanan (*penetration testing* web & network), pertahanan jaringan, ethical hacking, serta pemahaman fondasi Security Operations Center (SOC).

---

**Dukungan Sertifikasi Internasional & Industri:**
Siswa DTP dipersiapkan untuk meraih sertifikasi keahlian berstandar global yang diakui industri:
- **Cisco Certified** (CCNA & CCST Networking / CyberOps)
- **AWS Certified** (AWS Cloud Practitioner & Architecting via AWS Academy)
- **MikroTik Certified** (MTCNA: MikroTik Certified Network Associate)
- **Oracle Academy** (Java & Database Foundations)
- **Sertifikasi Kompetensi BNSP**

Pelajari silabus lengkap, portofolio karya, dan prospek karir di halaman resmi [Digital Talent Program](/program/digital-talent).`;

export const DTP_RESPONSE_EN = `### Digital Talent Program (DTP) at SMK Telkom Sidoarjo

**Digital Talent Program (DTP)** is a flagship initiative and strategic program at SMK Telkom Sidoarjo designed to equip students with cutting-edge digital technology competencies aligned with global industry standards and official international certifications.

Through DTP, students gain practical experience through project-based learning, startup incubation, and direct mentoring from industry professionals.

At SMK Telkom Sidoarjo, there are **9 DTP Specializations**:

1. **Software Developer** (*Category: Software & AI*)
   Focuses on modern web and application development: structured database design, RESTful API architecture, modern framework mastery (Laravel, React, Node.js), and container-based deployment (Docker & Linux Server).

2. **Network System Administrator** (*Category: Network & Cloud*)
   Enterprise physical and virtual server management (Linux, Windows Server, Proxmox, VMware) ensuring secure, stable, and high-availability operations.

3. **Network Infrastructure Engineer** (*Category: Network & Cloud*)
   High-speed telecommunication network infrastructure: fiber optic splicing and OTDR testing, OLT/ONT device configuration, and MikroTik routing/switching.

4. **Visual Communication Designer** (*Category: Design & Creative*)
   Integrated visual communications: brand identity design, UI/UX prototyping in Figma, motion graphics, professional photography & videography, and creative digital media.

5. **Internet of Things (IoT) Engineer** (*Category: Hardware & Security*)
   Hardware and internet integration: microcontroller programming (ESP32 / MicroPython), industrial sensors & actuators, IoT protocols (MQTT & HTTP), and real-time monitoring dashboards.

6. **Cloud Engineer** (*Category: Network & Cloud*)
   Cloud infrastructure architecture (AWS, Google Cloud Platform, Microsoft Azure): virtualization, Docker container management, CI/CD pipeline automation (GitHub Actions), and server observability.

7. **Artificial Intelligence (AI) Specialist** (*Category: Software & AI*)
   Applied artificial intelligence: Python for data & AI, Exploratory Data Analysis (EDA), Machine Learning, Deep Learning, Natural Language Processing (NLP), Computer Vision, and production AI model deployment.

8. **Digital Marketing Specialist** (*Category: Design & Creative*)
   Comprehensive digital marketing strategies: market research & buyer personas, creative copywriting, SEO/SEM (Google Ads), social media performance advertising (Meta Ads Manager), and conversion analytics.

9. **Cyber Security Specialist** (*Category: Hardware & Security*)
   Information systems and data defense: vulnerability assessments, web and network penetration testing, network hardening, ethical hacking, and Security Operations Center (SOC) fundamentals.

---

**Industry & International Certifications:**
DTP students are prepared for globally recognized certifications:
- **Cisco Certified** (CCNA & CCST Networking / CyberOps)
- **AWS Certified** (AWS Cloud Practitioner & Architecting via AWS Academy)
- **MikroTik Certified** (MTCNA: MikroTik Certified Network Associate)
- **Oracle Academy** (Java & Database Foundations)
- **BNSP Professional Certification**

Explore the full curriculum, project portfolios, and career pathways on our official [Digital Talent Program](/program/digital-talent) page.`;

export function getDtpChatbotResponse(isEn: boolean) {
  return {
    content: isEn ? DTP_RESPONSE_EN : DTP_RESPONSE_ID,
    sources: isEn ? DTP_SOURCES_EN : DTP_SOURCES_ID,
  };
}

interface TopicSuggestion {
  keywords: string[];
  id: string[];
  en: string[];
}

const TOPIC_SUGGESTIONS: TopicSuggestion[] = [
  {
    keywords: ["dtp", "digital talent", "spesialisasi", "peminatan", "software", "cyber", "cloud", "iot", "designer", "specialist"],
    id: [
      "Apa saja 9 spesialisasi di Digital Talent Program?",
      "Sertifikasi industri apa saja yang didapat siswa DTP?",
      "Bagaimana peluang magang dan prospek karir lulusan DTP?",
    ],
    en: [
      "What are the 9 specializations in the Digital Talent Program?",
      "What international certifications do DTP students earn?",
      "What are the internship and career prospects for DTP graduates?",
    ],
  },
  {
    keywords: ["sija", "rekayasa", "aplikasi", "komputer", "programming", "coding", "developer"],
    id: [
      "Apa keunggulan program SIJA 4 tahun dibanding SMK biasa?",
      "Teknologi dan bahasa pemrograman apa yang dipelajari di SIJA?",
      "Berapa biaya pendaftaran PPDB untuk jurusan SIJA?",
    ],
    en: [
      "What are the advantages of the 4-year SIJA program?",
      "What programming languages and tech stacks are taught in SIJA?",
      "What are the admission fees for the SIJA major?",
    ],
  },
  {
    keywords: ["tjat", "telekomunikasi", "fiber", "jaringan", "transmisi", "akses", "optik", "wireless"],
    id: [
      "Apa perbedaan utama jurusan TJAT dan SIJA?",
      "Sertifikasi keahlian apa yang diperoleh di jurusan TJAT?",
      "Bagaimana prospek kerja lulusan TJAT di industri telekomunikasi?",
    ],
    en: [
      "What is the key difference between TJAT and SIJA?",
      "What professional certifications are earned in TJAT?",
      "What are the career prospects for TJAT graduates in telecom?",
    ],
  },
  {
    keywords: ["ppdb", "daftar", "pendaftaran", "syarat", "biaya", "spp", "gelombang", "tes", "jadwal"],
    id: [
      "Apa saja persyaratan berkas untuk mendaftar PPDB 2026/2027?",
      "Berapa rincian biaya pendaftaran dan SPP di SMK Telkom Sidoarjo?",
      "Bagaimana tahapan tes seleksi dan jalur prestasi PPDB?",
    ],
    en: [
      "What are the document requirements for PPDB 2026/2027?",
      "What is the breakdown of admission fees and tuition?",
      "How do the selection test and merit admission pathways work?",
    ],
  },
  {
    keywords: ["bmw", "bekerja", "kuliah", "melanjutkan", "wirausaha", "karir", "alumni", "lulusan"],
    id: [
      "Bagaimana sekolah menyalurkan lulusan yang ingin langsung bekerja?",
      "Kampus PTN/PTS mana saja yang menjadi mitra jalur kuliah?",
      "Bagaimana program pembinaan wirausaha siswa di Skomda?",
    ],
    en: [
      "How does the school place graduates who want to work immediately?",
      "Which universities partner with Skomda for higher education?",
      "How does the school mentor student entrepreneurs?",
    ],
  },
  {
    keywords: ["kos", "kost", "asrama", "tinggal", "biaya hidup", "makan", "luar kota", "lokasi", "alamat"],
    id: [
      "Berapa estimasi biaya sewa kos dan makan per bulan di sekitar sekolah?",
      "Apakah ada rekomendasi kos putra/putri yang dekat dan aman?",
      "Bagaimana akses transportasi umum dari kos ke kampus Skomda?",
    ],
    en: [
      "What is the estimated monthly cost for boarding and meals near school?",
      "Are there safe boarding recommendations for students near campus?",
      "What public transit options are available to the school?",
    ],
  },
  {
    keywords: ["fasilitas", "lab", "gedung", "ekskul", "ekstrakurikuler", "prestasi", "sarana"],
    id: [
      "Fasilitas lab teknologi apa saja yang ada di SMK Telkom Sidoarjo?",
      "Apa saja pilihan ekstrakurikuler bidang IT dan non-IT di Skomda?",
      "Prestasi membanggakan apa saja yang diraih siswa Skomda?",
    ],
    en: [
      "What technology lab facilities exist at SMK Telkom Sidoarjo?",
      "What IT and non-IT extracurricular clubs can students join?",
      "What notable achievements have Skomda students earned?",
    ],
  },
];

const DEFAULT_POOL_ID = [
  "Apa saja pilar Program BMW di SMK Telkom Sidoarjo?",
  "Apa itu Digital Talent Program (DTP) dan 9 spesialisasinya?",
  "Apa perbedaan jurusan SIJA (4 tahun) dan TJAT (3 tahun)?",
  "Bagaimana alur dan syarat pendaftaran PPDB 2026/2027?",
  "Berapa estimasi biaya hidup dan sewa kos di sekitar sekolah?",
  "Fasilitas lab teknologi apa saja yang tersedia di kampus Skomda?",
];

const DEFAULT_POOL_EN = [
  "What are the pillars of the BMW Program at SMK Telkom Sidoarjo?",
  "What is the Digital Talent Program (DTP) and its 9 specializations?",
  "What is the difference between SIJA (4-year) and TJAT (3-year)?",
  "How does the admission process for PPDB 2026/2027 work?",
  "What is the estimated cost of living and boarding near school?",
  "What technology labs and facilities are available on campus?",
];

export function getFollowUpSuggestions(
  query: string,
  responseContent: string,
  isEn: boolean,
  askedQuestions: string[] = []
): string[] {
  const combinedText = `${query} ${responseContent}`.toLowerCase();
  const askedNormalized = new Set(
    askedQuestions.map((q) => q.toLowerCase().replace(/[^a-z0-9]/g, ""))
  );
  if (query) {
    askedNormalized.add(query.toLowerCase().replace(/[^a-z0-9]/g, ""));
  }

  const results: string[] = [];

  // Match topic by frequency of keyword hits
  let bestTopic: TopicSuggestion | null = null;
  let highestScore = 0;

  for (const topic of TOPIC_SUGGESTIONS) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (combinedText.includes(kw)) {
        score += 1;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestTopic = topic;
    }
  }

  // Add suggestions from best topic
  if (bestTopic) {
    const list = isEn ? bestTopic.en : bestTopic.id;
    for (const item of list) {
      const norm = item.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!askedNormalized.has(norm) && !results.includes(item)) {
        results.push(item);
        if (results.length >= 3) break;
      }
    }
  }

  // Backfill with default pool if needed
  const pool = isEn ? DEFAULT_POOL_EN : DEFAULT_POOL_ID;
  for (const item of pool) {
    if (results.length >= 3) break;
    const norm = item.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!askedNormalized.has(norm) && !results.includes(item)) {
      results.push(item);
    }
  }

  // Ensure at least 2 items even if everything was somehow matched
  if (results.length < 2) {
    for (const item of pool) {
      if (!results.includes(item)) {
        results.push(item);
      }
      if (results.length >= 2) break;
    }
  }

  return results.slice(0, 3);
}

