export interface NewsItem {
  id?: number | string;
  title: string;
  slug: string;
  category: string;
  day?: string;
  month?: string;
  dateFormatted?: string;
  time?: string;
  image?: string;
  summary?: string;
  content?: string;
  author?: string;
  status?: "published" | "draft";
  created_at?: string;
  updated_at?: string;
}

export const NEWS_CATEGORIES = [
  "Semua",
  "Kegiatan Sekolah",
  "Pengumuman",
  "Prestasi",
  "Kemitraan & Kerja Sama",
  "Karya & Inovasi Siswa",
  "Artikel & Edukasi",
  "Alumni",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export function normalizeNewsImage(img?: string): string {
  if (!img) return "/images/berita/news-thumb-1.png";
  return img;
}

export function normalizeNewsItem(item: NewsItem): NewsItem {
  return {
    ...item,
    image: normalizeNewsImage(item.image),
  };
}

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Penuh Dedikasi! Siswa dan Guru SMK Telkom Sidoarjo Peringati Hari Kemerdekaan RI ke-81",
    slug: "penuh-dedikasi-siswa-dan-guru-smk-telkom-sidoarjo-peringati-hari-kemerdekaan-ri-ke-81",
    category: "Kegiatan Sekolah",
    day: "17",
    month: "AGT",
    dateFormatted: "17 Agustus 2026",
    time: "08.00",
    image: "/images/berita/berita-hut-ri-81.png",
    summary:
      "Upacara peringatan Hari Kemerdekaan Republik Indonesia ke-81 di SMK Telkom Sidoarjo berlangsung dengan khidmat dan penuh semangat nasionalisme.",
    content:
      "Upacara peringatan Hari Kemerdekaan Republik Indonesia ke-81 di SMK Telkom Sidoarjo berlangsung dengan khidmat dan penuh semangat nasionalisme.\n\nBertindak sebagai Inspektur Upacara, Kepala SMK Telkom Sidoarjo, Bapak Abror, S.Hum., M.Pd.\n\nTerima kasih kepada seluruh petugas upacara yang telah menjalankan tugas dengan penuh tanggung jawab dan dedikasi. Mari terus kobarkan semangat kemerdekaan dan semangat berkarya untuk Indonesia!",
    author: "Humas SKOMDA",
  },
  {
    id: 2,
    title: "Bikin Suasana 17-an Makin Pecah, Intip Keseruan Rangkaian Lomba di Kegiatan SPECTRA!",
    slug: "bikin-suasana-17-an-makin-pecah-intip-keseruan-rangkaian-lomba-di-kegiatan-spectra",
    category: "Kegiatan Sekolah",
    day: "18",
    month: "AGT",
    dateFormatted: "18 Agustus 2026",
    time: "13.30",
    image: "/images/berita/berita-lomba-spectra.png",
    summary:
      "17-an di SKOMDA auto seru! Bukan cuma siswa, guru, karyawan, sampai seluruh warga sekolah ikut turun langsung meramaikan lomba 17 Agustus SPECTRA.",
    content:
      "17-an di SKOMDA auto seru!\n\nBukan cuma siswa, kali ini guru, karyawan, sampai seluruh warga sekolah ikut turun langsung meramaikan lomba 17 Agustus dalam rangkaian SPECTRA!\n\nMulai dari ketawa bareng, adu strategi, sampai momen-momen receh yang bikin susah move on. Karena di SKOMDA, kemerdekaan paling seru kalau dirayakan bareng-bareng!",
    author: "OSIS SKOMDA",
  },
  {
    id: 3,
    title: "Sabet Medali Emas LKS Nasional 2026, Siswa SMK Telkom Sidoarjo Raih Bantuan Pendidikan dari Gubernur Khofifah",
    slug: "sabet-medali-emas-lks-nasional-2026-siswa-smk-telkom-sidoarjo-raih-bantuan-pendidikan-dari-gubernur-khofifah",
    category: "Prestasi",
    day: "12",
    month: "AGT",
    dateFormatted: "12 Agustus 2026",
    time: "10.00",
    image: "/images/berita/berita-lks-emas-revano.png",
    summary:
      "Setelah meraih Medali Emas Artificial Intelligence di LKS Dikmen Nasional 2026, Revano Satya Pandega menerima bantuan pendidikan dari Gubernur Jawa Timur.",
    content:
      "Setelah meraih Medali Emas Artificial Intelligence di LKS Dikmen Nasional 2026, Revano Satya Pandega kembali menerima bantuan pendidikan dari Gubernur Jawa Timur, Ibu Khofifah Indar Parawansa sebagai bentuk apresiasi atas prestasinya.\n\nMelalui Kepala Dinas Pendidikan Provinsi Jawa Timur, Dr. Aries Agung Paewai, S.STP., M.M., penghargaan ini diharapkan menjadi penyemangat agar Revano terus belajar, berkembang, dan meraih mimpi yang lebih tinggi.\n\nHari ini Revano. Besok, bisa jadi giliran kamu!",
    author: "Tim Redaksi SKOMDA",
  },
  {
    id: 4,
    title: "Bentuk Talenta Siap Kerja, SMK Telkom Sidoarjo Bekali Siswa Pemahaman Industri Lewat Seminar Kebekerjaan",
    slug: "bentuk-talenta-siap-kerja-smk-telkom-sidoarjo-bekali-siswa-pemahaman-industri-lewat-seminar-kebekerjaan",
    category: "Karya & Inovasi Siswa",
    day: "08",
    month: "AGT",
    dateFormatted: "8 Agustus 2026",
    time: "09.15",
    image: "/images/berita/berita-seminar-kebekerjaan.png",
    summary:
      "From Student to Professional: Menjadi profesional bukan dimulai saat lulus, tetapi sejak masih di bangku sekolah melalui Seminar Kebekerjaan SKOMDA.",
    content:
      "From Student to Professional: Menjadi profesional bukan dimulai saat lulus, tetapi sejak masih di bangku sekolah.\n\nMelalui Seminar Kebekerjaan, siswa belajar memahami dunia industri secara langsung, membangun keterampilan yang dibutuhkan, serta mempersiapkan diri menghadapi karier masa depan.\n\nDi SKOMDA, kami percaya bahwa pendidikan bukan sekadar menghasilkan lulusan, tetapi membentuk talenta terbaik yang siap berkarier di dunia industri.",
    author: "BKK SKOMDA",
  },
  {
    id: 5,
    title: "Sesuaikan Kebutuhan Industri Masa Kini, SKOMDA Sediakan 9 Pilihan Keahlian Digital Talent Program",
    slug: "sesuaikan-kebutuhan-industri-masa-kini-skomda-sediakan-9-pilihan-keahlian-digital-talent-program",
    category: "Artikel & Edukasi",
    day: "04",
    month: "AGT",
    dateFormatted: "4 Agustus 2026",
    time: "11.00",
    image: "/images/berita/berita-dtp-9-keahlian.png",
    summary:
      "SKOMDA sediakan 9 pilihan keahlian DTP mulai dari Software Developer, Network, IoT, Cloud, AI Specialist hingga Cyber Security.",
    content:
      "Kalau masa depanmu ada di dunia digital, kamu mau jadi apa?\n\nDi SKOMDA, kamu bisa mulai langkahmu lewat Digital Talent Program (DTP) yang dirancang sesuai kebutuhan industri masa kini. Sembilan pilihan peminatan DTP meliputi Software Developer, Network System Administrator, Network Infrastructure Engineer, Visual Communication Designer, IoT Engineer, Cloud Engineer, AI Specialist, Digital Marketing Specialist, dan Cyber Security Specialist.\n\nDi sini, kamu nggak cuma belajar teori. Kamu juga akan praktik langsung, mengerjakan project, dan mengasah skill yang siap dipakai di dunia kerja maupun dunia industri.",
    author: "Tim Kurikulum SKOMDA",
  },
  {
    id: 6,
    title: "Sambut Siswa Baru, SMK Telkom Sidoarjo Tuntaskan Rangkaian Pra MPLS dan Leadership 2026",
    slug: "sambut-siswa-baru-smk-telkom-sidoarjo-tuntaskan-rangkaian-pra-mpls-dan-leadership-2026",
    category: "Kegiatan Sekolah",
    day: "28",
    month: "JUL",
    dateFormatted: "28 Juli 2026",
    time: "14.00",
    image: "/images/berita/berita-pra-mpls-leadership.png",
    summary:
      "Rangkaian Pra MPLS dan Leadership 2026 tuntas dilaksanakan, menyulut antusiasme tinggi calon peserta didik baru untuk berkarakter unggul.",
    content:
      "Seluruh rangkaian kegiatan Pra MPLS dan Leadership telah berjalan dengan lancar. Semangat, antusias, dan energi positif dari seluruh peserta menjadi awal yang luar biasa untuk perjalanan baru di SMK Telkom Sidoarjo!\n\nBesok adalah saatnya memasuki pembukaan resmi MPLS dan Leadership 2026. Mari siapkan diri, jaga kesehatan, dan datang dengan semangat terbaik untuk memulai petualangan sebagai bagian dari keluarga besar SKOMDA.",
    author: "Kesiswaan SKOMDA",
  },
  {
    id: 7,
    title: "SPMB INDEN 2027/2028 Resmi Dibuka: Bebas Biaya Pendaftaran Khusus Batch Inden",
    slug: "spmb-inden-2027-2028-resmi-dibuka-bebas-biaya-pendaftaran-khusus-batch-inden",
    category: "Pengumuman",
    day: "20",
    month: "JUL",
    dateFormatted: "20 Juli 2026",
    time: "09.00",
    image: "/images/berita/berita-spmb-inden-2027.png",
    summary:
      "Pendaftaran SPMB Batch Inden 2027/2028 SMK Telkom Sidoarjo telah resmi dibuka dengan fasilitas bebas biaya formulir registrasi.",
    content:
      "SPMB INDEN 2027/2028 RESMI DIBUKA!\n\nSaatnya mengambil langkah pertama menuju masa depan bersama SMK Telkom Sidoarjo! Nikmati Benefit Spesial Batch Inden: FREE Biaya Pendaftaran (khusus peserta Batch Inden) hingga batas pendaftaran Jumat, 21 Agustus 2026.\n\nAmankan kesempatanmu lebih awal dan nikmati benefit spesial Batch Inden sebelum periodenya berakhir melalui link pendaftaran resmi: https://s.id/SPMBSKOMDA atau hubungi Contact Person 08113021919.",
    author: "Panitia SPMB SKOMDA",
  },
  {
    id: 8,
    title: "61 Tahun Mengabdi, Telkom Indonesia Terus Dorong Kemajuan Ekosistem Digital di Indonesia",
    slug: "61-tahun-mengabdi-telkom-indonesia-terus-dorong-kemajuan-ekosistem-digital-di-indonesia",
    category: "Kemitraan & Kerja Sama",
    day: "06",
    month: "JUL",
    dateFormatted: "6 Juli 2026",
    time: "10.30",
    image: "/images/berita/berita-hut-61-telkom.png",
    summary:
      "Mengusung semangat Sinergi Transformasi, PT Telkom Indonesia genap 61 tahun memperkuat konektivitas dan talenta digital bangsa.",
    content:
      "Selamat Ulang Tahun ke-61 Telkom Indonesia! Selama 61 tahun, Telkom Indonesia terus menjadi bagian dari perjalanan transformasi digital Indonesia.\n\nMengusung semangat 'Sinergi Transformasi', semoga kolaborasi dan inovasi terus tumbuh, menghadirkan solusi terbaik, serta membawa Indonesia semakin maju di era digital.\n\nDirgahayu Telkom Indonesia! Terus menginspirasi, terus berinovasi, dan terus menghubungkan Indonesia.",
    author: "Yayasan Pendidikan Telkom",
  },
  {
    id: 9,
    title: "Upaya #LevelUp Kualitas Pengajar, Guru-Guru SMK Telkom Sidoarjo Dalami Implementasi AI di Dunia Pendidikan",
    slug: "upaya-levelup-kualitas-pengajar-guru-guru-smk-telkom-sidoarjo-dalami-implementasi-ai-di-dunia-pendidikan",
    category: "Artikel & Edukasi",
    day: "24",
    month: "JUN",
    dateFormatted: "24 Juni 2026",
    time: "13.00",
    image: "/images/berita/berita-levelup-guru-ai.png",
    summary:
      "Kolaborasi bersama Fakultas Ilmu Terapan Telkom University, para pendidik SKOMDA ikuti lokakarya intensif pemanfaatan AI untuk pedagogi cerdas.",
    content:
      "Level Up Guru SMK Telkom Sidoarjo! Dalam semangat terus berkembang, Bapak/Ibu Guru SMK Telkom Sidoarjo mengikuti pelatihan 'AI for Education' sebagai bagian dari kolaborasi antara Telkom University - Fakultas Ilmu Terapan dan SMK Telkom Sidoarjo.\n\nMateri yang dipelajari antara lain: AI untuk dunia pendidikan, Peran AI di dunia industri, Peluang & tantangan AI, serta Implementasi AI dalam pembelajaran di kelas.\n\nKarena di balik siswa yang siap menghadapi masa depan, ada guru yang terus belajar, beradaptasi, dan bertumbuh.",
    author: "Litbang SKOMDA",
  },
  {
    id: 10,
    title: "Julukan 'Spider-Man Darjo'! Billal Habibulloh Siswa SKOMDA Sabet Juara 3 Kejurprov Jatim U17 Speed",
    slug: "julukan-spider-man-darjo-billal-habibulloh-siswa-skomda-sabet-juara-3-kejurprov-jatim-u17-speed",
    category: "Prestasi",
    day: "15",
    month: "JUN",
    dateFormatted: "15 Juni 2026",
    time: "15.45",
    image: "/images/berita/berita-spiderman-darjo-billal.png",
    summary:
      "Billal Habibulloh Arrasyid (XI TJAT 3) harumkan nama sekolah dengan meraih Juara 3 Kejurprov Panjat Tebing Speed U17 KONI Jatim.",
    content:
      "Prestasi kembali ditorehkan oleh siswa SMK Telkom Sidoarjo! Billal Habibulloh Arrasyid, siswa kelas XI TJAT 3 | Angkatan 8 (Alumni SMPN 2 Sidoarjo), berhasil meraih Juara 3 pada Kejurprov Jawa Timur kategori U17 Speed yang diselenggarakan oleh KONI Jawa Timur.\n\nSemoga prestasi ini menjadi inspirasi untuk terus berlatih, berkembang, dan berani meraih mimpi yang lebih tinggi. Terus ukir prestasi, terus menginspirasi!",
    author: "Kesiswaan SKOMDA",
  },
  {
    id: 11,
    title: "Gak Mau Kalah Canggih! Guru SKOMDA Sambangi PT Hummatech Hingga Nortis AI demi Perkembangan Teknologi Terbaru",
    slug: "gak-mau-kalah-canggih-guru-skomda-sambangi-pt-hummatech-hingga-nortis-ai-demi-perkembangan-teknologi-terbaru",
    category: "Kemitraan & Kerja Sama",
    day: "02",
    month: "JUN",
    dateFormatted: "2 Juni 2026",
    time: "11.15",
    image: "/images/berita/berita-guru-kunjungan-hummatech.png",
    summary:
      "Sinkronisasi kurikulum industri, guru kejuruan kunjungi PT Hummatech, Nortis AI, dan PT Radnet Digital Indonesia.",
    content:
      "Di balik siswa hebat, ada guru yang tak pernah berhenti belajar. Untuk menghadirkan pembelajaran yang selaras dengan perkembangan teknologi, para guru SMK Telkom Sidoarjo melaksanakan Kunjungan Industri ke PT Hummatech, Nortis AI, dan PT Radnet Digital Indonesia.\n\nBukan sekadar berkunjung, tetapi belajar langsung dari industri, memperluas wawasan, dan membangun kolaborasi agar setiap ilmu yang diajarkan di kelas benar-benar relevan dengan dunia kerja.",
    author: "Hubin SKOMDA",
  },
  {
    id: 12,
    title: "Siap Go International! SMK di Sidoarjo Ini Kedatangan BP3MI Jatim Kenalkan Peluang Kerja ke Korea Selatan",
    slug: "siap-go-international-smk-di-sidoarjo-ini-kedatangan-bp3mi-jatim-kenalkan-peluang-kerja-ke-korea-selatan",
    category: "Alumni",
    day: "20",
    month: "MEI",
    dateFormatted: "20 Mei 2026",
    time: "10.00",
    image: "/images/berita/berita-bp3mi-kerja-korea.png",
    summary:
      "Program G to G BP3MI Jatim buka wawasan karier global ke Korea Selatan bagi siswa dan calon alumni SMK Telkom Sidoarjo.",
    content:
      "Siapa bilang lulusan SMK cuma punya peluang di dalam negeri? SMK Telkom Sidoarjo kedatangan BP3MI Jawa Timur untuk mengenalkan peluang kerja ke Korea Selatan melalui program Government to Government (GtoG).\n\nSiswa dikenalkan dengan berbagai persiapan menuju dunia kerja internasional, mulai dari sertifikasi kompetensi, bahasa Korea, proses seleksi, hingga kesiapan kerja.\n\nKarena masa depan global tidak dimulai nanti, persiapannya dimulai dari sekarang bersama SKOMDA!",
    author: "BKK SKOMDA",
  },
];

