export interface QuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface VirtualClassDtpItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
  duration: string;
  driveVideoId: string;
  lessonTitle: string;
  lessonDesc: string;
  mentor: string;
  topics: string[];
  quiz: QuizItem;
}

export const VIRTUAL_CLASS_DATA: VirtualClassDtpItem[] = [
  {
    id: "cyber-security",
    title: "Cyber Security",
    desc: "Mengenal dasar keamanan cyber",
    icon: "/images/trial-class/dtp-cyber-security.png",
    duration: "3 menit",
    driveVideoId: "1RpJdoG1gAQpqEoeDfVHkeACNe8nbLViy",
    lessonTitle: "Pengenalan Keamanan Siber & Proteksi Data",
    lessonDesc:
      "Pelajari prinsip confidentiality, integrity, dan availability (CIA Triad), teknik deteksi celah keamanan, serta praktik terbaik perlindungan sistem jaringan sekolah.",
    mentor: "Tim Pengajar Lab Cybersecurity SKOMDA",
    topics: [
      "Dasar Vulnerability Scanning & Penetration Testing",
      "Keamanan Jaringan & Enkripsi Data Siswa",
      "Simulasi Praktik Defense Cyber Attack",
    ],
    quiz: {
      question: "Apa tujuan utama dari proses vulnerability scanning dalam keamanan siber?",
      options: [
        "Menghapus seluruh file dan sistem yang ada di server",
        "Mengidentifikasi celah atau kelemahan keamanan sebelum dieksploitasi pihak jahat",
        "Meningkatkan kecepatan koneksi internet pengguna",
        "Membuat akun sosial media otomatis untuk pengujian",
      ],
      correctIndex: 1,
      explanation:
        "Vulnerability scanning berfungsi untuk mendeteksi celah dan kelemahan pada sistem secara proaktif sebelum dapat diserang oleh peretas.",
    },
  },
  {
    id: "artificial-intelligence",
    title: "Artificial Intelligence",
    desc: "Mengenal konsep dasar dan penerapan AI",
    icon: "/images/trial-class/dtp-artificial-intelligence.png",
    duration: "3 menit",
    driveVideoId: "1l_oQYOt2-a5yqTl06bY2fT0KPcZNtuGF",
    lessonTitle: "Pengenalan Artificial Intelligence & Machine Learning",
    lessonDesc:
      "Mengenal bagaimana model kecerdasan buatan dilatih dengan dataset, cara kerja generative AI, dan implementasinya untuk otomasi industri modern.",
    mentor: "Instruktur AI & Data Science SKOMDA",
    topics: [
      "Pengenalan Machine Learning & Deep Learning",
      "Prompt Engineering & Penerapan Generative AI",
      "Live Demo Computer Vision & Image Recognition",
    ],
    quiz: {
      question: "Manakah di bawah ini yang merupakan contoh penerapan Machine Learning dalam kehidupan sehari-hari?",
      options: [
        "Sistem rekomendasi tontonan di YouTube atau Netflix",
        "Kabel charger ponsel yang mengalirkan arus listrik",
        "Papan ketik mekanikal pada laptop",
        "Layar monitor beresolusi tinggi",
      ],
      correctIndex: 0,
      explanation:
        "Algoritma rekomendasi mempelajari pola kebiasaan tontonan pengguna menggunakan model Machine Learning.",
    },
  },
  {
    id: "iot",
    title: "Internet of Things",
    desc: "Mengenal perangkat dan konektivitas IoT",
    icon: "/images/trial-class/dtp-iot.png",
    duration: "3 menit",
    driveVideoId: "1dey2ATnr3PJJCWis6lXlXF5DVq9lKAVt",
    lessonTitle: "Pengenalan Internet of Things & Smart Devices",
    lessonDesc:
      "Mempelajari arsitektur sistem IoT, integrasi mikrokontroler ESP32 dengan aneka sensor lingkungan, serta transmisi data telemetri ke cloud realtime.",
    mentor: "Tim Lab IoT & Embedded System",
    topics: [
      "Pengenalan Sensor & Mikrokontroler ESP32",
      "Protokol MQTT & Cloud Dashboard Realtime",
      "Studi Kasus Smart School & Home Automation",
    ],
    quiz: {
      question: "Komponen apa yang berfungsi mendeteksi kondisi fisik seperti suhu atau cahaya dalam sistem IoT?",
      options: [
        "Sensor",
        "Printer 3D",
        "Speaker eksternal",
        "Kabel HDMI",
      ],
      correctIndex: 0,
      explanation:
        "Sensor bertugas mengubah besaran fisik (suhu, kelembapan, intensitas cahaya) menjadi sinyal listrik yang dapat dibaca mikrokontroler.",
    },
  },
  {
    id: "software-developer",
    title: "Software Developer",
    desc: "Belajar membangun aplikasi dan website",
    icon: "/images/trial-class/dtp-software-developer.png",
    duration: "3 menit",
    driveVideoId: "1WxeU3lbViCuFdBPsgKzMDjfSn_0pbdr6",
    lessonTitle: "Pengenalan Web Development",
    lessonDesc:
      "Pelajari dasar-dasar pembuatan website, mulai dari struktur HTML, styling dengan CSS, hingga interaktivitas dengan JavaScript.",
    mentor: "Senior Software Engineer / Guru RPL SKOMDA",
    topics: [
      "Struktur Web Modern Menggunakan Next.js & Tailwind CSS",
      "Logika Algoritma Pemrograman & RESTful API",
      "Hands-on Mini Project Pembuatan Web Interaktif",
    ],
    quiz: {
      question: "Apa fungsi dari tag <html> dalam struktur HTML?",
      options: [
        "Untuk membuat judul halaman web",
        "Untuk menampilkan gambar pada web",
        "Untuk mendefinisikan seluruh dokumen HTML",
        "Untuk membuat daftar pada halaman web",
      ],
      correctIndex: 2,
      explanation:
        "Tag <html> adalah elemen akar (root) yang membungkus seluruh konten dan hierarki dokumen dalam sebuah halaman web.",
    },
  },
  {
    id: "cloud-engineer",
    title: "Cloud Engineer",
    desc: "Mengenal konsep dan layanan cloud",
    icon: "/images/trial-class/dtp-cloud-engineer.png",
    duration: "3 menit",
    driveVideoId: "1rmPxCtQoTfzRPOHMGvACHwnQjS-oM1uJ",
    lessonTitle: "Dasar Cloud Computing & Virtualisasi",
    lessonDesc:
      "Memahami cara kerja infrastruktur komputasi awan, model IaaS/PaaS/SaaS, serta bagaimana server virtual dikonfigurasi untuk menjalankan aplikasi berskala besar.",
    mentor: "Instruktur Cloud Computing (AWS/GCP Certified)",
    topics: [
      "Pengenalan Cloud Infrastructure & Virtualisasi",
      "Deploy Server Virtual, Storage, & Networking",
      "Manajemen Skalabilitas & Keandalan Cloud",
    ],
    quiz: {
      question: "Apa keunggulan utama menggunakan layanan Cloud Computing dibandingkan server fisik mandiri?",
      options: [
        "Mudah ditingkatkan kapasitasnya (scalable) dan biaya sesuai pemakaian",
        "Memerlukan ruangan pendingin server khusus di rumah",
        "Tidak membutuhkan koneksi internet sama sekali",
        "Hanya bisa diakses dari satu komputer tertentu",
      ],
      correctIndex: 0,
      explanation:
        "Cloud computing menawarkan elastisitas dan skalabilitas instan tanpa harus berinvestasi membeli perangkat keras fisik terlebih dahulu.",
    },
  },
  {
    id: "network-system-admin",
    title: "Network System Administrator",
    desc: "Mengenal manajemen sistem dan jaringan",
    icon: "/images/trial-class/dtp-network-admin.png",
    duration: "3 menit",
    driveVideoId: "1ZUZtuXSdAN7DKCWcraRBfA4o_QzyCZTt",
    lessonTitle: "Administrasi Sistem Jaringan & Linux Server",
    lessonDesc:
      "Pelajari dasar navigasi terminal Linux, pengaturan hak akses pengguna, konfigurasi DNS & DHCP server, serta manajemen pemeliharaan sistem terpusat.",
    mentor: "Instruktur Jaringan & Server TJAT SKOMDA",
    topics: [
      "Administrasi Linux Server & Terminal Command",
      "Manajemen User, Permission, & Keamanan Server",
      "Monitoring Kinerja Server & Troubleshooting Jaringan",
    ],
    quiz: {
      question: "Perintah terminal Linux apa yang sering digunakan untuk melihat daftar file dan folder dalam sebuah direktori?",
      options: [
        "ls",
        "delete",
        "shutdown",
        "exit",
      ],
      correctIndex: 0,
      explanation:
        "Perintah ls (list) menampilkan daftar file dan subfolder yang terdapat di dalam direktori kerja saat ini.",
    },
  },
  {
    id: "visual-designer",
    title: "Visual Communication Designer",
    desc: "Belajar desain visual yang komunikatif",
    icon: "/images/trial-class/dtp-visual-designer.png",
    duration: "3 menit",
    driveVideoId: "1FBqoh9z88hYdXp1I78g2kWv2sXg0H0SU",
    lessonTitle: "Prinsip Dasar Desain Komunikasi Visual & UI",
    lessonDesc:
      "Pelajari hierarki visual, kontras warna, sistem grid, dan harmoni tipografi agar setiap karya visual mampu menyampaikan pesan secara efektif dan memikat audiens.",
    mentor: "Creative Design Lead SKOMDA",
    topics: [
      "Prinsip Dasar UI/UX, Layout, & Komposisi Visual",
      "Harmoni Warna, Hierarki Tipografi, & Grid System",
      "Praktik Desain Konten Digital & Poster Interaktif",
    ],
    quiz: {
      question: "Apa fungsi utama hierarki tipografi dalam sebuah desain tampilan?",
      options: [
        "Mengarahkan mata audiens membaca informasi terpenting terlebih dahulu",
        "Menghabiskan ruang kosong pada kanvas desain",
        "Membuat semua tulisan memiliki ukuran yang persis sama",
        "Mengubah warna teks secara acak",
      ],
      correctIndex: 0,
      explanation:
        "Hierarki tipografi memandu mata audiens untuk mencerna judul, subjudul, dan teks isi dengan urutan prioritas yang nyaman dibaca.",
    },
  },
  {
    id: "network-infrastructure",
    title: "Network Infrastructure Engineer",
    desc: "Mengenal infrastruktur dan perancangan jaringan",
    icon: "/images/trial-class/dtp-network-infrastructure.png",
    duration: "3 menit",
    driveVideoId: "1QoxqCsrGEWpwSAkVpm98ISv_iqY-TuFH",
    lessonTitle: "Infrastruktur Jaringan & Pengenalan Fiber Optic",
    lessonDesc:
      "Mengenal media transmisi kabel serat optik, perangkat router dan switch enterprise, serta konfigurasi routing protokol untuk menghubungkan gedung sekolah.",
    mentor: "Fiber Optic & Routing Specialist SKOMDA",
    topics: [
      "Perancangan Topologi Jaringan Enterprise & Kampus",
      "Konfigurasi Routing Router MikroTik & Cisco Switch",
      "Dasar Transmisi Fiber Optic & Splicing Cable",
    ],
    quiz: {
      question: "Media apakah yang digunakan oleh kabel Fiber Optic untuk mentransmisikan data?",
      options: [
        "Sinyal cahaya",
        "Gelombang suara akustik",
        "Arus listrik tegangan tinggi",
        "Cairan magnetik",
      ],
      correctIndex: 0,
      explanation:
        "Kabel Fiber Optic mentransmisikan data dalam bentuk pulsa cahaya melalui inti serat kaca murni dengan kecepatan luar biasa tinggi.",
    },
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing Specialist",
    desc: "Mengenal strategi pemasaran digital modern",
    icon: "/images/trial-class/dtp-digital-marketing.png",
    duration: "3 menit",
    driveVideoId: "1Svnb9Yy_MwyqKGJxYA28rWnYsSlp4wrs",
    lessonTitle: "Strategi Digital Marketing & Social Media Growth",
    lessonDesc:
      "Pelajari riset target audiens, strategi pembuatan konten kreatif di media sosial, teknik optimasi kampanye iklan digital, dan analisis metrik konversi.",
    mentor: "Growth & Digital Marketing Lead",
    topics: [
      "Strategi Social Media Marketing & Content Planning",
      "Riset Target Audience & Dasar Paid Ads Optimization",
      "Analisis Funnel Konversi & Brand Positioning",
    ],
    quiz: {
      question: "Dalam pemasaran digital, apa yang dimaksud dengan istilah 'Target Audience'?",
      options: [
        "Kelompok konsumen spesifik yang paling berpotensi tertarik dengan produk atau layananmu",
        "Komputer server yang digunakan untuk mengirim email promosi",
        "Pesaing bisnis yang menjual produk serupa di pasar",
        "Jumlah total seluruh pengguna internet tanpa memandang minat",
      ],
      correctIndex: 0,
      explanation:
        "Target audience adalah kelompok spesifik pengguna yang memiliki kebutuhan atau minat paling relevan dengan produk yang ditawarkan.",
    },
  },
];

