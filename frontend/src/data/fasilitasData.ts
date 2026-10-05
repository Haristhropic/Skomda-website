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
      "Ruang kelas berpendingin udara (AC) untuk kegiatan belajar mengajar sehari-hari, dilengkapi papan tulis, meja, kursi siswa, serta layar TV atau proyektor untuk presentasi materi pelajaran.",
    specs: ["Pendingin Ruangan (AC)", "TV Layar Datar / Proyektor", "Meja dan Kursi Siswa", "Akses Wi-Fi Sekolah"],
    image: "/images/tentang-kami/fasilitas/fasilitas-ruang-kelas.png",
    badge: "Ruang Belajar",
  },
  {
    id: "gedung-rps-2-lantai",
    name: "Gedung RPS (Ruang Praktik Siswa)",
    category: "Ruang Belajar & RPS",
    description:
      "Gedung dua lantai yang digunakan untuk kegiatan praktikum kejuruan, pengerjaan tugas proyek, dan simulasi alur kerja praktik siswa.",
    specs: ["Gedung 2 Lantai", "Ruang Praktik Kejuruan", "Area Pengerjaan Proyek Siswa", "Meja dan Peralatan Praktikum"],
    image: "/images/tentang-kami/fasilitas/fasilitas-rps.jpg",
    badge: "Gedung Praktik",
  },
  {
    id: "aula-videotron",
    name: "Aula Sekolah",
    category: "Sarana Umum & Olahraga",
    description:
      "Ruangan serbaguna berkapasitas besar untuk pertemuan wali murid, pengarahan sekolah, upacara dalam ruangan saat cuaca hujan, dan panggung acara siswa.",
    specs: ["Layar Videotron / Proyektor", "Panggung dan Sound System", "Kursi Pertemuan", "Area Luas Serbaguna"],
    image: "/images/tentang-kami/fasilitas/fasilitas-aula.png",
    badge: "Aula Pertemuan",
  },
  {
    id: "lab-fiber-optic",
    name: "Laboratorium Fiber Optic (FO)",
    category: "Laboratorium Kejuruan",
    description:
      "Laboratorium praktikum jurusan TJAT untuk latihan penyambungan kabel fiber optik dengan fusion splicer, pengukuran redaman kabel optik, dan pengenalan perangkat telekomunikasi.",
    specs: ["Fusion Splicer", "Optical Power Meter & OTDR", "Kabel & Konektor Fiber Optic", "Alat Kupas & Potong Fiber (Cleaver)"],
    image: "/images/tentang-kami/fasilitas/fasilitas-lab-fiber-optic.jpg",
    badge: "Praktik TJAT",
  },
  {
    id: "lab-ai",
    name: "Laboratorium AI",
    category: "Laboratorium Kejuruan",
    description:
      "Ruang komputer yang digunakan untuk praktikum pengenalan kecerdasan buatan, latihan pemrograman dasar machine learning, dan pengolahan data siswa.",
    specs: ["Komputer PC Praktik", "Koneksi Jaringan Komputer", "Proyektor / Layar Pengajar", "Software Pembelajaran Pemrograman"],
    image: "/images/tentang-kami/fasilitas/fasilitas-lab-ai.jpg",
    badge: "Lab Komputer",
  },
  {
    id: "lab-iot",
    name: "Laboratorium Internet of Things (IoT)",
    category: "Laboratorium Kejuruan",
    description:
      "Ruang laboratorium untuk merakit rangkaian elektronika sederhana, memprogram mikrokontroler (Arduino dan ESP32), serta menguji fungsi sensor dan aktuator.",
    specs: ["Modul Mikrokontroler (Arduino, ESP32)", "Modul Sensor dan Komponen Elektronika", "Alat Solder dan Perkakas Praktik", "Komputer untuk Pemrograman Alat"],
    image: "/images/tentang-kami/fasilitas/fasilitas-lab-iot.jpg",
    badge: "Praktik IoT",
  },
  {
    id: "lab-jaringan",
    name: "Laboratorium Jaringan Komputer",
    category: "Laboratorium Kejuruan",
    description:
      "Laboratorium untuk praktikum simulasi topologi jaringan, konfigurasi router dan switch, pembuatan kabel LAN (crimping), serta pengaturan server lokal.",
    specs: ["Router dan Switch Praktik", "Rak Server Praktik", "Komputer PC untuk Konfigurasi", "Kabel UTP dan Crimping Tools"],
    image: "/images/tentang-kami/fasilitas/fasilitas-lab-jaringan.jpg",
    badge: "Praktik Jaringan",
  },
  {
    id: "lab-komputer",
    name: "Laboratorium Komputer",
    category: "Laboratorium Kejuruan",
    description:
      "Ruang komputer ber-AC yang digunakan untuk mata pelajaran pemrograman, desain grafis, simulasi kejuruan, dan pelaksanaan asesmen berbasis komputer.",
    specs: ["Unit PC Komputer Siswa", "Jaringan Lokal (LAN) dan Internet", "Pendingin Ruangan (AC)", "Proyektor Pembelajaran"],
    image: "/images/tentang-kami/fasilitas/fasilitas-lab-komputer.png",
    badge: "Lab Komputer",
  },
  {
    id: "outdoor-class",
    name: "Outdoor Class",
    category: "Ruang Belajar & RPS",
    description:
      "Area terbuka di lingkungan sekolah yang teduh untuk belajar santai, diskusi kelompok di luar ruangan kelas, maupun tempat istirahat siswa.",
    specs: ["Meja dan Bangku Luar Ruangan", "Area Teduh dan Asri", "Tempat Diskusi Santai", "Akses Wi-Fi Sekolah"],
    image: "/images/tentang-kami/fasilitas/fasilitas-outdoor-class.png",
    badge: "Area Terbuka",
  },
  {
    id: "kantin-cashless",
    name: "Kantin Sekolah",
    category: "Sarana Umum & Olahraga",
    description:
      "Area kantin sekolah yang bersih dengan beberapa stan makanan dan minuman bagi siswa serta guru pada saat jam istirahat sekolah.",
    specs: ["Stan Penjual Makanan dan Minuman", "Meja dan Kursi Makan Bersama", "Tempat Cuci Tangan", "Area Bersih dan Terjaga"],
    image: "/images/tentang-kami/fasilitas/fasilitas-kantin.png",
    badge: "Area Kantin",
  },
  {
    id: "lapangan-olahraga-utama",
    name: "Lapangan Olahraga Utama",
    category: "Sarana Umum & Olahraga",
    description:
      "Lapangan serbaguna di halaman utama sekolah yang digunakan untuk upacara bendera, apel pagi, senam bersama, serta olahraga futsal dan voli.",
    specs: ["Tiang Bendera Upacara", "Gawang Futsal dan Tiang Voli", "Garis Lapangan Olahraga", "Area Terbuka Luas"],
    image: "/images/tentang-kami/fasilitas/fasilitas-lapangan-utama.jpg",
    badge: "Lapangan Utama",
  },
  {
    id: "lapangan-basket",
    name: "Lapangan Basket",
    category: "Sarana Umum & Olahraga",
    description:
      "Lapangan basket luar ruangan untuk kegiatan pelajaran olahraga, latihan ekstrakurikuler basket, serta pertandingan olahraga antarkelas.",
    specs: ["Sepasang Ring Basket", "Garis Batas Lapangan Basket", "Lantai Semen Rata", "Penerangan Lapangan"],
    image: "/images/tentang-kami/fasilitas/fasilitas-lapangan-basket.png",
    badge: "Lapangan Basket",
  },
  {
    id: "perpustakaan-digital",
    name: "Perpustakaan Sekolah",
    category: "Sarana Umum & Olahraga",
    description:
      "Ruang perpustakaan yang menyediakan buku pelajaran kejuruan, buku referensi umum, dan buku bacaan, dilengkapi meja baca untuk belajar mandiri.",
    specs: ["Koleksi Buku Pelajaran dan Umum", "Meja dan Kursi Membaca", "Ruangan Tenang Ber-AC", "Meja Petugas Peminjaman Buku"],
    image: "/images/tentang-kami/fasilitas/fasilitas-perpustakaan.png",
    badge: "Ruang Baca",
  },
  {
    id: "ruang-uks",
    name: "Ruang UKS (Usaha Kesehatan Sekolah)",
    category: "Sarana Umum & Olahraga",
    description:
      "Ruang kesehatan sekolah untuk pertolongan pertama bagi siswa atau warga sekolah yang sakit atau terluka saat kegiatan di sekolah.",
    specs: ["Tempat Tidur Istirahat", "Kotak Obat P3K Dasar", "Pengukur Tinggi dan Timbangan Badan", "Bimbingan Pembina PMR"],
    image: "/images/tentang-kami/fasilitas/fasilitas-uks.png",
    badge: "Ruang UKS",
  },
  {
    id: "smc-center",
    name: "SMC (Student Media Center)",
    category: "Ruang Belajar & RPS",
    description:
      "Ruang kerja bagi tim media dan jurnalisme siswa untuk mendokumentasikan kegiatan sekolah melalui foto dan video, serta mengelola publikasi informasi siswa.",
    specs: ["Komputer untuk Editing Foto dan Video", "Kamera dan Perlengkapan Dokumentasi", "Mikrofon Audio", "Area Diskusi Tim Media"],
    image: "/images/tentang-kami/fasilitas/fasilitas-smc.png",
    badge: "Ruang Media",
  },
  {
    id: "gedung-kampus-skomda",
    name: "Gedung SMK Telkom Sidoarjo",
    category: "Sarana Umum & Olahraga",
    description:
      "Kompleks bangunan sekolah yang mencakup ruang administrasi tata usaha, ruang kepala sekolah dan guru, lobi penerimaan tamu, serta area parkir kendaraan.",
    specs: ["Pos Keamanan Sekolah", "Area Parkir Guru dan Siswa", "Lobi Administrasi Tata Usaha", "Akses Pintu Masuk Utama"],
    image: "/images/tentang-kami/fasilitas/fasilitas-gedung-smk.png",
    badge: "Gedung Utama",
  },
];

