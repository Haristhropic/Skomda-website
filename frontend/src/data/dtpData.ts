export interface DtpSpecialization {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  coreSkills: string[];
  supportingSkills: string[];
  careerProspects: string[];
  tools: string[];
  badgeText?: string;
  image?: string;
  category: "Software & AI" | "Network & Cloud" | "Hardware & Security" | "Design & Creative";
}

export interface DtpProjectCollaboration {
  id: string;
  title: string;
  involvedDtp: string[];
  description: string;
  tags: string[];
}

export interface DtpDatComponent {
  component: string;
  weight: string;
  percentage: number;
  description: string;
}

export interface DtpRoadmapStep {
  step: string;
  number: string;
  title: string;
  dateRange?: string;
  description: string;
}

export interface DtpLongRoadmapItem {
  step: number;
  title: string;
  description: string;
}

// ─── 1. Sembilan (9) Spesialisasi Bidang DTP ───
export const DTP_SPECIALIZATIONS: DtpSpecialization[] = [
  {
    id: "software-developer",
    number: "01",
    title: "Software Developer",
    category: "Software & AI",
    shortDesc: "Pembuatan website dan aplikasi modern mulai dari perancangan basis data, arsitektur REST API, hingga deployment berbasis container.",
    fullDesc: "Mempelajari cara membuat website dan aplikasi mulai dari merancang database, menulis kode program, menghubungkan data melalui API, hingga mempublikasikan aplikasi agar dapat digunakan oleh pengguna dengan standar industri.",
    coreSkills: [
      "Algoritma Pemrograman",
      "HTML, CSS, JavaScript Modern",
      "PHP & Framework Laravel",
      "Perancangan & Optimasi Database",
      "RESTful API Development",
      "Version Control (Git & GitHub)",
      "Containerization dengan Docker",
      "Linux Server Environment",
      "Web Application Deployment",
    ],
    supportingSkills: [
      "UI/UX Fundamental & Wireframing",
      "Git Collaboration Workflow",
      "AI Coding Assistant Mastery",
      "Agile & Scrum Development",
      "Software Testing & Quality Assurance",
    ],
    careerProspects: [
      "Software Developer",
      "Backend Developer",
      "Frontend Developer",
      "Full Stack Developer",
      "Junior Web Engineer",
    ],
    tools: [
      "VS Code",
      "GitHub",
      "Laravel",
      "MySQL",
      "Postman",
      "Docker",
      "Linux",
      "Figma",
    ],
  },
  {
    id: "network-sysadmin",
    number: "02",
    title: "Network System Administrator",
    category: "Network & Cloud",
    shortDesc: "Pengelolaan server fisik maupun virtual agar aman, stabil, serta siap mendukung layanan operasional skala enterprise.",
    fullDesc: "Mempelajari cara mengelola server agar dapat digunakan bersama, aman, stabil, serta mendukung berbagai layanan di lingkungan sekolah maupun perusahaan dengan keandalan tinggi.",
    coreSkills: [
      "Linux Server Administration",
      "Windows Server & Active Directory",
      "Virtualization Technology",
      "DNS & DHCP Core Services",
      "Web & Database Server Management",
      "Disaster Recovery & Backup",
      "Server Security Hardening",
    ],
    supportingSkills: [
      "Server Troubleshooting",
      "Technical Documentation",
      "Basic Automation dengan Python",
      "AI Productivity untuk Sysadmin",
      "IT Service Management (ITSM)",
    ],
    careerProspects: [
      "System Administrator",
      "Network Administrator",
      "NOC (Network Operation Center) Engineer",
      "IT Support Specialist",
    ],
    tools: [
      "Ubuntu Server",
      "Windows Server",
      "VMware",
      "Proxmox",
      "Docker",
      "VirtualBox",
    ],
  },
  {
    id: "network-infrastructure",
    number: "03",
    title: "Network Infrastructure Engineer",
    category: "Network & Cloud",
    shortDesc: "Pembangunan dan pemeliharaan infrastruktur fiber optic, routing, switching, dan transmisi data berkecepatan tinggi.",
    fullDesc: "Pembangunan dan pengelolaan infrastruktur jaringan komputer serta telekomunikasi, mulai dari instalasi fiber optic, konfigurasi perangkat jaringan, hingga pengujian dan pemeliharaan jaringan sesuai standar industri telekomunikasi.",
    coreSkills: [
      "Desain Infrastruktur Jaringan Telekomunikasi",
      "Terminasi & Splicing Jaringan Fiber Optic",
      "Konfigurasi OLT & ONT",
      "Konfigurasi Routing MikroTik & Access Point",
      "Instalasi & Pengaturan IP CCTV",
      "Pengujian OTDR & Evaluasi Jaringan Fiber Optic",
    ],
    supportingSkills: [
      "Dasar Sistem Telekomunikasi",
      "Media Transmisi Jaringan",
      "Model Referensi OSI & TCP/IP",
      "IP Addressing & Advanced Subnetting",
      "Parameter Analisis Sinyal Telekomunikasi",
    ],
    careerProspects: [
      "Network Infrastructure Drafter",
      "Network Engineer",
      "Core Network Engineer",
      "Fiber Optic Technician",
    ],
    tools: [
      "MikroTik RouterOS",
      "Fusion Splicer & OTDR",
      "Ubuntu Server",
      "Windows Server",
      "VMware & Proxmox",
    ],
  },
  {
    id: "visual-communication-design",
    number: "04",
    title: "Visual Communication Designer",
    category: "Design & Creative",
    shortDesc: "Eksplorasi komunikasi visual terpadu: branding, UI/UX design, motion graphics, videografi, serta konten kreatif digital.",
    fullDesc: "Mempelajari cara merancang komunikasi visual melalui desain grafis, UI Design, ilustrasi, motion graphic, fotografi, videografi, editorial design, dan pengembangan karya kreatif digital sebagai solusi visual sesuai kebutuhan industri.",
    coreSkills: [
      "Graphic Design & Brand Identity",
      "Editorial & Packaging Design",
      "UI Design & Interactive Prototyping",
      "Motion Graphics Animation",
      "Photography & Lighting Technique",
      "Videography & Film Production",
      "Digital Illustration Artistry",
    ],
    supportingSkills: [
      "Dasar Komunikasi Visual & Semiotika",
      "Typography & Color Harmony Theory",
      "Layout, Grid System & Hierarchy",
      "Design Thinking Methodology",
      "Visual Storytelling",
      "AI for Creative Design Productivity",
      "Project Pitching & Presentation",
    ],
    careerProspects: [
      "Graphic Designer",
      "Visual Communication Designer",
      "Brand Identity Designer",
      "UI/UX Designer",
      "Motion Graphic Designer",
      "Multimedia Designer",
      "Digital Illustrator",
    ],
    tools: [
      "Adobe Illustrator",
      "Adobe Photoshop",
      "Figma",
      "Adobe After Effects",
      "Adobe Premiere Pro",
      "Adobe InDesign",
      "Lightroom",
      "Blender (Dasar)",
      "CapCut",
    ],
  },
  {
    id: "iot-engineer",
    number: "05",
    title: "Internet of Things (IoT) Engineer",
    category: "Hardware & Security",
    shortDesc: "Integrasi sensor cerdas, mikrokontroler ESP32, protokol MQTT/HTTP, serta dashboard monitoring dan otomasi real-time.",
    fullDesc: "Mempelajari cara menghubungkan perangkat elektronik dengan internet sehingga dapat melakukan monitoring kondisi lingkungan, pengendalian jarak jauh, dan otomasi secara real-time.",
    coreSkills: [
      "ESP32 & MicroPython Programming",
      "Integrasi Sensor & Aktuator Industri",
      "Komunikasi Data IoT (HTTP & MQTT)",
      "IoT Dashboard Development",
      "Flask Web Development Backend",
      "Database SQLite & Time-Series",
      "Sistem Monitoring IoT Real-Time",
      "Pengenalan Dasar PLC & HMI",
    ],
    supportingSkills: [
      "Basic Electronics & Circuit Design",
      "Python Programming Foundation",
      "Dasar Jaringan Komputer & Wi-Fi",
      "AI Productivity for Embedded Logic",
      "Project Management & Technical Documentation",
    ],
    careerProspects: [
      "IoT Engineer",
      "Embedded System Engineer",
      "Automation Engineer",
      "IoT Application Developer",
      "Smart Device Specialist",
    ],
    tools: [
      "ESP32 Module",
      "MicroPython",
      "Thonny IDE",
      "VS Code",
      "Flask Framework",
      "Mosquitto MQTT Broker",
      "Postman",
      "SQLite",
    ],
  },
  {
    id: "cloud-engineer",
    number: "06",
    title: "Cloud Engineer",
    category: "Network & Cloud",
    shortDesc: "Penyusunan arsitektur cloud computing, virtualisasi, container Docker, orkestrasi CI/CD, dan observabilitas sistem digital.",
    fullDesc: "Mempelajari cara mengelola server berbasis cloud untuk menyimpan data, menjalankan aplikasi berskala besar, melakukan otomatisasi deployment, serta memonitor keandalan layanan digital.",
    coreSkills: [
      "Prinsip Dasar Cloud Computing",
      "Administrasi Linux Server Tingkat Lanjut",
      "Virtualisasi (VMware & Proxmox)",
      "Docker & Container Management",
      "Cloud Deployment & Auto Scaling",
      "Web Server (Nginx & Apache)",
      "Cloud Storage & Object Storage",
      "Pipeline CI/CD Dasar",
      "Server & Application Monitoring",
      "Infrastructure as Code & Cloud Security Dasar",
    ],
    supportingSkills: [
      "Dasar Jaringan Komputer",
      "Bash Scripting & Automation",
      "Git & GitHub Workflow",
      "Database Dasar",
      "Python Scripting Dasar",
      "DevOps Culture & Observability",
      "Dokumentasi Teknis Infrastruktur",
    ],
    careerProspects: [
      "Cloud Engineer",
      "Cloud Administrator",
      "Junior DevOps Engineer",
      "Cloud Support Engineer",
      "Infrastructure Engineer",
    ],
    tools: [
      "Ubuntu Server",
      "Docker",
      "GitHub Actions",
      "Nginx",
      "AWS",
      "Google Cloud Platform (GCP)",
      "Microsoft Azure",
      "Proxmox",
      "Grafana & Prometheus",
    ],
  },
  {
    id: "ai-specialist",
    number: "07",
    title: "Artificial Intelligence (AI) Specialist",
    category: "Software & AI",
    shortDesc: "Penerapan Machine Learning, Natural Language Processing (NLP), Computer Vision, dan deployment model AI untuk solusi industri.",
    fullDesc: "AI Specialist berfokus pada pengembangan teknologi kecerdasan buatan melalui analisis data, Machine Learning, NLP, Computer Vision, serta implementasi model AI untuk menghasilkan solusi cerdas yang relevan dengan kebutuhan industri.",
    coreSkills: [
      "Python Programming for Data & AI",
      "Dataset Collection & Data Management",
      "Exploratory Data Analysis (EDA)",
      "Data Preprocessing & Normalization",
      "Machine Learning Algorithm & Modeling",
      "Dasar Deep Learning & Neural Networks",
      "Natural Language Processing (NLP)",
      "Computer Vision Training & Detection",
      "AI Model Deployment & Otomasi API",
    ],
    supportingSkills: [
      "Logika Pemrograman Komputasional",
      "Matematika (Statistika & Aljabar Linear)",
      "Relational & NoSQL Database Dasar",
      "Git & GitHub Collaboration",
      "Dasar Cloud Computing untuk AI",
      "Integrasi REST API untuk Model AI",
      "Data Visualization & Storytelling",
    ],
    careerProspects: [
      "AI Engineer",
      "Machine Learning Engineer",
      "NLP Engineer",
      "Computer Vision Engineer",
      "AI Application Developer",
      "Data Analyst",
      "Junior Data Scientist",
    ],
    tools: [
      "Python",
      "Jupyter Notebook",
      "Google Colab",
      "VS Code",
      "NumPy & Pandas",
      "Matplotlib & Seaborn",
      "Scikit-learn",
      "TensorFlow & PyTorch",
      "OpenCV",
      "Hugging Face & Roboflow",
    ],
  },
  {
    id: "digital-marketing",
    number: "08",
    title: "Digital Marketing Specialist",
    category: "Design & Creative",
    shortDesc: "Penguasaan strategi pemasaran digital, analisis pasar, periklanan media sosial, SEO/SEM, dan manajemen kampanye konversi tinggi.",
    fullDesc: "Mempelajari strategi pemasaran digital melalui riset pasar, media sosial, pembuatan konten kreatif, optimasi mesin pencari (SEO), periklanan terarah, serta analisis performa kampanye digital berbasis metrik konversi.",
    coreSkills: [
      "Market Research & Buyer Persona",
      "Brand Positioning & Value Proposition",
      "Content Marketing Strategy",
      "Creative Copywriting & Direct Response",
      "Social Media Marketing & Community",
      "Short-form & Long-form Video Marketing",
      "Search Engine Optimization (SEO)",
      "Search Engine Marketing (SEM / Google Ads)",
      "Digital Advertising (Meta Ads Manager)",
      "Marketplace Management & E-Commerce",
      "Email Marketing Automation",
      "Marketing Analytics & Performance Reporting",
    ],
    supportingSkills: [
      "Consumer Behavior Analysis",
      "Business Model Canvas (BMC)",
      "Digital Entrepreneurship",
      "Communication & Negotiation Skills",
      "Public Speaking & Pitch Deck",
      "AI Tools for Marketing Productivity",
      "Customer Relationship Management (CRM)",
      "Etika Bisnis Digital",
    ],
    careerProspects: [
      "Digital Marketing Specialist",
      "Social Media Specialist",
      "Content Strategist",
      "SEO Specialist",
      "SEM & Performance Marketer",
      "Marketplace Specialist",
      "Digital Marketing Analyst",
    ],
    tools: [
      "Google Analytics 4",
      "Google Search Console",
      "Google Ads",
      "Meta Ads Manager & Business Suite",
      "Google Trends & Looker Studio",
      "Canva & CapCut",
      "HubSpot CRM & Mailchimp",
      "ChatGPT & Gemini",
    ],
  },
  {
    id: "cyber-security",
    number: "09",
    title: "Cyber Security Specialist",
    category: "Hardware & Security",
    shortDesc: "Pengamanan sistem informasi, ethical hacking, uji penetrasi keamanan, deteksi insiden, dan pertahanan infrastruktur data.",
    fullDesc: "Mempelajari keamanan sistem informasi, jaringan, aplikasi, dan data melalui identifikasi kerentanan (*vulnerability assessment*), pengujian penetrasi keamanan, investigasi digital forensik, serta penerapan kontrol proteksi SOC.",
    coreSkills: [
      "Linux Security & Administration",
      "Network Security Architecture",
      "Infrastructure & Server Hardening",
      "Firewall & IDS/IPS Management",
      "Vulnerability Assessment & Scanning",
      "Penetration Testing (Web & Network)",
      "Web Application Security (OWASP Top 10)",
      "Dasar Digital Forensics & Investigasi",
      "Security Operations Center (SOC) Fundamentals",
      "Incident Response Planning",
      "Dasar Kriptografi & Enkripsi Data",
      "Security Event Monitoring & Log Analysis",
    ],
    supportingSkills: [
      "Protokol TCP/IP & Network Analysis",
      "Administrasi Windows Server",
      "Dasar Python Scripting untuk Keamanan",
      "Virtualization Security Environment",
      "Cloud Security Foundation",
      "Dokumentasi Audit Keamanan",
      "Kesadaran Keamanan Berbasis AI",
    ],
    careerProspects: [
      "Cyber Security Specialist",
      "Security Analyst",
      "SOC (Security Operations Center) Analyst",
      "Penetration Tester / Ethical Hacker",
      "Information Security Officer",
      "Incident Response Analyst",
      "Security Operations Engineer",
    ],
    tools: [
      "Kali Linux",
      "Wireshark",
      "Nmap",
      "Burp Suite Community",
      "Metasploit Framework",
      "OWASP ZAP",
      "Nessus Essentials",
      "Autopsy & Volatility",
      "Splunk",
      "VirtualBox",
    ],
  },
];

