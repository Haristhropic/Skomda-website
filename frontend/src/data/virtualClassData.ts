export interface QuizItem {
  id?: string | number;
  triggerSeconds?: number;
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
  driveVideoId?: string;
  videoUrl?: string;
  lessonTitle: string;
  lessonDesc: string;
  mentor: string;
  topics: string[];
  quiz: QuizItem;
  quizzes?: QuizItem[];
  isActive?: boolean;
  orderIndex?: number;
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
      id: "cs-q1",
      triggerSeconds: 50,
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
    quizzes: [
      {
        id: "cs-q1",
        triggerSeconds: 50,
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
      {
        id: "cs-q2",
        triggerSeconds: 110,
        question: "Dalam prinsip CIA Triad keamanan informasi, apa yang dimaksud dengan 'Integrity'?",
        options: [
          "Menjamin keutuhan, keaslian, dan data tidak dimanipulasi oleh pihak tanpa izin",
          "Memastikan data dapat diakses oleh publik tanpa kata sandi",
          "Menghapus data cadangan setiap akhir pekan",
          "Membatasi waktu penggunaan komputer maksimal 1 jam per hari",
        ],
        correctIndex: 0,
        explanation:
          "Integrity menjamin bahwa data tetap akurat, konsisten, dan terpercaya tanpa adanya modifikasi ilegal.",
      },
    ],
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
      id: "ai-q1",
      triggerSeconds: 50,
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
    quizzes: [
      {
        id: "ai-q1",
        triggerSeconds: 50,
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
      {
        id: "ai-q2",
        triggerSeconds: 110,
        question: "Apa fungsi dari 'Dataset' dalam proses pelatihan model Machine Learning?",
        options: [
          "Kumpulan contoh data yang dipelajari model untuk mengenali pola dan mengambil keputusan",
          "Program antivirus untuk membersihkan harddisk",
          "Kabel konektor display port ke proyektor",
          "Baterai cadangan untuk laptop server",
        ],
        correctIndex: 0,
        explanation:
          "Dataset menjadi bahan belajar utama algoritma kecerdasan buatan untuk mengidentifikasi pola data yang akurat.",
      },
    ],
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
      id: "iot-q1",
      triggerSeconds: 50,
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
    quizzes: [
      {
        id: "iot-q1",
        triggerSeconds: 50,
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
      {
        id: "iot-q2",
        triggerSeconds: 110,
        question: "Protokol komunikasi berbobot ringan yang sangat lazim digunakan untuk transmisi data sensor IoT ke server cloud adalah:",
        options: [
          "MQTT (Message Queuing Telemetry Transport)",
          "FTP",
          "POP3",
          "SMTP",
        ],
        correctIndex: 0,
        explanation:
          "MQTT dirancang hemat bandwidth dan efisien daya, sangat ideal untuk mikrokontroler dan perangkat sensor IoT.",
      },
    ],
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
      id: "sd-q1",
      triggerSeconds: 50,
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
    quizzes: [
      {
        id: "sd-q1",
        triggerSeconds: 50,
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
      {
        id: "sd-q2",
        triggerSeconds: 110,
        question: "Dalam pembuatan website modern, CSS berfungsi untuk apa?",
        options: [
          "Mengatur tampilan visual, warna, tata letak (layout), dan responsivitas web",
          "Mengelola tabel database MySQL",
          "Menyimpan file dokumen ke Google Drive",
          "Menghubungkan kabel LAN ke switch",
        ],
        correctIndex: 0,
        explanation:
          "CSS (Cascading Style Sheets) bertanggung jawab atas desain grafis, tata letak, warna, dan pengalaman visual pengguna di web.",
      },
    ],
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
      id: "ce-q1",
      triggerSeconds: 50,
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
    quizzes: [
      {
        id: "ce-q1",
        triggerSeconds: 50,
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
      {
        id: "ce-q2",
        triggerSeconds: 110,
        question: "Model layanan cloud IaaS (Infrastructure as a Service) menyediakan sumber daya berupa apa?",
        options: [
          "Infrastruktur dasar komputasi seperti virtual machine, storage, dan virtual network",
          "Layanan email web jadi seperti Gmail",
          "Aplikasi pengolah kata berbasis browser",
          "Meja kantor dan perangkat komputer desktop",
        ],
        correctIndex: 0,
        explanation:
          "IaaS memberikan kontrol penuh pada infrastruktur virtual seperti VM, penyimpanan blok, dan subnet jaringan cloud.",
      },
    ],
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
      id: "nsa-q1",
      triggerSeconds: 50,
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
    quizzes: [
      {
        id: "nsa-q1",
        triggerSeconds: 50,
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
      {
        id: "nsa-q2",
        triggerSeconds: 110,
        question: "Protokol jaringan apa yang bertugas memberikan alamat IP otomatis kepada perangkat komputer klien?",
        options: [
          "DHCP (Dynamic Host Configuration Protocol)",
          "HTTP",
          "SMTP",
          "SSH",
        ],
        correctIndex: 0,
        explanation:
          "DHCP mendistribusikan konfigurasi IP, subnet mask, dan gateway secara otomatis kepada setiap perangkat di jaringan.",
      },
    ],
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
      id: "vd-q1",
      triggerSeconds: 50,
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
    quizzes: [
      {
        id: "vd-q1",
        triggerSeconds: 50,
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
      {
        id: "vd-q2",
        triggerSeconds: 110,
        question: "Dalam desain antarmuka, apa yang dimaksud dengan 'White Space' (Ruang Negatif)?",
        options: [
          "Ruang kosong di sekitar elemen untuk memberikan kejelasan visual dan kenyamanan fokus mata",
          "Bagian gambar yang gagal dimuat oleh browser",
          "Warna background yang wajib selalu putih bersih",
          "Tanda bahwa aplikasi mengalami kesalahan grafis",
        ],
        correctIndex: 0,
        explanation:
          "White space memberikan ruang bernapas pada layout sehingga antarmuka tidak terasa sesak dan lebih mudah dipahami.",
      },
    ],
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
      id: "ni-q1",
      triggerSeconds: 50,
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
    quizzes: [
      {
        id: "ni-q1",
        triggerSeconds: 50,
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
      {
        id: "ni-q2",
        triggerSeconds: 110,
        question: "Alat presisi apa yang digunakan teknisi jaringan untuk menyambung dua ujung serat optik secara permanen?",
        options: [
          "Fusion Splicer",
          "Crimping Tool RJ45",
          "Tang potong kawat",
          "Obeng minus",
        ],
        correctIndex: 0,
        explanation:
          "Fusion Splicer menyambungkan dua ujung inti serat kaca menggunakan busur listrik mikro dengan peredaman (loss) yang sangat minim.",
      },
    ],
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
      id: "dm-q1",
      triggerSeconds: 50,
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
    quizzes: [
      {
        id: "dm-q1",
        triggerSeconds: 50,
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
      {
        id: "dm-q2",
        triggerSeconds: 110,
        question: "Metrik pemasaran digital apa yang menghitung persentase pengunjung yang berhasil melakukan pembelian atau pendaftaran?",
        options: [
          "Conversion Rate (Tingkat Konversi)",
          "Refresh Rate",
          "Latency Ping",
          "Clock Speed",
        ],
        correctIndex: 0,
        explanation:
          "Conversion Rate mengukur efektivitas kampanye promosi dalam mengubah audiens menjadi pengguna atau pelanggan aktif.",
      },
    ],
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
      triggerSeconds: 50,
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
    descEn: "Learn foundational concepts and industrial AI applications",
    durationEn: "3 mins",
    lessonTitleEn: "Introduction to Artificial Intelligence & Machine Learning",
    lessonDescEn:
      "Understand how AI models learn from training datasets, how generative models function, and their automation applications in modern industry.",
    mentorEn: "SKOMDA AI & Data Science Instructor",
    topicsEn: [
      "Fundamentals of Machine Learning & Deep Learning",
      "Prompt Engineering & Generative AI Applications",
      "Computer Vision & Pattern Recognition Showcase",
    ],
    quizEn: {
      triggerSeconds: 50,
      question: "Which of the following is a real-world example of Machine Learning in daily life?",
      options: [
        "Video recommendation algorithms on YouTube or Netflix",
        "A power cable supplying electricity to a phone",
        "A mechanical keyboard connected to a computer",
        "A high-resolution display monitor",
      ],
      correctIndex: 0,
      explanation:
        "Recommendation systems analyze historical viewing habits using Machine Learning models to predict relevant content.",
    },
  },
  iot: {
    titleEn: "Internet of Things",
    descEn: "Discover smart device hardware and cloud connectivity",
    durationEn: "3 mins",
    lessonTitleEn: "Introduction to Internet of Things & Smart Devices",
    lessonDescEn:
      "Study IoT system architecture, ESP32 microcontroller sensor integration, and real-time telemetry streaming to cloud dashboards.",
    mentorEn: "IoT & Embedded Systems Lab Faculty",
    topicsEn: [
      "Sensors & ESP32 Microcontroller Integration",
      "MQTT Protocol & Real-time Cloud Telemetry",
      "Smart Campus & Home Automation Case Studies",
    ],
    quizEn: {
      triggerSeconds: 50,
      question: "Which component detects physical environmental factors like temperature or light in an IoT device?",
      options: [
        "Sensor",
        "3D Printer",
        "External Speaker",
        "HDMI Cable",
      ],
      correctIndex: 0,
      explanation:
        "Sensors convert physical variables into measurable electrical signals that a microcontroller can process.",
    },
  },
  "software-developer": {
    titleEn: "Software Developer",
    descEn: "Learn to build interactive web and mobile applications",
    durationEn: "3 mins",
    lessonTitleEn: "Introduction to Modern Web Development",
    lessonDescEn:
      "Master web development foundations: semantic HTML structuring, modern CSS styling, and client-side interactivity with JavaScript.",
    mentorEn: "Senior Software Engineer & RPL Faculty",
    topicsEn: [
      "Modern Web Architecture with Next.js & Tailwind CSS",
      "Core Programming Logic & RESTful API Consumption",
      "Hands-on Interactive Web Application Project",
    ],
    quizEn: {
      triggerSeconds: 50,
      question: "What is the primary purpose of the <html> tag in web documents?",
      options: [
        "To define the web page header title",
        "To embed images on the page",
        "To wrap and represent the entire root HTML document",
        "To create a numbered list",
      ],
      correctIndex: 2,
      explanation:
        "The <html> element acts as the root container holding all other nested elements of the webpage.",
    },
  },
  "cloud-engineer": {
    titleEn: "Cloud Engineer",
    descEn: "Understand cloud computing models and infrastructure",
    durationEn: "3 mins",
    lessonTitleEn: "Cloud Computing Fundamentals & Virtualization",
    lessonDescEn:
      "Understand cloud virtualization architectures, IaaS/PaaS/SaaS delivery models, and managing scalable virtual machines for production systems.",
    mentorEn: "AWS / Google Cloud Certified Faculty",
    topicsEn: [
      "Cloud Infrastructure & Virtualization Principles",
      "Deploying Virtual Machines, Object Storage & Networks",
      "Reliability, High Availability & Auto-scaling",
    ],
    quizEn: {
      triggerSeconds: 50,
      question: "What is a key benefit of Cloud Computing over traditional on-premise hardware?",
      options: [
        "Elastic scalability and pay-as-you-go pricing model",
        "Requires building a custom dedicated server room at home",
        "Works without any internet connection",
        "Can only be accessed from one single physical PC",
      ],
      correctIndex: 0,
      explanation:
        "Cloud computing provides on-demand resource provisioning and pay-as-you-go flexibility without upfront hardware costs.",
    },
  },
  "network-system-admin": {
    titleEn: "Network System Administrator",
    descEn: "Learn server operations and enterprise systems management",
    durationEn: "3 mins",
    lessonTitleEn: "Network Systems Administration & Linux Servers",
    lessonDescEn:
      "Learn essential Linux terminal commands, user access privilege configuration, core network services (DNS/DHCP), and proactive system maintenance.",
    mentorEn: "SKOMDA TJAT Enterprise Systems Instructor",
    topicsEn: [
      "Linux Server Administration & Command Line Interface",
      "User Management, Permissions & Server Hardening",
      "System Performance Monitoring & Network Troubleshooting",
    ],
    quizEn: {
      triggerSeconds: 50,
      question: "Which Linux terminal command is used to display files and folders in the current working directory?",
      options: [
        "ls",
        "delete",
        "shutdown",
        "exit",
      ],
      correctIndex: 0,
      explanation:
        "The ls command lists the contents of a directory in Unix and Linux operating systems.",
    },
  },
  "visual-designer": {
    titleEn: "Visual Communication Designer",
    descEn: "Create impactful, clear visual communications and UI assets",
    durationEn: "3 mins",
    lessonTitleEn: "Principles of Visual Communication & UI Design",
    lessonDescEn:
      "Learn visual hierarchy, color theory, grid systems, and typography harmony so every creative asset delivers its intended message clearly and engagingly.",
    mentorEn: "Creative Design Lead SKOMDA",
    topicsEn: [
      "UI/UX Fundamentals, Layout Composition & Grids",
      "Color Harmony, Typography Hierarchy & Scale",
      "Interactive Digital Posters & Promotional Media",
    ],
    quizEn: {
      triggerSeconds: 50,
      question: "What is the primary role of typographic hierarchy in interface design?",
      options: [
        "To guide the viewer's eyes to the most important information first",
        "To fill up all empty spaces on the layout canvas",
        "To make all text elements have identical sizing",
        "To randomize font colors across the page",
      ],
      correctIndex: 0,
      explanation:
        "Typographic hierarchy provides a clear structure that helps readers prioritize headings, body text, and call-to-actions effortlessly.",
    },
  },
  "network-infrastructure": {
    titleEn: "Network Infrastructure Engineer",
    descEn: "Build enterprise network cabling and routing infrastructure",
    durationEn: "3 mins",
    lessonTitleEn: "Enterprise Networking & Fiber Optic Fundamentals",
    lessonDescEn:
      "Explore fiber optic cable transmission physics, enterprise routers and switches, and routing configurations connecting campus network backbones.",
    mentorEn: "SKOMDA Fiber Optic & Routing Specialist",
    topicsEn: [
      "Campus Network Topology & Cabling Architecture",
      "Enterprise Routing & Managed Switch Configuration",
      "Fiber Optic Theory & High-Precision Splicing",
    ],
    quizEn: {
      triggerSeconds: 50,
      question: "What medium is used by Fiber Optic cables to transmit data signals?",
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
      triggerSeconds: 50,
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
  const effectiveQuizzes: QuizItem[] =
    item.quizzes && item.quizzes.length > 0
      ? item.quizzes
      : [{ ...item.quiz, triggerSeconds: item.quiz?.triggerSeconds || 50 }];

  if (!isEn) {
    return {
      ...item,
      quizzes: effectiveQuizzes,
      quiz: effectiveQuizzes[0],
    };
  }
  const trans = VIRTUAL_CLASS_DATA_EN[item.id];
  if (!trans) {
    return {
      ...item,
      quizzes: effectiveQuizzes,
      quiz: effectiveQuizzes[0],
    };
  }
  return {
    ...item,
    title: trans.titleEn || item.title,
    desc: trans.descEn || item.desc,
    duration: trans.durationEn || item.duration,
    lessonTitle: trans.lessonTitleEn || item.lessonTitle,
    lessonDesc: trans.lessonDescEn || item.lessonDesc,
    mentor: trans.mentorEn || item.mentor,
    topics: trans.topicsEn || item.topics,
    quiz: trans.quizEn ? { ...trans.quizEn, triggerSeconds: effectiveQuizzes[0]?.triggerSeconds || 50 } : effectiveQuizzes[0],
    quizzes: effectiveQuizzes.map((q, idx) => {
      if (idx === 0 && trans.quizEn) {
        return {
          ...trans.quizEn,
          triggerSeconds: q.triggerSeconds || 50,
        };
      }
      return q;
    }),
  };
}
