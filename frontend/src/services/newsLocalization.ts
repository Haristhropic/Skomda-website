import { NewsItem } from "./news";

export interface NewsTranslation {
  titleEn: string;
  summaryEn: string;
  contentEn: string;
  categoryEn?: string;
  dateFormattedEn?: string;
  monthEn?: string;
  authorEn?: string;
}

export const NEWS_CATEGORY_EN: Record<string, string> = {
  Semua: "All",
  "Kegiatan Sekolah": "School Activities",
  Pengumuman: "Announcements",
  Prestasi: "Achievements",
  "Kemitraan & Kerja Sama": "Partnerships & Collaborations",
  "Karya & Inovasi Siswa": "Student Innovations & Works",
  "Artikel & Edukasi": "Articles & Education",
  Alumni: "Alumni",
};

export const NEWS_MONTH_EN: Record<string, string> = {
  JAN: "JAN",
  PEB: "FEB",
  FEB: "FEB",
  MAR: "MAR",
  APR: "APR",
  MEI: "MAY",
  JUN: "JUN",
  JUL: "JUL",
  AGU: "AUG",
  AGT: "AUG",
  AGS: "AUG",
  SEP: "SEP",
  OKT: "OCT",
  NOP: "NOV",
  NOV: "NOV",
  DES: "DEC",
};

export const INDO_MONTH_NAMES: Record<string, string> = {
  Januari: "January",
  Februari: "February",
  Maret: "March",
  April: "April",
  Mei: "May",
  Juni: "June",
  Juli: "July",
  Agustus: "August",
  September: "September",
  Oktober: "October",
  November: "November",
  Desember: "December",
};

export function localizeDateFormatted(dateStr?: string, isEn?: boolean): string {
  if (!dateStr) return "";
  if (!isEn) return dateStr;

  let localized = dateStr;
  for (const [idMonth, enMonth] of Object.entries(INDO_MONTH_NAMES)) {
    if (localized.includes(idMonth)) {
      // Convert "17 Agustus 2026" to "August 17, 2026"
      const match = localized.match(new RegExp(`(\\d{1,2})\\s+${idMonth}\\s+(\\d{4})`));
      if (match) {
        return `${enMonth} ${match[1]}, ${match[2]}`;
      }
      return localized.replace(idMonth, enMonth);
    }
  }
  return localized;
}

export function localizeMonth(monthStr?: string, isEn?: boolean): string {
  if (!monthStr) return "";
  if (!isEn) return monthStr;
  const m = monthStr.toUpperCase().trim();
  return NEWS_MONTH_EN[m] || m;
}