// ─── 2. Contoh 10 Proyek Kolaborasi Lintas Bidang ───
export const DTP_COLLABORATION_PROJECTS: DtpProjectCollaboration[] = [
  {
    id: "smart-school-ecosystem",
    title: "Smart School Ecosystem",
    involvedDtp: ["AI", "IoT", "Software", "Cloud", "Cyber", "Network", "VCD", "Digital Marketing"],
    description: "Membangun sistem sekolah pintar terintegrasi yang menghubungkan presensi cerdas, sensor ruangan, portal layanan civitas, jaringan stabil, dan perlindungan data.",
    tags: ["Ecosystem", "Integrasi Penuh", "Flagship"],
  },
  {
    id: "smart-parking",
    title: "Smart Parking System",
    involvedDtp: ["IoT", "AI", "Software", "Cloud", "VCD"],
    description: "Sistem parkir terotomasi menggunakan sensor ultrasonik/magnetik, deteksi plat nomor kendaraan via AI, aplikasi mobile pengguna, dan dashboard cloud.",
    tags: ["Computer Vision", "Automasi", "IoT"],
  },
  {
    id: "smart-attendance",
    title: "Smart Attendance",
    involvedDtp: ["AI", "Software", "Cloud", "Cyber"],
    description: "Presensi kehadiran berbasis pengenalan wajah (face recognition) berkecepatan tinggi dengan transmisi data terenkripsi dan audit keamanan ketat.",
    tags: ["Biometrik", "Keamanan Data", "Cloud"],
  },
  {
    id: "smart-classroom",
    title: "Smart Classroom Monitoring",
    involvedDtp: ["IoT", "AI", "Network", "Cloud"],
    description: "Pemantauan kondisi ruang kelas pintar: pengukuran suhu, kelembapan, pencahayaan otomatis, dan konektivitas jaringan stabil untuk pembelajaran digital.",
    tags: ["Smart Space", "Sensor", "Telekomunikasi"],
  },
  {
    id: "school-digital-service",
    title: "School Digital Service",
    involvedDtp: ["Software", "Cloud", "Cyber", "VCD"],
    description: "Platform digital layanan terpadu sekolah untuk administrasi, perpustakaan daring, dan konseling dengan desain antarmuka intuitif dan aman.",
    tags: ["Portal Web", "UI/UX", "Secure Service"],
  },
  {
    id: "smart-cctv-analytics",
    title: "Smart CCTV Analytics",
    involvedDtp: ["AI", "IoT", "Cloud", "Network"],
    description: "Kamera pengawas pintar dengan kemampuan deteksi objek dan kerumunan secara otomatis, dilengkapi peringatan dini dan live dashboard.",
    tags: ["Edge AI", "Surveillance", "Network"],
  },
  {
    id: "digital-company-profile",
    title: "Digital Company Profile & Branding",
    involvedDtp: ["VCD", "Software", "Digital Marketing"],
    description: "Pembuatan identitas visual brand, website profil interaktif berkecepatan tinggi, dan strategi kampanye pemasaran digital multi-kanal.",
    tags: ["Branding", "Creative", "Web Showcase"],
  },
  {
    id: "smart-greenhouse",
    title: "Smart Greenhouse Automation",
    involvedDtp: ["IoT", "AI", "Cloud"],
    description: "Sistem rumah kaca cerdas dengan monitoring kelembapan tanah, suhu udara, penyiraman otomatis, dan estimasi masa panen berbasis AI.",
    tags: ["AgriTech", "Otomasi", "Data Modeling"],
  },
  {
    id: "cyber-security-audit",
    title: "Cyber Security Audit & Hardening",
    involvedDtp: ["Cyber", "Cloud", "Network", "Software"],
    description: "Pengujian penetrasi keamanan berkala, pemindaian kerentanan sistem web dan server, serta penyusunan rekomendasi mitigasi ancaman siber.",
    tags: ["Pen-Testing", "SOC", "Hardening"],
  },
  {
    id: "ecommerce-digital-campaign",
    title: "E-Commerce & Digital Campaign",
    involvedDtp: ["Software", "VCD", "Digital Marketing", "AI"],
    description: "Platform toko daring lengkap dengan personalisasi rekomendasi produk AI, materi visual promosi premium, serta strategi iklan konversi tinggi.",
    tags: ["Marketplace", "Ads Strategy", "Creative Media"],
  },
];

