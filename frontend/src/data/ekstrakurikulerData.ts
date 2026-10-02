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
    image: "/images/program/ekstrakurikuler/ekskul-english-club.jpg",
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

export const EKSKUL_TRANSLATIONS_EN: Record<
  string,
  { nameEn: string; descriptionEn: string; categoryEn?: string }
> = {
  pramuka: {
    nameEn: "Scouts (Pramuka)",
    descriptionEn:
      "Activities designed to build discipline, self-reliance, teamwork, and leadership responsibility through scouting adventures and collaborative group projects.",
    categoryEn: "National Defense & Leadership",
  },
  paskibra: {
    nameEn: "Flag Raising Troop (Paskibra)",
    descriptionEn:
      "Activities focusing on precision drill marching, ceremonial protocols, teamwork, physical discipline, and character building.",
    categoryEn: "National Defense & Leadership",
  },
  kir: {
    nameEn: "Youth Scientific Club (KIR)",
    descriptionEn:
      "A platform for students interested in applied research and scientific innovation, fostering data discovery, experiment design, paper writing, and symposium presentation.",
    categoryEn: "Academic & Language",
  },
  pmr: {
    nameEn: "Youth Red Cross (PMR)",
    descriptionEn:
      "Training students in vital first-aid skills, emergency health responses, community humanitarian services, and environmental care.",
    categoryEn: "National Defense & Leadership",
  },
  voli: {
    nameEn: "Volleyball Club",
    descriptionEn:
      "Sports program developing fundamental volleyball techniques, physical fitness, tactical team coordination, and sportsmanship.",
    categoryEn: "Sports & Martial Arts",
  },
  futsal: {
    nameEn: "Futsal Club",
    descriptionEn:
      "Athletic extracurricular developing ball control, strategic team formations, tactical play, endurance, and competitive tournament readiness.",
    categoryEn: "Sports & Martial Arts",
  },
  bdi: {
    nameEn: "Islamic Studies Community (BDI)",
    descriptionEn:
      "Extracurricular fostering Islamic spiritual growth, religious study circles, moral development, and organizing Islamic festive commemorations.",
    categoryEn: "National Defense & Leadership",
  },
  basket: {
    nameEn: "Basketball Club",
    descriptionEn:
      "Competitive basketball program developing shooting, dribbling, offensive/defensive strategies, athletic stamina, and teamwork.",
    categoryEn: "Sports & Martial Arts",
  },
  musik: {
    nameEn: "Music & Band",
    descriptionEn:
      "Creative music collective for students exploring vocal training, instrument mastery (drums, guitar, keyboard, bass), songwriting, and performance.",
    categoryEn: "Arts & Creativity",
  },
  "english-club": {
    nameEn: "English Club",
    descriptionEn:
      "Interactive English language society practicing public speaking, debate, conversational fluency, storytelling, and international communication skills.",
    categoryEn: "Academic & Language",
  },
  "e-sport": {
    nameEn: "Esports Club",
    descriptionEn:
      "Competitive gaming team developing strategic coordination, rapid communication, analytical game sense, and professional esports ethics.",
    categoryEn: "Technology & Gaming",
  },
  silat: {
    nameEn: "Pencak Silat Martial Arts",
    descriptionEn:
      "Traditional Indonesian martial arts training focusing on physical self-defense techniques, agility, mental discipline, and cultural heritage.",
    categoryEn: "Sports & Martial Arts",
  },
};

export function getLocalizedEkskul(item: EkstrakurikulerItem, isEn: boolean): EkstrakurikulerItem {
  if (!isEn) return item;
  const trans =
    EKSKUL_TRANSLATIONS_EN[item.id] ||
    Object.values(EKSKUL_TRANSLATIONS_EN).find(
      (t) => t.nameEn.toLowerCase() === item.name.toLowerCase()
    );

  return {
    ...item,
    name: trans?.nameEn || (item as any).nameEn || item.name,
    description: trans?.descriptionEn || (item as any).descriptionEn || item.description,
  };
}
