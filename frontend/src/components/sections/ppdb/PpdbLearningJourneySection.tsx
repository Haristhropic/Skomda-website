"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const YEARS = [
  {
    id: "year-10",
    grade: "10",
    yearLabelId: "Tahun Pertama",
    yearLabelEn: "Year One",
    colorClass: "bg-[#bc0c11]",
    trackAll: true,
    itemsId: [
      "Mata Pelajaran Umum Kejuruan",
      "Digital Talent Program (Dasar & Pemahaman)",
      "Proyek Penguatan Profil Pelajar (P5)",
      "Pandawa Community Service",
    ],
    itemsEn: [
      "General & Vocational Subjects",
      "Digital Talent Program (Foundation)",
      "Student Profile Strengthening Project (P5)",
      "Pandawa Community Service",
    ],
  },
  {
    id: "year-11",
    grade: "11",
    yearLabelId: "Tahun Kedua",
    yearLabelEn: "Year Two",
    colorClass: "bg-[#bc0c11]",
    trackAll: true,
    itemsId: [
      "Mata Pelajaran Umum & Kejuruan",
      "Digital Talent Program",
      "Proyek Penguatan Profil Pelajar (P5)",
      "Proyek Kolaborasi Antar Kelas & Industri",
      "Community Service",
    ],
    itemsEn: [
      "General & Vocational Subjects",
      "Digital Talent Program",
      "Student Profile Strengthening Project (P5)",
      "Inter-class & Industry Collaboration Project",
      "Community Service",
    ],
  },
  {
    id: "year-12",
    grade: "12",
    yearLabelId: "Tahun Ketiga",
    yearLabelEn: "Year Three",
    colorClass: "bg-[#bc0c11]",
    trackAll: false,
    track3: {
      labelId: "Program 3 Tahun - TJAT",
      labelEn: "3-Year Program - TJAT",
      itemsId: [
        "Praktik Kerja Lapangan (PKL)",
        "Penilaian Akhir Kelulusan",
        "Sertifikasi Kompetensi",
        "Program BMW",
      ],
      itemsEn: [
        "Vocational Field Practice (PKL)",
        "Final Graduation Assessment",
        "Competency Certification",
        "BMW Program",
      ],
    },
    track4: {
      labelId: "Program 4 Tahun - SIJA",
      labelEn: "4-Year Program - SIJA",
      itemsId: [
        "Mata Pelajaran Umum & Kejuruan",
        "Penilaian Akhir Kelulusan",
        "Program Inkubasi Startup",
        "Proyek Kolaborasi dengan Industri",
      ],
      itemsEn: [
        "General & Vocational Subjects",
        "Final Graduation Assessment",
        "Startup Incubation Program",
        "Industry Collaboration Project",
      ],
    },
  },
  {
    id: "year-13",
    grade: "13",
    yearLabelId: "Tahun Keempat",
    yearLabelEn: "Year Four",
    colorClass: "bg-[#101828]",
    trackAll: false,
    track4Only: {
      labelId: "Program 4 Tahun - SIJA",
      labelEn: "4-Year Program Only - SIJA",
      itemsId: [
        "Praktik Kerja Lapangan (PKL)",
        "Sertifikasi Kompetensi",
        "Program BMW",
        "Proyek Industri Akhir",
      ],
      itemsEn: [
        "Vocational Field Practice (PKL)",
        "Competency Certification",
        "BMW Program",
        "Final Industry Project",
      ],
    },
  },
];

function BulletItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm font-jakarta text-[#364153] leading-relaxed">
      <span
        className="mt-1 shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-red-50 text-[#bc0c11]"
        aria-hidden="true"
      >
        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
      </span>
      <span>{text}</span>
    </li>
  );
}