// ─── 3. Model Pembelajaran Mingguan ───
export const DTP_WEEKLY_SCHEDULE = [
  {
    day: "Rabu",
    sessionTitle: "Internal Learning Session",
    tagline: "Fondasi Konseptual & Eksplorasi Terstruktur",
    description: "Sesi intensif penguasaan materi inti bersama guru ahli di sekolah melalui demonstrasi, telaah konsep, serta latihan bertahap.",
    points: [
      "Penguasaan konsep fundamental dan logika materi",
      "Demonstrasi langsung studi kasus dari instruktur",
      "Simulasi praktikum di laboratorium modern",
      "Latihan dasar untuk memperkuat pemahaman teknis",
    ],
  },
  {
    day: "Kamis",
    sessionTitle: "Industry Practice Session",
    tagline: "Penerapan Nyata Bersama Mentor Praktisi",
    description: "Sesi kolaborasi langsung dengan praktisi industri telekomunikasi & teknologi untuk menguji hasil karya dengan standar kerja nyata.",
    points: [
      "Hands-on practice pengerjaan proyek riil",
      "Penyelesaian studi kasus riil dunia industri",
      "Sesi Project Review dan telaah kode/desain/sistem",
      "Umpan balik langsung serta adopsi best practice industri",
    ],
  },
];

