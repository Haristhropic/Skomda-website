export interface FasilitasItem {
  id: string;
  name: string;
  category: "Ruang Belajar & RPS" | "Laboratorium Kejuruan" | "Sarana Umum & Olahraga";
  description: string;
  specs: string[];
  image: string;
  badge: string;
}

export const FASILITAS_CATEGORIES = [
  "Semua",
  "Ruang Belajar & RPS",
  "Laboratorium Kejuruan",
  "Sarana Umum & Olahraga",
] as const;

export const FASILITAS_LIST: FasilitasItem[] = [
  {
    id: "ruang-kelas-modern",
    name: "Ruang Kelas",
    category: "Ruang Belajar & RPS",
    description:
      "Ruang kelas untuk kegiatan belajar mengajar sehari-hari yang dilengkapi dengan pendingin ruangan, layar presentasi atau TV, meja, kursi, dan papan tulis.",
    specs: ["Pendingin Ruangan (AC)", "Smart TV / Layar Presentasi", "Meja dan Kursi Siswa", "Koneksi Wi-Fi"],
    image: "/images/tentang-kami/fasilitas/fasilitas-ruang-kelas.png",
    badge: "Ruang Belajar",
  },
  {
    id: "gedung-rps-2-lantai",
    name: "Gedung RPS (Ruang Praktik Siswa)",
    category: "Ruang Belajar & RPS",
    description:
      "Gedung dua lantai yang digunakan untuk kegiatan praktikum kejuruan, pengerjaan proyek siswa, dan simulasi kerja kejuruan.",
    specs: ["Bangunan 2 Lantai", "Ruang Praktik Kejuruan", "Area Pengerjaan Proyek", "Peralatan Praktikum"],
    image: "/images/tentang-kami/fasilitas/fasilitas-rps.jpg",
    badge: "Gedung Praktik",
  },
  {
    id: "aula-videotron",
    name: "Aula Sekolah",
    category: "Sarana Umum & Olahraga",
    description:
      "Ruang pertemuan serbaguna untuk kegiatan sekolah seperti pertemuan wali murid, seminar, upacara dalam ruangan, dan acara siswa.",
    specs: ["Layar Videotron / Proyektor", "Panggung Acara", "Sound System", "Kapasitas Ratusan Siswa"],
    image: "/images/tentang-kami/fasilitas/fasilitas-aula.png",
    badge: "Aula Pertemuan",
  },
  {
    id: "lab-fiber-optic",
    name: "Laboratorium Fiber Optic (FO)",
    category: "Laboratorium Kejuruan",
    description:
      "Laboratorium praktikum jurusan TJAT untuk belajar penyambungan kabel fiber optik, pengukuran redaman jaringan, dan instalasi jaringan telekomunikasi.",
    specs: ["Fusion Splicer", "OTDR dan Optical Power Meter", "Kabel dan Aksesoris Fiber Optic", "Trainer Jaringan Akses"],
    image: "/images/tentang-kami/fasilitas/fasilitas-rps.jpg",
    badge: "Praktik TJAT",
  },
  {
    id: "lab-ai",
    name: "Laboratorium Artificial Intelligence (AI)",
    category: "Laboratorium Kejuruan",
    description:
      "Ruangan komputer khusus untuk pembelajaran dan eksperimen kecerdasan buatan, pemodelan data, serta pemrograman tingkat lanjut.",
    specs: ["Komputer Spesifikasi Tinggi", "Perangkat Display Presentasi", "Akses Jaringan Lokal dan Internet", "Software Pembelajaran AI"],
    image: "/images/tentang-kami/fasilitas/fasilitas-outdoor-class.png",
    badge: "Riset & Komputasi",
  },
  {
    id: "lab-iot",
    name: "Laboratorium Internet of Things (IoT)",
    category: "Laboratorium Kejuruan",
    description:
      "Ruang praktik untuk merakit dan menguji rangkaian mikrokontroler, modul sensor elektronika, serta pemrograman perangkat cerdas IoT.",
    specs: ["Modul Mikrokontroler (Arduino, ESP32)", "Set Sensor dan Aktuator", "Peralatan Solder dan Perakitan", "Workstation Pengujian"],
    image: "/images/tentang-kami/fasilitas/fasilitas-rps.jpg",
    badge: "Praktik IoT",
  },
  {
    id: "lab-jaringan",
    name: "Laboratorium Jaringan Komputer",
    category: "Laboratorium Kejuruan",
    description:
      "Laboratorium praktikum untuk simulasi konfigurasi jaringan, pengaturan router, switch, server lokal, dan perakitan kabel jaringan LAN.",
    specs: ["Router dan Switch Jaringan", "Rack Server Praktik", "Perangkat Komputer Lab", "Kabel UTP dan Crimping Tools"],
    image: "/images/tentang-kami/fasilitas/fasilitas-rps.jpg",
    badge: "Praktik Jaringan",
  },
  {
    id: "lab-komputer",
    name: "Laboratorium Komputer",
    category: "Laboratorium Kejuruan",
    description:
      "Ruang komputer ber-AC yang digunakan untuk pembelajaran coding, desain grafis, praktikum aplikasi produktivitas, dan ujian berbasis komputer.",
    specs: ["Komputer PC Lengkap", "Koneksi Jaringan LAN dan Internet", "Pendingin Ruangan (AC)", "Proyektor Pengajar"],
    image: "/images/tentang-kami/fasilitas/fasilitas-lab-komputer.png",
    badge: "Lab Komputer",
  },
  {
    id: "outdoor-class",
    name: "Outdoor Class",
    category: "Ruang Belajar & RPS",
    description:
      "Area terbuka di lingkungan sekolah yang bisa digunakan siswa untuk belajar santai, berdiskusi kelompok di luar kelas, atau beristirahat.",
    specs: ["Meja dan Kursi Duduk Terbuka", "Lingkungan Asri Luar Ruang", "Area Diskusi Santai", "Akses Wi-Fi Sekolah"],
    image: "/images/tentang-kami/fasilitas/fasilitas-outdoor-class.png",
    badge: "Area Terbuka",
  },
  {
    id: "kantin-cashless",
    name: "Kantin Sekolah",
    category: "Sarana Umum & Olahraga",
    description:
      "Tempat istirahat bagi siswa dan guru untuk membeli makanan serta minuman dengan berbagai pilihan menu jajanan dan makan siang.",
    specs: ["Stan Penjual Makanan dan Minuman", "Meja dan Kursi Makan Bersama", "Tempat Cuci Tangan", "Area Bersih dan Nyaman"],
    image: "/images/tentang-kami/fasilitas/fasilitas-kantin.png",
    badge: "Area Kantin",
  },
  {
    id: "lapangan-olahraga-utama",
    name: "Lapangan Utama",
    category: "Sarana Umum & Olahraga",
    description:
      "Lapangan terbuka di tengah sekolah yang digunakan untuk upacara bendera hari Senin, kegiatan olahraga, senam bersama, dan ekstrakurikuler.",
    specs: ["Tiang Bendera Upacara", "Garis Lapangan Olahraga", "Gawang Futsal dan Tiang Voli", "Area Upacara Luas"],
    image: "/images/tentang-kami/fasilitas/fasilitas-lapangan-utama.jpg",
    badge: "Lapangan Serbaguna",
  },
  {
    id: "lapangan-basket",
    name: "Lapangan Basket",
    category: "Sarana Umum & Olahraga",
    description:
      "Lapangan basket yang digunakan untuk kegiatan mata pelajaran olahraga, latihan tim basket sekolah, dan pertandingan antar kelas.",
    specs: ["Ring Basket di Dua Sisi", "Garis Lapangan Basket", "Lantai Lapangan Terbuka", "Penerangan Olahraga"],
    image: "/images/tentang-kami/fasilitas/fasilitas-lapangan-basket.png",
    badge: "Fasilitas Olahraga",
  },
  {
    id: "perpustakaan-digital",
    name: "Perpustakaan Sekolah",
    category: "Sarana Umum & Olahraga",
    description:
      "Ruang membaca yang menyediakan buku pelajaran kejuruan, buku referensi umum, karya fiksi, serta tempat tenang untuk membaca dan belajar.",
    specs: ["Koleksi Buku Pelajaran dan Umum", "Meja Baca Siswa", "Ruangan Tenang Ber-AC", "Area Peminjaman Buku"],
    image: "/images/tentang-kami/fasilitas/fasilitas-perpustakaan.png",
    badge: "Ruang Baca",
  },
  {
    id: "ruang-uks",
    name: "Ruang UKS (Usaha Kesehatan Sekolah)",
    category: "Sarana Umum & Olahraga",
    description:
      "Ruangan untuk penanganan pertama bagi siswa atau warga sekolah yang sakit atau membutuhkan istirahat saat kegiatan di sekolah.",
    specs: ["Tempat Tidur Istirahat", "Kotak P3K dan Obat-obatan Dasar", "Pengukur Tinggi dan Berat Badan", "Bimbingan Pembina PMR"],
    image: "/images/tentang-kami/fasilitas/fasilitas-uks.png",
    badge: "Pelayanan Kesehatan",
  },
  {
    id: "smc-center",
    name: "SMC (Student Media Center)",
    category: "Ruang Belajar & RPS",
    description:
      "Ruang kerja khusus untuk tim media sekolah yang mengurus dokumentasi kegiatan, foto, video, dan publikasi sosial media sekolah.",
    specs: ["Komputer Editing Foto dan Video", "Peralatan Kamera dan Tripod", "Microphone dan Headset", "Area Diskusi Konten"],
    image: "/images/tentang-kami/fasilitas/fasilitas-smc.png",
    badge: "Ruang Media",
  },
  {
    id: "gedung-kampus-skomda",
    name: "Gedung SMK Telkom Sidoarjo",
    category: "Sarana Umum & Olahraga",
    description:
      "Kompleks bangunan utama SMK Telkom Sidoarjo yang menaungi ruang administrasi, tata usaha, ruang kepala sekolah, dan akses antar gedung.",
    specs: ["Pos Keamanan dan Satpam", "Area Parkir Siswa dan Guru", "Lobi Informasi dan Tata Usaha", "Akses Gerbang Utama"],
    image: "/images/tentang-kami/fasilitas/fasilitas-gedung-smk.png",
    badge: "Gedung Utama",
  },
];