export const NEWS_TRANSLATIONS: Record<string, NewsTranslation> = {
  // 1. HUT RI 81
  "penuh-dedikasi-siswa-dan-guru-smk-telkom-sidoarjo-peringati-hari-kemerdekaan-ri-ke-81": {
    titleEn:
      "Full of Dedication! SMK Telkom Sidoarjo Students and Teachers Commemorate the 81st Indonesian Independence Day",
    summaryEn:
      "The 81st Independence Day commemoration ceremony of the Republic of Indonesia at SMK Telkom Sidoarjo was held solemnly and filled with the spirit of nationalism.",
    contentEn:
      "The 81st Independence Day commemoration ceremony of the Republic of Indonesia at SMK Telkom Sidoarjo was conducted with reverence and high patriotic enthusiasm.\n\nServing as the Ceremony Inspector was the Principal of SMK Telkom Sidoarjo, Mr. Abror, S.Hum., M.Pd.\n\nHeartfelt gratitude goes out to all ceremony officers and committee members who performed their duties with utmost responsibility and dedication. Let us keep igniting the spirit of independence and passion to create excellence for Indonesia!",
    categoryEn: "School Activities",
    dateFormattedEn: "August 17, 2026",
    monthEn: "AUG",
    authorEn: "SKOMDA Public Relations",
  },

  // 2. Lomba SPECTRA
  "bikin-suasana-17-an-makin-pecah-intip-keseruan-rangkaian-lomba-di-kegiatan-spectra": {
    titleEn:
      "Electrifying Independence Day Vibes! Highlights from the SPECTRA Celebration Competitions",
    summaryEn:
      "Independence celebration at SKOMDA was lively and vibrant! Students, teachers, staff, and the entire school community actively joined the SPECTRA August 17th festive competitions.",
    contentEn:
      "Independence Day celebration at SKOMDA was an unforgettable blast!\n\nNot only students, but this time teachers, staff, and the entire school community participated actively in various fun competitions as part of SPECTRA.\n\nFrom shared laughter, tactical teamwork competitions, to hilarious candid moments that made lasting memories. At SKOMDA, independence is always best celebrated together!",
    categoryEn: "School Activities",
    dateFormattedEn: "August 18, 2026",
    monthEn: "AUG",
    authorEn: "SKOMDA Student Council",
  },

  // 3. LKS Emas Revano
  "sabet-medali-emas-lks-nasional-2026-siswa-smk-telkom-sidoarjo-raih-bantuan-pendidikan-dari-gubernur-khofifah": {
    titleEn:
      "Winning Gold Medal at National LKS 2026, SMK Telkom Sidoarjo Student Receives Educational Scholarship from Governor Khofifah",
    summaryEn:
      "After clinching the Gold Medal in Artificial Intelligence at the 2026 National Vocational Student Skills Competition (LKS), Revano Satya Pandega received an educational scholarship award from the Governor of East Java.",
    contentEn:
      "Following his achievement of winning the Gold Medal in Artificial Intelligence at the 2026 National Vocational Student Skills Competition (LKS), Revano Satya Pandega was awarded an educational scholarship by the Governor of East Java, Ms. Khofifah Indar Parawansa, in appreciation of his remarkable achievement.\n\nPresented through the Head of East Java Provincial Education Office, Dr. Aries Agung Paewai, S.STP., M.M., this award is hoped to inspire Revano to continue learning, innovating, and reaching for even higher dreams.\n\nToday it's Revano. Tomorrow, it could be you!",
    categoryEn: "Achievements",
    dateFormattedEn: "August 12, 2026",
    monthEn: "AUG",
    authorEn: "SKOMDA Editorial Team",
  },

  // 4. Seminar Kebekerjaan
  "bentuk-talenta-siap-kerja-smk-telkom-sidoarjo-bekali-siswa-pemahaman-industri-lewat-seminar-kebekerjaan": {
    titleEn:
      "Cultivating Job-Ready Talents, SMK Telkom Sidoarjo Equips Students with Industry Insights Through Career Seminars",
    summaryEn:
      "From Student to Professional: Becoming a career professional begins while still in school through the SKOMDA Career and Employability Seminar.",
    contentEn:
      "From Student to Professional: Becoming a true professional does not start upon graduation, but starts right here during school years.\n\nThrough the Career Seminar, students learn first-hand insights about industrial dynamics, develop highly in-demand practical skills, and prepare themselves comprehensively for their future career journeys.\n\nAt SKOMDA, we believe education is not merely about producing graduates, but sculpting top-tier digital talents primed for global industry success.",
    categoryEn: "Student Innovations & Works",
    dateFormattedEn: "August 8, 2026",
    monthEn: "AUG",
    authorEn: "SKOMDA Career Center (BKK)",
  },

  // 5. DTP 9 Keahlian
  "sesuaikan-kebutuhan-industri-masa-kini-skomda-sediakan-9-pilihan-keahlian-digital-talent-program": {
    titleEn:
      "Aligning with Modern Industry Demands, SKOMDA Offers 9 Digital Talent Program Specializations",
    summaryEn:
      "SKOMDA offers 9 DTP specializations ranging from Software Developer, Network, IoT, Cloud, and AI Specialist to Cyber Security.",
    contentEn:
      "If your future is in the digital universe, what do you want to become?\n\nAt SKOMDA, you can kickstart your journey through the Digital Talent Program (DTP), carefully tailored to meet contemporary industrial expectations. Nine specialized tracks include Software Developer, Network System Administrator, Network Infrastructure Engineer, Visual Communication Designer, IoT Engineer, Cloud Engineer, AI Specialist, Digital Marketing Specialist, and Cyber Security Specialist.\n\nHere, you don't just learn theory. You engage in hands-on projects, industry certifications, and real portfolio development ready for immediate workforce integration.",
    categoryEn: "Articles & Education",
    dateFormattedEn: "August 4, 2026",
    monthEn: "AUG",
    authorEn: "SKOMDA Curriculum Team",
  },

  // 6. Pra MPLS & Leadership
  "sambut-siswa-baru-smk-telkom-sidoarjo-tuntaskan-rangkaian-pra-mpls-dan-leadership-2026": {
    titleEn:
      "Welcoming New Students, SMK Telkom Sidoarjo Completes 2026 Pre-MPLS and Leadership Orientation",
    summaryEn:
      "The 2026 Pre-MPLS and Leadership series was successfully completed, sparking vibrant enthusiasm among incoming students to foster exemplary character.",
    contentEn:
      "The entire series of Pre-MPLS and Leadership activities ran seamlessly. The passion, enthusiasm, and positive energy from all participants mark an extraordinary beginning for their journey at SMK Telkom Sidoarjo!\n\nTomorrow marks the official opening of MPLS and Leadership 2026. Let us prepare ourselves, stay healthy, and arrive with our best spirit to commence this transformative adventure as part of the SKOMDA family.",
    categoryEn: "School Activities",
    dateFormattedEn: "July 28, 2026",
    monthEn: "JUL",
    authorEn: "SKOMDA Student Affairs",
  },

  // 7. SPMB Inden
  "spmb-inden-2027-2028-resmi-dibuka-bebas-biaya-pendaftaran-khusus-batch-inden": {
    titleEn:
      "SPMB INDEN 2027/2028 Officially Opened: Free Registration Fee for Early Inden Batch",
    summaryEn:
      "Admissions for SPMB Batch Inden 2027/2028 at SMK Telkom Sidoarjo are officially open with complimentary registration fee benefits.",
    contentEn:
      "SPMB INDEN 2027/2028 IS OFFICIALLY OPEN!\n\nIt is time to take your first definitive step toward a bright digital future with SMK Telkom Sidoarjo! Enjoy exclusive Inden Batch benefits: FREE Registration Fee (exclusive to Inden Batch applicants) until the deadline of Friday, August 21, 2026.\n\nSecure your seat early and take advantage of these special perks before the period ends via the official portal: https://s.id/SPMBSKOMDA or contact us at 08113021919.",
    categoryEn: "Announcements",
    dateFormattedEn: "July 20, 2026",
    monthEn: "JUL",
    authorEn: "SKOMDA SPMB Committee",
  },

  // 8. HUT 61 Telkom
  "61-tahun-mengabdi-telkom-indonesia-terus-dorong-kemajuan-ekosistem-digital-di-indonesia": {
    titleEn:
      "61 Years of Service, Telkom Indonesia Continues Driving the Digital Ecosystem Forward",
    summaryEn:
      "Embodying the spirit of Synergy Transformation, PT Telkom Indonesia marks 61 years of strengthening the nation's digital connectivity and talent.",
    contentEn:
      "Happy 61st Anniversary to Telkom Indonesia! For 61 years, Telkom Indonesia has been an integral cornerstone of the nation's digital transformation journey.\n\nUnder the banner of 'Synergy Transformation', may collaboration and innovation continue to flourish, delivering impactful solutions and advancing Indonesia further in the digital age.\n\nLong live Telkom Indonesia! Keep inspiring, innovating, and connecting the nation.",
    categoryEn: "Partnerships & Collaborations",
    dateFormattedEn: "July 6, 2026",
    monthEn: "JUL",
    authorEn: "Telkom Education Foundation",
  },

  // 9. Guru Level Up AI
  "upaya-levelup-kualitas-pengajar-guru-guru-smk-telkom-sidoarjo-dalami-implementasi-ai-di-dunia-pendidikan": {
    titleEn:
      "Leveling Up Educator Excellence, SMK Telkom Sidoarjo Teachers Deepen AI Implementation in Education",
    summaryEn:
      "In partnership with the Faculty of Applied Sciences Telkom University, SKOMDA educators participated in an intensive workshop on applying AI for smart pedagogy.",
    contentEn:
      "Level Up Teachers of SMK Telkom Sidoarjo! In the spirit of continuous professional development, SMK Telkom Sidoarjo teachers participated in the 'AI for Education' program in collaboration with Telkom University's Faculty of Applied Sciences.\n\nKey topics covered: AI in modern education, the role of AI in global industries, emerging AI opportunities and ethical challenges, and practical classroom implementation strategies.\n\nBecause behind every future-ready student stands an educator who continually learns, adapts, and grows.",
    categoryEn: "Articles & Education",
    dateFormattedEn: "June 24, 2026",
    monthEn: "JUN",
    authorEn: "SKOMDA R&D Division",
  },

  // 10. Billal Spider-man
  "julukan-spider-man-darjo-billal-habibulloh-siswa-skomda-sabet-juara-3-kejurprov-jatim-u17-speed": {
    titleEn:
      "Nicknamed 'Spider-Man Darjo'! SKOMDA Student Billal Habibulloh Wins 3rd Place in East Java U17 Speed Climbing",
    summaryEn:
      "Billal Habibulloh Arrasyid (XI TJAT 3) brought honor to the school by claiming 3rd Place in the East Java KONI U17 Speed Sport Climbing Championship.",
    contentEn:
      "Another stellar achievement earned by an SMK Telkom Sidoarjo student! Billal Habibulloh Arrasyid, class XI TJAT 3 | Batch 8 (alumnus of SMPN 2 Sidoarjo), clinched 3rd Place in the East Java Provincial Championship in the U17 Speed category hosted by KONI East Java.\n\nMay this proud accomplishment inspire all students to practice diligently, evolve courageously, and pursue higher ambitions. Keep winning and inspiring!",
    categoryEn: "Achievements",
    dateFormattedEn: "June 15, 2026",
    monthEn: "JUN",
    authorEn: "SKOMDA Student Affairs",
  },

  // 11. Kunjungan Industri Guru
  "gak-mau-kalah-canggih-guru-skomda-sambangi-pt-hummatech-hingga-nortis-ai-demi-perkembangan-teknologi-terbaru": {
    titleEn:
      "Staying at the Cutting Edge! SKOMDA Teachers Visit PT Hummatech and Nortis AI to Explore Emerging Tech",
    summaryEn:
      "Synchronizing vocational curriculum with current industry trends, teachers visited PT Hummatech, Nortis AI, and PT Radnet Digital Indonesia.",
    contentEn:
      "Behind exceptional students stand educators who never stop learning. To deliver educational experiences perfectly aligned with the latest technological developments, SMK Telkom Sidoarjo vocational teachers conducted industrial benchmark visits to PT Hummatech, Nortis AI, and PT Radnet Digital Indonesia.\n\nMore than just a visit, it provided direct hands-on learning from tech pioneers, expanded pedagogical horizons, and fostered industrial synergy ensuring curriculum relevance in the workplace.",
    categoryEn: "Partnerships & Collaborations",
    dateFormattedEn: "June 2, 2026",
    monthEn: "JUN",
    authorEn: "SKOMDA Industry Relations (Hubin)",
  },

  // 12. BP3MI Kerja Korea
  "siap-go-international-smk-di-sidoarjo-ini-kedatangan-bp3mi-jatim-kenalkan-peluang-kerja-ke-korea-selatan": {
    titleEn:
      "Ready to Go International! East Java BP3MI Introduces Global Career Opportunities in South Korea to SKOMDA",
    summaryEn:
      "The East Java BP3MI G-to-G program broadens horizons on global career pathways in South Korea for SMK Telkom Sidoarjo students and prospective alumni.",
    contentEn:
      "Who says vocational graduates only have opportunities domestically? SMK Telkom Sidoarjo welcomed the East Java BP3MI agency to introduce international job opportunities in South Korea through the Government to Government (GtoG) program.\n\nStudents were familiarized with comprehensive preparations for global careers, ranging from specialized competence certifications, Korean language mastery, selection workflows, to professional readiness.\n\nBecause a global career does not start tomorrow: preparation starts right now with SKOMDA!",
    categoryEn: "Alumni",
    dateFormattedEn: "May 20, 2026",
    monthEn: "MAY",
    authorEn: "SKOMDA Career Center (BKK)",
  },
};