// ─── 4. Metrik Mutu & Hasil Evaluasi ───
export const DTP_METRICS = [
  {
    value: "4.71",
    scale: "/ 5.00",
    label: "Evaluasi Mitra Industri",
    highlight: "100% Kategori Baik & Sangat Baik",
    description: "Mitra industri menilai kualitas pengerjaan proyek siswa relevan dan siap terap di lingkungan kerja nyata.",
  },
  {
    value: "4.53",
    scale: "/ 5.00",
    label: "Tingkat Kepuasan Siswa",
    highlight: "Apresiasi Tinggi dari Peserta",
    description: "Siswa merasakan lonjakan kompetensi, rasa percaya diri berkolaborasi, dan kesiapan karir yang konkret.",
  },
  {
    value: "25–30",
    scale: "Siswa",
    label: "Kapasitas Kelas Spesialisasi",
    highlight: "Pendampingan Intensif",
    description: "Rasio murid dan mentor terjaga ketat agar setiap peserta mendapatkan bimbingan teknis optimal.",
  },
  {
    value: "9",
    scale: "Bidang",
    label: "Pilihan Spesialisasi Industri",
    highlight: "Selaras Kurikulum Masa Depan",
    description: "Mencakup seluruh rantai ekosistem teknologi: AI, Software, Cloud, Cyber, Jaringan, IoT, Kreatif, dan Digital Ads.",
  },
];