// Helper: Filter mock news
function filterMockNews(category?: string, search?: string): NewsItem[] {
  let result = [...MOCK_NEWS];
  if (category && category !== "Semua") {
    result = result.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (search && search.trim() !== "") {
    const term = search.toLowerCase();
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        (item.summary && item.summary.toLowerCase().includes(term)) ||
        (item.content && item.content.toLowerCase().includes(term))
    );
  }
  return result;
}

/**
 * Mengambil daftar berita dari Go backend API (dengan filter opsional category & search).
 * Otomatis retry 1x jika gagal, lalu fallback ke mock data jika backend offline.
 */
export async function getNewsList(params?: {
  category?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<NewsItem[]> {
  const queryParams = new URLSearchParams();
  if (params?.category && params.category !== "Semua") {
    queryParams.set("category", params.category);
  }
  if (params?.search && params.search.trim() !== "") {
    queryParams.set("search", params.search.trim());
  }
  if (params?.status && params.status !== "semua") {
    queryParams.set("status", params.status);
  }
  if (params?.page) {
    queryParams.set("page", String(params.page));
  }
  if (params?.limit) {
    queryParams.set("limit", String(params.limit));
  }

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/news${queryString ? `?${queryString}` : ""}`;

  // Retry helper: coba fetch, jika gagal tunggu lalu retry 1x
  const attemptFetch = async (retries = 1): Promise<Response | null> => {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return res;
    } catch {
      // fetch failed (network error / backend belum siap)
    }
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 1500));
      return attemptFetch(retries - 1);
    }
    return null;
  };

  try {
    const res = await attemptFetch(1);

    if (res) {
      const json = await res.json();
      if (Array.isArray(json.data)) {
        return json.data.map(normalizeNewsItem);
      }
    }

    // Backend tidak merespons (jaringan offline / backend belum jalan) → fallback lokal
    if (typeof window !== "undefined") {
      console.log("[News] Menggunakan data lokal (backend belum tersedia)");
    }
    return filterMockNews(params?.category, params?.search).map(normalizeNewsItem);
  } catch {
    return filterMockNews(params?.category, params?.search).map(normalizeNewsItem);
  }
}

/**
 * Mengambil detail satu berita berdasarkan slug.
 */
export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const cleanSlug = slug.toLowerCase().trim();
  const url = `${API_BASE_URL}/news/${encodeURIComponent(cleanSlug)}`;

  const attemptFetch = async (retries = 1): Promise<Response | null> => {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return res;
    } catch {
      // network error
    }
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 1500));
      return attemptFetch(retries - 1);
    }
    return null;
  };

  try {
    const res = await attemptFetch(1);
    if (res) {
      const json = await res.json();
      if (json.data) return normalizeNewsItem(json.data);
    }
  } catch {
    // silent fallback
  }

  // Fallback ke mock data
  const fallbackItem = MOCK_NEWS.find(
    (item) => item.slug.toLowerCase() === cleanSlug
  );
  return fallbackItem ? normalizeNewsItem(fallbackItem) : null;
}

/**
 * Menambahkan berita baru ke database backend (POST /api/news).
 */
export async function createNews(
  data: Partial<NewsItem>
): Promise<{ success: boolean; data?: NewsItem; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/news`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || "Gagal membuat berita" };
    }
    return { success: true, data: json.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal terhubung ke backend",
    };
  }
}

/**
 * Memperbarui data berita (PUT /api/news/:id).
 */
export async function updateNews(
  id: number | string,
  data: Partial<NewsItem>
): Promise<{ success: boolean; data?: NewsItem; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || "Gagal memperbarui berita" };
    }
    return { success: true, data: json.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal terhubung ke backend",
    };
  }
}

/**
 * Menghapus berita (DELETE /api/news/:id).
 */
export async function deleteNews(
  id: number | string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || "Gagal menghapus berita" };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Gagal terhubung ke backend",
    };
  }
}