export const VIRTUAL_CLASS_DATA_EN: Record<
  string,
  {
    titleEn: string;
    descEn: string;
    durationEn: string;
    lessonTitleEn: string;
    lessonDescEn: string;
    mentorEn: string;
    topicsEn: string[];
    quizEn: QuizItem;
  }
> = {
  "cyber-security": {
    titleEn: "Cyber Security",
    descEn: "Explore fundamentals of cybersecurity & data protection",
    durationEn: "3 mins",
    lessonTitleEn: "Introduction to Cybersecurity & Data Protection",
    lessonDescEn:
      "Learn the CIA Triad principles (confidentiality, integrity, availability), vulnerability detection techniques, and best practices for safeguarding network infrastructure.",
    mentorEn: "SKOMDA Cybersecurity Lab Faculty",
    topicsEn: [
      "Vulnerability Scanning & Penetration Testing Basics",
      "Network Security & Student Data Encryption",
      "Cyber Defense Practical Simulation",
    ],
    quizEn: {
      question: "What is the primary purpose of vulnerability scanning in cybersecurity?",
      options: [
        "Delete all files and operating systems on the server",
        "Identify security flaws and weaknesses before malicious actors exploit them",
        "Increase user internet connection speed",
        "Create automated social media accounts for testing",
      ],
      correctIndex: 1,
      explanation:
        "Vulnerability scanning proactively detects vulnerabilities and system flaws before they can be compromised by attackers.",
    },
  },
  "artificial-intelligence": {
    titleEn: "Artificial Intelligence",
    descEn: "Explore core concepts and practical applications of AI",
    durationEn: "3 mins",
    lessonTitleEn: "Introduction to Artificial Intelligence & Machine Learning",
    lessonDescEn:
      "Understand how artificial intelligence models are trained with datasets, how generative AI works, and how it automates modern industries.",
    mentorEn: "SKOMDA AI & Data Science Instructor",
    topicsEn: [
      "Introduction to Machine Learning & Deep Learning",
      "Prompt Engineering & Generative AI Applications",
      "Live Demo: Computer Vision & Image Recognition",
    ],
    quizEn: {
      question: "Which of the following is an example of Machine Learning in daily life?",
      options: [
        "Content recommendation systems on YouTube or Netflix",
        "A phone charging cable conducting electrical current",
        "A mechanical keyboard on a laptop",
        "A high-resolution monitor display",
      ],
      correctIndex: 0,
      explanation:
        "Recommendation algorithms learn viewing habits and user patterns using Machine Learning models.",
    },
  },
  iot: {
    titleEn: "Internet of Things",
    descEn: "Discover smart devices and connected IoT telemetry",
    durationEn: "3 mins",
    lessonTitleEn: "Introduction to Internet of Things & Smart Devices",
    lessonDescEn:
      "Learn IoT architecture, interfacing ESP32 microcontrollers with various environmental sensors, and streaming telemetry to real-time cloud dashboards.",
    mentorEn: "IoT & Embedded Systems Lab Team",
    topicsEn: [
      "Introduction to Sensors & ESP32 Microcontrollers",
      "MQTT Protocols & Realtime Cloud Dashboards",
      "Case Studies: Smart School & Home Automation",
    ],
    quizEn: {
      question: "Which component detects physical environmental conditions such as temperature or light in an IoT system?",
      options: [
        "Sensor",
        "3D Printer",
        "External Speaker",
        "HDMI Cable",
      ],
      correctIndex: 0,
      explanation:
        "Sensors convert physical variables (temperature, humidity, light intensity) into electrical signals readable by microcontrollers.",
    },
  },
  "software-developer": {
    titleEn: "Software Developer",
    descEn: "Learn to build modern web and mobile applications",
    durationEn: "3 mins",
    lessonTitleEn: "Introduction to Modern Web Development",
    lessonDescEn:
      "Learn the fundamentals of building websites, from HTML semantics and CSS styling to interactive JavaScript logic.",
    mentorEn: "Senior Software Engineer / SKOMDA Software Faculty",
    topicsEn: [
      "Modern Web Architecture Using Next.js & Tailwind CSS",
      "Algorithmic Problem Solving & RESTful APIs",
      "Hands-on Mini Project: Interactive Web Application",
    ],
    quizEn: {
      question: "What is the purpose of the <html> tag in an HTML document?",
      options: [
        "To create the title of the webpage",
        "To display images on the webpage",
        "To define and wrap the entire HTML document",
        "To create a numbered list on the webpage",
      ],
      correctIndex: 2,
      explanation:
        "The <html> tag serves as the root element enclosing all content and document hierarchy on a webpage.",
    },
  },
  "cloud-engineer": {
    titleEn: "Cloud Engineer",
    descEn: "Understand cloud architecture and scalable services",
    durationEn: "3 mins",
    lessonTitleEn: "Fundamentals of Cloud Computing & Virtualization",
    lessonDescEn:
      "Understand cloud infrastructure architectures, IaaS/PaaS/SaaS models, and how virtual servers are provisioned to run high-availability applications.",
    mentorEn: "Cloud Computing Instructor (AWS/GCP Certified)",
    topicsEn: [
      "Introduction to Cloud Infrastructure & Virtualization",
      "Deploying Virtual Servers, Storage, & Networking",
      "Managing Cloud Scalability & Reliability",
    ],
    quizEn: {
      question: "What is a primary advantage of Cloud Computing over on-premise physical servers?",
      options: [
        "Instant scalability and pay-as-you-go cost structure",
        "Requires a dedicated air-conditioned server room at home",
        "Requires no internet connectivity whatsoever",
        "Can only be accessed from one specific designated computer",
      ],
      correctIndex: 0,
      explanation:
        "Cloud computing delivers instant elasticity and scale without upfront physical hardware investments.",
    },
  },
  "network-system-admin": {
    titleEn: "Network System Administrator",
    descEn: "Master enterprise system administration and network operations",
    durationEn: "3 mins",
    lessonTitleEn: "Network Systems Administration & Linux Server",
    lessonDescEn:
      "Learn Linux terminal navigation, user privilege controls, DNS & DHCP service configuration, and centralized systems maintenance.",
    mentorEn: "SKOMDA TJAT Systems & Server Instructor",
    topicsEn: [
      "Linux Server Administration & Terminal Commands",
      "User Management, Permissions, & Server Hardening",
      "Server Performance Monitoring & Network Troubleshooting",
    ],
    quizEn: {
      question: "Which Linux terminal command lists files and folders in a directory?",
      options: [
        "ls",
        "delete",
        "shutdown",
        "exit",
      ],
      correctIndex: 0,
      explanation:
        "The 'ls' (list) command outputs the files and subfolders located in the current working directory.",
    },
  },
  "visual-designer": {
    titleEn: "Visual Communication Designer",
    descEn: "Craft impactful visual communication and UI assets",
    durationEn: "3 mins",
    lessonTitleEn: "Principles of Visual Communication & UI Design",
    lessonDescEn:
      "Study visual hierarchy, color contrast, grid layouts, and typographic harmony to deliver engaging and communicative visual experiences.",
    mentorEn: "SKOMDA Creative Design Lead",
    topicsEn: [
      "Fundamentals of UI/UX, Layouts, & Visual Composition",
      "Color Harmony, Typographic Hierarchy, & Grid Systems",
      "Hands-on Practice: Digital Content & Interactive Posters",
    ],
    quizEn: {
      question: "What is the primary function of typographic hierarchy in interface design?",
      options: [
        "Guiding the viewer's eyes to absorb key information first",
        "Filling up empty space on the design canvas",
        "Making all text elements the exact same font size",
        "Randomizing text colors across sections",
      ],
      correctIndex: 0,
      explanation:
        "Typographic hierarchy directs the reader's eye through headlines, subheadings, and body copy in a clear order of importance.",
    },
  },
  "network-infrastructure": {
    titleEn: "Network Infrastructure Engineer",
    descEn: "Explore physical networking infrastructure and fiber optics",
    durationEn: "3 mins",
    lessonTitleEn: "Network Infrastructure & Fiber Optics",
    lessonDescEn:
      "Examine fiber optic cabling media, enterprise switches and routers, and routing protocol setups connecting campus facilities.",
    mentorEn: "SKOMDA Fiber Optic & Routing Specialist",
    topicsEn: [
      "Enterprise & Campus Network Topology Design",
      "Routing Configuration on MikroTik & Cisco Hardware",
      "Fiber Optic Transmission Fundamentals & Cable Splicing",
    ],
    quizEn: {
      question: "What medium is used by Fiber Optic cables to transmit data?",
      options: [
        "Light pulses",
        "Acoustic sound waves",
        "High-voltage electrical current",
        "Magnetic fluid",
      ],
      correctIndex: 0,
      explanation:
        "Fiber Optic cables transmit digital data as pulses of light through ultra-pure glass strands at high speeds.",
    },
  },
  "digital-marketing": {
    titleEn: "Digital Marketing Specialist",
    descEn: "Master modern digital marketing and growth strategies",
    durationEn: "3 mins",
    lessonTitleEn: "Digital Marketing Strategy & Social Media Growth",
    lessonDescEn:
      "Learn audience targeting, creative content creation for social platforms, digital advertising optimization, and conversion analytics.",
    mentorEn: "Growth & Digital Marketing Lead",
    topicsEn: [
      "Social Media Marketing & Content Planning Strategy",
      "Target Audience Research & Paid Ads Optimization",
      "Conversion Funnel Analysis & Brand Positioning",
    ],
    quizEn: {
      question: "In digital marketing, what does 'Target Audience' refer to?",
      options: [
        "The specific group of consumers most likely to be interested in your product or service",
        "The server computer used to transmit marketing emails",
        "Competitors selling similar items in the market",
        "The total number of all internet users regardless of interest",
      ],
      correctIndex: 0,
      explanation:
        "A target audience is a specific consumer demographic whose needs align directly with the product or service offered.",
    },
  },
};

export function getLocalizedVirtualClassItem(
  item: VirtualClassDtpItem,
  isEn: boolean
): VirtualClassDtpItem {
  if (!isEn) return item;
  const trans = VIRTUAL_CLASS_DATA_EN[item.id];
  if (!trans) return item;
  return {
    ...item,
    title: trans.titleEn || item.title,
    desc: trans.descEn || item.desc,
    duration: trans.durationEn || item.duration,
    lessonTitle: trans.lessonTitleEn || item.lessonTitle,
    lessonDesc: trans.lessonDescEn || item.lessonDesc,
    mentor: trans.mentorEn || item.mentor,
    topics: trans.topicsEn || item.topics,
    quiz: trans.quizEn || item.quiz,
  };
}