// ─── 5. Kisi-kisi Digital Aptitude Test (DAT) ───
export const DTP_DAT_COMPONENTS: DtpDatComponent[] = [
  {
    component: "Logical & Computational Thinking",
    weight: "30%",
    percentage: 30,
    description: "Mengukur kemampuan analisis logika, pola data, dan penyelesaian masalah terstruktur secara komputasional.",
  },
  {
    component: "Problem Solving",
    weight: "25%",
    percentage: 25,
    description: "Menguji ketangkasan dalam memecahkan skenario hambatan teknis dan pengambilan keputusan yang efisien.",
  },
  {
    component: "Digital Literacy",
    weight: "20%",
    percentage: 20,
    description: "Pemahaman fundamental seputar teknologi informasi, perangkat komputer, internet, dan etika digital.",
  },
  {
    component: "Creativity & Analytical Thinking",
    weight: "15%",
    percentage: 15,
    description: "Kemampuan berpikir kreatif, inovasi ide solusi baru, serta cara pandang kritis terhadap suatu rancangan.",
  },
  {
    component: "English for Technology (Dasar)",
    weight: "10%",
    percentage: 10,
    description: "Penguasaan istilah teknis bahasa Inggris dasar dalam dokumentasi software, hardware, dan teknologi global.",
  },
];

