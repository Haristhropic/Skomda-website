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