/**
 * Normalizes a news item to the active language (ID or EN).
 */
export function getLocalizedNewsItem(item: NewsItem, isEn: boolean): NewsItem {
  if (!isEn) return item;

  const translation =
    NEWS_TRANSLATIONS[item.slug?.toLowerCase().trim()] ||
    (typeof item.id !== "undefined" &&
      Object.values(NEWS_TRANSLATIONS).find(
        (t) => t.titleEn.toLowerCase() === (item as any).titleEn?.toLowerCase()
      ));

  const localizedCategory =
    NEWS_CATEGORY_EN[item.category] || translation?.categoryEn || item.category;

  const localizedMonth = localizeMonth(item.month, true);
  const localizedDateFormatted =
    translation?.dateFormattedEn || localizeDateFormatted(item.dateFormatted, true);

  if (translation) {
    return {
      ...item,
      title: translation.titleEn,
      summary: translation.summaryEn,
      content: translation.contentEn,
      category: localizedCategory,
      month: localizedMonth || translation.monthEn || item.month,
      dateFormatted: localizedDateFormatted,
      author: translation.authorEn || item.author,
    };
  }

  // Fallback for custom or backend-added news
  return {
    ...item,
    title: (item as any).titleEn || item.title,
    summary: (item as any).summaryEn || item.summary,
    content: (item as any).contentEn || item.content,
    category: localizedCategory,
    month: localizedMonth || item.month,
    dateFormatted: localizedDateFormatted,
  };
}