// ─── 6. Roadmap Seleksi & Penempatan Siswa ───
export const DTP_SELECTION_STEPS: DtpRoadmapStep[] = [
  {
    step: "Tahap 1",
    number: "01",
    title: "Digital Aptitude Test (DAT)",
    description: "Uji potensi logika, problem solving, literasi digital, dan bakat teknis seluruh siswa kelas XI.",
  },
  {
    step: "Tahap 2",
    number: "02",
    title: "Diskusi dengan Orang Tua",
    description: "Pemaparan hasil potensi siswa bersama orang tua untuk menentukan pilihan minat trial class.",
  },
  {
    step: "Tahap 3",
    number: "03",
    title: "Trial Class (Min. 4 Bidang)",
    description: "Siswa mencicipi pengalaman belajar langsung di minimal 4 kelas DTP berbeda sebelum menetapkan pilihan.",
  },
  {
    step: "Tahap 4",
    number: "04",
    title: "Pemilihan 3 Bidang Prioritas",
    description: "Siswa mengunci 3 pilihan spesialisasi bidang DTP sesuai hasil evaluasi minat dan bakat.",
  },
  {
    step: "Tahap 5",
    number: "05",
    title: "Career Interview & Tes Praktik",
    description: "Wawancara kesiapan karir dan uji praktik dasar untuk mengukur kesungguhan komitmen belajar.",
  },
  {
    step: "Tahap 6",
    number: "06",
    title: "Penetapan Kelas & Konseling",
    description: "Pengumuman kelas resmi. Bagi siswa yang memerlukan penyesuaian akan difasilitasi Career Counseling lanjutan.",
  },
];

