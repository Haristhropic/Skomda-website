"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface FaqItem {
  id: string;
  qId: string;
  aId: string;
  qEn: string;
  aEn: string;
}

const PPDB_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    qId: "Apa perbedaan mendasar antara program 3 tahun dan program 4 tahun di SMK Telkom Sidoarjo?",
    aId: "Program 4 tahun (jurusan SIJA) memberikan pendalaman kurikulum setara diploma vokasi dengan fokus spesialisasi Cloud Computing, Cyber Security, dan magang industri (PKL) selama 6 hingga 10 bulan penuh. Sementara program 3 tahun (jurusan TJKT dan RPL) berfokus pada kesiapan kerja cepat serta persiapan studi lanjut perguruan tinggi dengan masa PKL 6 bulan di kelas 12.",
    qEn: "What is the primary difference between the 3-year and 4-year programs at SMK Telkom Sidoarjo?",
    aEn: "The 4-year program (SIJA major) provides advanced vocational curricula equivalent to a diploma level with deep focus on Cloud Computing, Cyber Security, and 6 to 10 months of full industry internship (PKL). The 3-year programs (TJKT and RPL) focus on accelerated work readiness and university entrance preparation with a 6-month internship in Grade 12.",
  },
  {
    id: "faq-2",
    qId: "Apa saja jalur pendaftaran yang dibuka pada PPDB tahun ini?",
    aId: "SMK Telkom Sidoarjo membuka 3 jalur penerimaan utama: Jalur Prestasi (akademik maupun non-akademik dengan bukti sertifikat kejuaraan), Jalur Rapor Unggulan (berdasarkan konsistensi nilai rapor SMP), dan Jalur Tes Potensi Akademik & Wawancara (Reguler). Calon siswa dapat memilih jalur yang paling sesuai dengan portofolio yang dimiliki.",
    qEn: "What admission tracks are open for this year's PPDB?",
    aEn: "SMK Telkom Sidoarjo offers 3 main admission tracks: Achievement Track (academic and non-academic competition certificates), Report Card Excellence Track (based on middle school grade consistency), and the General Academic Potential Test & Interview Track. Prospective students can select the track that best highlights their profile.",
  },
  {
    id: "faq-3",
    qId: "Apakah calon siswa dari luar kota Sidoarjo dan Jawa Timur dapat mendaftar?",
    aId: "Tentu saja bisa. SMK Telkom Sidoarjo menerima calon siswa dari seluruh pelosok Indonesia. Untuk pendaftar dari luar daerah, seluruh proses pendaftaran berkas dan tes seleksi dapat diikuti secara daring (online). Selain itu, pihak sekolah bekerja sama dengan puluhan pengelola kos dan asrama terverifikasi di dekat kampus untuk kenyamanan tempat tinggal siswa.",
    qEn: "Can prospective students from outside Sidoarjo and East Java apply?",
    aEn: "Yes, certainly. SMK Telkom Sidoarjo welcomes students from all across Indonesia. For out-of-town applicants, the entire registration process and selection test can be completed online. Furthermore, the school collaborates with verified boarding house and dormitory operators near campus to ensure safe student accommodation.",
  },
  {
    id: "faq-4",
    qId: "Bagaimana tahapan seleksi setelah membuat akun di portal PPDB online?",
    aId: "Setelah membuat akun dan melengkapi formulir data diri serta mengunggah berkas persyaratan (rapor dan pasfoto), calon siswa akan dijadwalkan mengikuti Tes Seleksi Digital & Akademik, Tes Bebas Buta Warna, serta Wawancara Minat Bakat. Hasil pengumuman kelulusan dapat dipantau langsung secara real-time melalui dashboard akun pendaftar.",
    qEn: "What are the selection stages after creating an account on the online PPDB portal?",
    aEn: "After registering an account, submitting personal data, and uploading required documents (academic records and photos), applicants are scheduled for a Digital & Academic Aptitude Test, Color Blindness Screening, and an Interest & Talent Interview. Results can be tracked directly through the applicant dashboard.",
  },
  {
    id: "faq-5",
    qId: "Apakah lulusan SMK Telkom Sidoarjo dapat melanjutkan studi ke Perguruan Tinggi Negeri (PTN)?",
    aId: "Sangat bisa. Lulusan SMK Telkom Sidoarjo memegang ijazah formal SMK yang diakui secara nasional dan memiliki hak penuh mengikuti seleksi masuk PTN (SNBP, SNBT, maupun Jalur Mandiri), politeknik negeri, sekolah kedinasan, maupun program beasiswa kemitraan khusus Telkom University.",
    qEn: "Can graduates of SMK Telkom Sidoarjo pursue higher education at state universities (PTN)?",
    aEn: "Yes, absolutely. Graduates receive an accredited national vocational diploma with full eligibility to enroll in state universities (SNBP, SNBT, and independent exams), state polytechnics, official government academies, and Telkom University scholarship partnerships.",
  },
  {
    id: "faq-6",
    qId: "Apakah tersedia program beasiswa atau skema pembayaran bertahap?",
    aId: "Tersedia beasiswa potongan biaya pendidikan bagi calon siswa dengan prestasi kejuaraan minimal tingkat kabupaten/kota atau peringkat paralel di sekolah asal. Untuk membantu kemudahan wali murid, sekolah juga memfasilitasi skema pembayaran bertahap (cicilan) melalui sistem virtual account bank mitra resmi.",
    qEn: "Are there scholarship programs or installment payment options available?",
    aEn: "Merit scholarships with tuition discounts are available for applicants with championship achievements at the district/city level or top academic rankings in their junior high schools. To support parents, flexible installment payment schemes are also provided through partner bank virtual account systems.",
  },
];