export default function PpdbLearningJourneySection() {
  const { isEn } = useLanguage();

  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#f3f4f6]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-jakarta font-bold text-3xl sm:text-4xl text-[#101828] mb-3 tracking-tight">
                {isEn ? (
                  <>Learning <span className="text-[#bc0c11]">Journey</span></>
                ) : (
                  <>Perjalanan <span className="text-[#bc0c11]">Belajarmu</span></>
                )}
              </h2>
              <div className="h-1 w-12 rounded-full bg-[#bc0c11] mb-3" />
              <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed max-w-xl">
                {isEn
                  ? "A structured curriculum for 3-Year (TJAT) and 4-Year (SIJA) programs designed to develop work-ready digital talent at every stage."
                  : "Kurikulum terstruktur untuk Program 3 Tahun (TJAT) dan Program 4 Tahun (SIJA) yang dirancang membentuk talenta digital siap kerja di setiap jenjangnya."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden flex items-center justify-between text-xs text-[#6a7282] font-medium mb-3 px-1">
          <span className="font-semibold text-[#101828]">{isEn ? "Grades 10 - 13" : "Kelas 10 – 13"}</span>
          <span className="inline-flex items-center gap-1 text-[#bc0c11] font-semibold">
            <span>{isEn ? "Swipe to view next year" : "Geser untuk melihat tahun berikutnya"}</span>
            <span className="text-sm font-bold">→</span>
          </span>
        </div>

        {/* Year Cards: Mobile Horizontal Scroll (Optimized visibility) & Desktop Grid */}
        <div dir="ltr" className="flex justify-start overflow-x-auto pb-5 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch snap-x snap-proximity scroll-pl-4 sm:scroll-pl-0 overscroll-x-contain scrollbar-none">
          {YEARS.map((year) => (
            <div
              key={year.id}
              className="w-[78vw] max-w-[290px] shrink-0 snap-start sm:w-auto sm:max-w-none flex flex-col h-full"
            >
              <div className="h-full bg-white rounded-[20px] sm:rounded-[24px] border border-gray-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">

                {/* Card Header */}
                <div className={`${year.colorClass} px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between relative overflow-hidden select-none`}>
                  <div className="relative z-10">
                    <span className="font-jakarta text-white/80 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase block mb-0.5">
                      {isEn ? year.yearLabelEn : year.yearLabelId}
                    </span>
                    <span className="font-jakarta text-white font-bold text-xl sm:text-2xl tracking-tight leading-none">
                      {isEn ? `Grade ${year.grade}` : `Kelas ${year.grade}`}
                    </span>
                  </div>
                  <span className="font-jakarta font-extrabold text-4xl sm:text-5xl text-white/15 leading-none pointer-events-none">
                    {year.grade}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col justify-start">

                  {/* Grade 10 & 11 (Unified list) */}
                  {year.trackAll && "itemsId" in year && (
                    <ul className="flex flex-col gap-3">
                      {(isEn ? year.itemsEn : year.itemsId)?.map((item, i) => (
                        <BulletItem key={i} text={item} />
                      ))}
                    </ul>
                  )}

                  {/* Grade 12 (Two tracks with clean separator, no nested boxes) */}
                  {!year.trackAll && "track3" in year && year.track3 && (
                    <div className="flex flex-col gap-5">
                      {/* Track 3 Tahun */}
                      <div>
                        <div className="flex flex-col gap-0.5 mb-2.5">
                          <span className="inline-flex self-start items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-gray-100 text-gray-800 border border-gray-200/80">
                            {isEn ? year.track3.labelEn : year.track3.labelId}
                          </span>
                        </div>
                        <ul className="flex flex-col gap-2.5">
                          {(isEn ? year.track3.itemsEn : year.track3.itemsId).map((item, i) => (
                            <BulletItem key={i} text={item} />
                          ))}
                        </ul>
                      </div>

                      {/* Track 4 Tahun */}
                      {"track4" in year && year.track4 && (
                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex flex-col gap-0.5 mb-2.5">
                            <span className="inline-flex self-start items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-red-50 text-[#bc0c11] border border-red-200/80">
                              {isEn ? year.track4.labelEn : year.track4.labelId}
                            </span>
                          </div>
                          <ul className="flex flex-col gap-2.5">
                            {(isEn ? year.track4.itemsEn : year.track4.itemsId).map((item, i) => (
                              <BulletItem key={i} text={item} />
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Grade 13 (Track 4 Only, no nested boxes) */}
                  {!year.trackAll && "track4Only" in year && year.track4Only && (
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-0.5 mb-1.5">
                        <span className="inline-flex self-start items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-red-50 text-[#bc0c11] border border-red-200/80">
                          {isEn ? year.track4Only.labelEn : year.track4Only.labelId}
                        </span>
                      </div>
                      <ul className="flex flex-col gap-2.5">
                        {(isEn ? year.track4Only.itemsEn : year.track4Only.itemsId).map((item, i) => (
                          <BulletItem key={i} text={item} />
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