// ─── 7. Long Roadmap Menuju BMW (Bekerja, Melanjutkan, Wirausaha) ───
export const DTP_LONG_ROADMAP: DtpLongRoadmapItem[] = [
  {
    step: 1,
    title: "Common Skills",
    description: "Membangun pondasi kompetensi dasar, etos kerja, serta literasi teknologi yang wajib dikuasai seluruh peserta DTP.",
  },
  {
    step: 2,
    title: "Bidang Spesialisasi",
    description: "Murid memilih dan mendalami satu bidang kejuruan spesifik sesuai minat, bakat, dan kebutuhan industri masa kini.",
  },
  {
    step: 3,
    title: "Industry Mentoring",
    description: "Belajar langsung dari praktisi industri melalui workshop, coaching intensif, guest lecture, dan project review berkala.",
  },
  {
    step: 4,
    title: "Collaborative Project",
    description: "Mengimplementasikan kompetensi yang telah dipelajari dengan mengerjakan proyek kolaborasi nyata lintas keahlian.",
  },
  {
    step: 5,
    title: "Portfolio & LKS Champion",
    description: "Mendokumentasikan karya menjadi portofolio profesional dan mempersiapkan siswa berprestasi di ajang LKS dan kompetisi nasional.",
  },
  {
    step: 6,
    title: "Praktik Kerja Lapangan (PKL)",
    description: "Menerapkan keahlian di dunia industri nyata melalui pengalaman magang langsung di perusahaan mitra ternama.",
  },
  {
    step: 7,
    title: "BMW (Bekerja, Melanjutkan, Wirausaha)",
    description: "Tujuan akhir DTP: melahirkan lulusan unggul yang adaptif, berdaya saing tinggi, dan siap menapaki karir impian.",
  },
];