export const FASILITAS_TRANSLATIONS_EN: Record<
  string,
  { nameEn: string; descriptionEn: string; badgeEn?: string }
> = {
  "ruang-kelas-modern": {
    nameEn: "Classrooms",
    descriptionEn:
      "Air-conditioned classrooms for daily learning activities, equipped with whiteboards, student desks, and a flat-screen TV or projector for lesson presentations.",
    badgeEn: "Learning Space",
  },
  "gedung-rps-2-lantai": {
    nameEn: "Vocational Practice Building (RPS)",
    descriptionEn:
      "A two-story building used for vocational practicums, student project work, and practical work simulations.",
    badgeEn: "Practicum Building",
  },
  "aula-videotron": {
    nameEn: "School Hall",
    descriptionEn:
      "A multi-purpose hall used for parent meetings, school briefings, indoor assemblies, and student events.",
    badgeEn: "Assembly Hall",
  },
  "lab-fiber-optic": {
    nameEn: "Fiber Optic Laboratory",
    descriptionEn:
      "A vocational lab for the TJAT program to practice fiber optic splicing with fusion splicers, optical cable measurement, and telecom equipment fundamentals.",
    badgeEn: "TJAT Practicum",
  },
  "lab-ai": {
    nameEn: "AI Laboratory",
    descriptionEn:
      "A computer lab used for introductory AI practicums, basic machine learning programming exercises, and student data processing.",
    badgeEn: "Computer Lab",
  },
  "lab-iot": {
    nameEn: "IoT Laboratory",
    descriptionEn:
      "A laboratory room for assembling basic electronic circuits, programming microcontrollers (Arduino and ESP32), and testing sensors and actuators.",
    badgeEn: "IoT Practicum",
  },
  "lab-jaringan": {
    nameEn: "Computer Networking Laboratory",
    descriptionEn:
      "A lab for network topology simulations, router and switch configuration, LAN cable crimping, and local server setup.",
    badgeEn: "Networking Lab",
  },
  "lab-komputer": {
    nameEn: "Computer Laboratory",
    descriptionEn:
      "An air-conditioned computer room used for coding classes, graphic design, vocational simulations, and computer-based assessments.",
    badgeEn: "Computer Lab",
  },
  "outdoor-class": {
    nameEn: "Outdoor Learning Area",
    descriptionEn:
      "A shaded open space on campus for casual group discussions, studying outside the classroom, or relaxing between classes.",
    badgeEn: "Open Area",
  },
  "kantin-cashless": {
    nameEn: "School Cafeteria",
    descriptionEn:
      "A clean school cafeteria with food and drink stalls for students and teachers during break times.",
    badgeEn: "Cafeteria",
  },
  "lapangan-olahraga-utama": {
    nameEn: "Main Sports Field",
    descriptionEn:
      "A multi-purpose outdoor field in the main courtyard used for flag ceremonies, morning assemblies, and sports such as futsal and volleyball.",
    badgeEn: "Sports Field",
  },
  "lapangan-basket": {
    nameEn: "Basketball Court",
    descriptionEn:
      "An outdoor basketball court for physical education classes, basketball extracurricular practice, and inter-class games.",
    badgeEn: "Basketball Court",
  },
  "perpustakaan-digital": {
    nameEn: "School Library",
    descriptionEn:
      "A quiet library providing vocational textbooks, general reference books, and reading materials, equipped with study tables.",
    badgeEn: "Reading Room",
  },
  "ruang-uks": {
    nameEn: "School Health Clinic (UKS)",
    descriptionEn:
      "A first-aid room providing rest beds, basic first-aid supplies, and medical assistance for students and staff who feel unwell.",
    badgeEn: "Health Clinic",
  },
  "smc-center": {
    nameEn: "Student Media Center (SMC)",
    descriptionEn:
      "A workspace for student journalists and media club members to document school events with photos and videos, and produce media publications.",
    badgeEn: "Media Studio",
  },
  "gedung-kampus-skomda": {
    nameEn: "SMK Telkom Sidoarjo School Building",
    descriptionEn:
      "The school building complex housing administrative offices, principal and teacher rooms, visitor reception, and parking areas.",
    badgeEn: "School Building",
  },
};

export function getLocalizedFasilitas(item: FasilitasItem, isEn: boolean): FasilitasItem {
  if (!isEn) return item;
  const trans =
    FASILITAS_TRANSLATIONS_EN[item.id] ||
    Object.values(FASILITAS_TRANSLATIONS_EN).find(
      (t) => t.nameEn.toLowerCase() === item.name.toLowerCase()
    );

  return {
    ...item,
    name: trans?.nameEn || (item as any).nameEn || item.name,
    description: trans?.descriptionEn || (item as any).descriptionEn || item.description,
    badge: trans?.badgeEn || item.badge,
  };
}
