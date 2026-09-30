"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface FAQItem {
  qId: string;
  aId: string;
  qEn: string;
  aEn: string;
}

const faqs: FAQItem[] = [
  {
    qId: "Apakah pihak sekolah menyediakan asrama resmi milik SMK Telkom Sidoarjo?",
    aId: "SMK Telkom Sidoarjo bermitra dengan puluhan pengelola kos dan asrama pelajar terverifikasi di sekitar sekolah (radius 200m - 1km). Seluruh hunian mitra telah dicek aspek keamanan, kenyamanan, serta kedisiplinannya oleh Tim Kesiswaan.",
    qEn: "Does the school provide official dormitories owned by SMK Telkom Sidoarjo?",
    aEn: "SMK Telkom Sidoarjo partners with dozens of verified boarding house and student hostel operators within a 200m to 1km radius. All partner residences have been vetted for safety, comfort, and student discipline by the Student Affairs team.",
  },
  {
    qId: "Bagaimana cara orang tua luar kota menyurvei dan memilih kos yang aman?",
    aId: "Orang tua dapat menghubungi langsung pengelola melalui kontak yang tertera atau menghubungi Helpdesk Kesiswaan kami untuk mendapatkan pendampingan rekomendasi kos yang sesuai dengan anggaran dan preferensi (khusus putra / khusus putri).",
    qEn: "How can parents from out of town survey and choose a safe boarding house?",
    aEn: "Parents can contact hosts directly through listed phone numbers or reach out to our Student Affairs Helpdesk for personalized guidance based on budget and preferences (boys-only or girls-only).",
  },
  {
    qId: "Apakah kos di sekitar sekolah sudah mencakup akses internet WiFi?",
    aId: "Mayoritas kos mitra di sekitar SMK Telkom Sidoarjo telah dilengkapi jaringan WiFi berkecepatan tinggi (Fiber Optic) yang memadai untuk mendukung praktikum coding, tugas jaringan, maupun ujian daring siswa.",
    qEn: "Do boarding houses around the campus include high-speed WiFi access?",
    aEn: "The majority of partner boarding houses around SMK Telkom Sidoarjo are equipped with high-speed Fiber Optic WiFi to facilitate programming practice, networking lab tasks, and online examinations.",
  },
  {
    qId: "Berapa batas jam malam rata-rata kos di sekitar kampus?",
    aId: "Untuk menjaga keselamatan dan kedisiplinan belajar siswa SMK, sebagian besar kos menerapkan jam malam pukul 21.00 - 22.00 WIB, dengan toleransi khusus jika ada kegiatan tugas kelompok atau ekstrakurikuler resmi dari sekolah yang disertai surat izin.",
    qEn: "What is the average curfew hours for boarding houses around campus?",
    aEn: "To maintain student safety and study discipline, most residences enforce a curfew between 21:00 and 22:00 WIB, with special allowances for official school projects or extracurriculars accompanied by permit letters.",
  },
];

export default function TipsAkomodasiSection() {
  const { isEn, t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="tips-faq" className="relative w-full py-20 lg:py-28 bg-[#f9fafb] border-t border-gray-200/60 overflow-hidden scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Helpdesk Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-[28px] bg-white p-8 sm:p-9 border-2 border-dashed border-[#d1d5dc] transition-all duration-300 hover:border-[#bc0c11] hover:shadow-md">
              <h3 className="font-jakarta font-bold text-2xl sm:text-3xl leading-tight text-[#101828] mb-3">
                {isEn ? "Need Help Finding Accommodation?" : "Butuh Bantuan Memilih Kos yang Tepat?"}
              </h3>
              <p className="font-jakarta text-sm text-[#4a5565] leading-relaxed mb-6">
                {isEn
                  ? "The Student Affairs & Counseling Team of SMK Telkom Sidoarjo is ready to assist parents and students from outside Sidoarjo in finding safe, comfortable housing."
                  : "Tim Bimbingan Konseling dan Kesiswaan SMK Telkom Sidoarjo siap membantu calon siswa dan orang tua dari luar kota untuk survei dan mendapatkan akomodasi terbaik."}
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="https://wa.me/6281234567899?text=Halo%20Admin%20Kesiswaan%20SMK%20Telkom%20Sidoarjo,%20saya%20calon%20wali%20murid/siswa%20ingin%20berkonsultasi%20mengenai%20rekomendasi%20akomodasi%20kos/asrama."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#bc0c11] px-7 py-3.5 text-[15px] font-medium text-white transition-all duration-300 hover:bg-[#990a0e] active:scale-[0.98] font-jakarta cursor-pointer"
                  style={{
                    boxShadow:
                      "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
                  }}
                >
                  <span>{isEn ? "Chat Student Affairs on WhatsApp" : "Chat WhatsApp Kesiswaan"}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
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

          {/* Right: FAQ Accordion */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="mb-4">
              <h3 className="font-jakarta font-bold text-2xl sm:text-3xl text-[#101828] leading-tight">
                {t("akomodasi.tipsTitle")}
              </h3>
              <p className="font-jakarta text-sm text-[#4a5565] mt-1">
                {t("akomodasi.tipsSubtitle")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                const question = isEn ? faq.qEn : faq.qId;
                const answer = isEn ? faq.aEn : faq.aId;

                return (
                  <div
                    key={faq.qId}
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
