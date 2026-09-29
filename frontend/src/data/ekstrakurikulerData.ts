export interface EkstrakurikulerItem {
  id: string;
  name: string;
  category: "Bela Negara & Kepemimpinan" | "Akademik & Bahasa" | "Olahraga & Bela Diri" | "Seni & Kreativitas" | "Teknologi & Gaming";
  description: string;
  image?: string;
}

export const EKSKUL_CATEGORIES = [
  "Semua",
  "Bela Negara & Kepemimpinan",
  "Akademik & Bahasa",
  "Olahraga & Bela Diri",
  "Seni & Kreativitas",
  "Teknologi & Gaming",
] as const;

export const EKSKUL_LIST: EkstrakurikulerItem[] = [
  {
    id: "pramuka",
    name: "Pramuka",
    category: "Bela Negara & Kepemimpinan",
    description:
      "Kegiatan untuk melatih kedisiplinan, kemandirian, kerja sama, dan tanggung jawab siswa melalui kegiatan kepramukaan dan aktivitas kelompok.",
    image: "/images/program/ekstrakurikuler/ekskul-pramuka.png",
  },
  {
    id: "paskibra",
    name: "Paskibra",
    category: "Bela Negara & Kepemimpinan",
    description:
      "Kegiatan yang berfokus pada latihan baris-berbaris, tata upacara, kedisiplinan, kekompakan, dan pembentukan sikap tanggung jawab.",
    image: "/images/program/ekstrakurikuler/ekskul-paskibra.png",
  },
  {
    id: "kir",
    name: "KIR (Karya Ilmiah Remaja)",
    category: "Akademik & Bahasa",
    description:
      "Kegiatan bagi siswa yang tertarik dengan penelitian dan pengembangan ide. Siswa dapat belajar mencari informasi, menyusun karya ilmiah, melakukan percobaan, dan mempresentasikan hasilnya.",
    image: "/images/program/ekstrakurikuler/ekskul-kir.png",
  },
  {
    id: "pmr",
    name: "PMR (Palang Merah Remaja)",
    category: "Bela Negara & Kepemimpinan",
    description:
      "Kegiatan yang mengenalkan siswa pada dasar-dasar pertolongan pertama, kesehatan, serta kepedulian terhadap lingkungan dan sesama.",
    image: "/images/program/ekstrakurikuler/ekskul-pmr.png",
  },
  {
    id: "voli",
    name: "Voli",
    category: "Olahraga & Bela Diri",
    description:
      "Kegiatan olahraga yang melatih kemampuan dasar permainan voli, kebugaran, kerja sama tim, dan sportivitas melalui latihan bersama.",
    image: "/images/program/ekstrakurikuler/ekskul-voli.png",
  },
  {
    id: "futsal",
    name: "Futsal",
    category: "Olahraga & Bela Diri",
    description:
      "Kegiatan olahraga yang menjadi wadah bagi siswa untuk bermain dan mengembangkan kemampuan futsal. Latihan meliputi teknik dasar, permainan tim, serta menjaga kebugaran.",
    image: "/images/program/ekstrakurikuler/ekskul-futsal.png",
  },
  {
    id: "bdi",
    name: "BDI (Badan Dakwah Islam)",
    category: "Bela Negara & Kepemimpinan",
    description:
      "Kegiatan yang menjadi wadah siswa untuk mengikuti aktivitas keislaman di sekolah, seperti kajian, kegiatan keagamaan, dan peringatan hari besar Islam.",
    image: "/images/program/ekstrakurikuler/ekskul-bdi.png",
  },
  {
    id: "basket",
    name: "Basket",
    category: "Olahraga & Bela Diri",
    description:
      "Kegiatan olahraga untuk siswa yang memiliki minat pada permainan basket. Latihan mencakup teknik dasar, permainan tim, kebugaran, dan sportivitas.",
    image: "/images/program/ekstrakurikuler/ekskul-basket.png",
  },
  {
    id: "musik",
    name: "Musik",
    category: "Seni & Kreativitas",
    description:
      "Wadah bagi siswa yang memiliki minat di bidang musik untuk berlatih vokal maupun alat musik, mengembangkan kreativitas, dan berpartisipasi dalam kegiatan atau acara sekolah.",
    image: "/images/program/ekstrakurikuler/ekskul-musik.png",
  },
  {
    id: "english-club",
    name: "English Club",
    category: "Akademik & Bahasa",
    description:
      "Kegiatan untuk meningkatkan kemampuan berbahasa Inggris melalui latihan percakapan, vocabulary, speaking, dan aktivitas lainnya yang menggunakan bahasa Inggris.",
  },
  {
    id: "e-sport",
    name: "E-Sport",
    category: "Teknologi & Gaming",
    description:
      "Kegiatan bagi siswa yang memiliki minat pada permainan elektronik kompetitif. Selain kemampuan bermain, kegiatan juga melatih komunikasi, kerja sama tim, strategi, dan sportivitas.",
    image: "/images/program/ekstrakurikuler/ekskul-esport.png",
  },
  {
    id: "silat",
    name: "Silat",
    category: "Olahraga & Bela Diri",
    description:
      "Kegiatan bela diri yang melatih teknik dasar pencak silat, kebugaran, kedisiplinan, dan pengendalian diri melalui latihan rutin.",
    image: "/images/program/ekstrakurikuler/ekskul-silat.png",
  },
];
