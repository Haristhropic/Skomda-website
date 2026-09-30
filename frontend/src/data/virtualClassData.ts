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