export default function PpdbFaqSection() {
  const { isEn } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id="faq-ppdb"
      className="relative w-full py-20 lg:py-28 bg-[#f9fafb] border-t border-gray-200/60 overflow-hidden scroll-mt-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Helpdesk Card (Identical to Tips Akomodasi signature style) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-[28px] bg-white p-8 sm:p-9 border-2 border-dashed border-[#d1d5dc] transition-all duration-300 hover:border-[#bc0c11] hover:shadow-md">
              <h3 className="font-jakarta font-bold text-2xl sm:text-3xl leading-tight text-[#101828] mb-3">
                {isEn ? "Need Direct Guidance from the Admission Team?" : "Butuh Panduan Langsung dari Panitia PPDB?"}
              </h3>
              <p className="font-jakarta text-sm text-[#4a5565] leading-relaxed mb-6">
                {isEn
                  ? "The admission and counseling team of SMK Telkom Sidoarjo is ready to guide parents and students in choosing majors, verifying documents, and navigating online registration."
                  : "Tim Admisi dan Konseling SMK Telkom Sidoarjo siap mendampingi orang tua dan calon siswa untuk konsultasi jurusan, verifikasi berkas, serta panduan pendaftaran online."}
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="https://wa.me/6281234567899?text=Halo%20Panitia%20PPDB%20SMK%20Telkom%20Sidoarjo,%20saya%20calon%20wali%20murid/siswa%20ingin%20berkonsultasi%20mengenai%20informasi%20pendaftaran%20siswa%20baru."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[#bc0c11] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#990a0e] shadow-card-cta font-jakarta cursor-pointer active:scale-[0.98]"
                >
                  <span>{isEn ? "Chat Admission on WhatsApp" : "Chat Panitia PPDB"}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right: FAQ Accordion (Identical dashed cards & chevron circle) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="mb-4">
              <h3 className="font-jakarta font-bold text-2xl sm:text-3xl text-[#101828] leading-tight">
                {isEn ? "Frequently Asked Questions" : "Tanya Jawab Seputar PPDB"}
              </h3>
              <p className="font-jakarta text-sm text-[#4a5565] mt-1">
                {isEn
                  ? "Find answers to key questions about admission tracks, programs, selection, and facilities"
                  : "Temukan jawaban lengkap seputar jalur seleksi, program keahlian, dan proses pendaftaran"}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {PPDB_FAQS.map((faq, idx) => {
                const isOpen = openIndex === idx;
                const question = isEn ? faq.qEn : faq.qId;
                const answer = isEn ? faq.aEn : faq.aId;

                return (
                  <div
                    key={faq.id}
                    className="rounded-[20px] bg-white border-2 border-dashed border-[#d1d5dc] overflow-hidden transition-colors hover:border-[#bc0c11]"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFAQ(idx)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-jakarta font-bold text-sm sm:text-base text-[#101828] cursor-pointer"
                    >
                      <span>{question}</span>
                      <div
                        className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                          isOpen
                            ? "bg-[#bc0c11] text-white rotate-180 shadow-xs"
                            : "bg-gray-100 text-[#4a5565] hover:bg-gray-200"
                        }`}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#4a5565] font-jakarta leading-relaxed border-t border-gray-100">
                            {answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
