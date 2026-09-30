"use client";

import { motion } from "framer-motion";
import { HeartHandshake, Cpu, Compass, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const getFrameworkPillars = (isEn: boolean) => [
  {
    number: "01",
    title: "Soft Skill & TS Character",
    subtitle: isEn ? "Noble Character & Digital Ethics" : "Karakter Mulia & Etika Digital",
    desc: isEn
      ? "Character formation rooted in Akhlak, Pancasila Student Profile, and TS Character to nurture high-integrity digital talents."
      : "Pembentukan karakter berlandaskan Akhlak, Profil Pelajar Pancasila, dan TS Character untuk menghasilkan talenta berintegritas tinggi.",
    icon: <HeartHandshake className="size-6 transition-colors duration-300" />,
    points: isEn
      ? [
          "Cultivation of Noble Character and Moral Values",
          "6 Dimensions of Pancasila Student Profile",
          "TS Character: Integrity, Excellence, Totality",
          "Digital Communication & Collaboration Ethics",
        ]
      : [
          "Penanaman Akhlak & Budi Pekerti Luhur",
          "Penerapan 6 Dimensi Profil Pelajar Pancasila",
          "TS Character: Integrity, Excellence, Totality",
          "Etika Komunikasi & Kolaborasi Digital",
        ],
  },
  {
    number: "02",
    title: "Hard Skill & Digital Talent",
    subtitle: isEn ? "Industry 4.0 Technical Competencies" : "Kompetensi Teknis Industri 4.0",
    desc: isEn
      ? "Mastery of modern technical competencies in telecommunications, software programming, cloud computing, and international standard cybersecurity."
      : "Penguasaan keahlian teknis terkini di bidang telekomunikasi, pemrograman, komputasi awan, dan keamanan siber berstandar internasional.",
    icon: <Cpu className="size-6 transition-colors duration-300" />,
    points: isEn
      ? [
          "Applied Digital Literacy and Numeracy",
          "Fiber Optic & Network Engineering (TJAT)",
          "Software, Cloud & IoT Development (SIJA)",
          "National & Global Industry Certifications",
        ]
      : [
          "Penguasaan Literasi Digital & Numerasi Terapan",
          "Keahlian Rekayasa Jaringan & Fiber Optic (TJAT)",
          "Pengembangan Software, Cloud & IoT (SIJA)",
          "Sertifikasi Kompetensi Industri Nasional & Global",
        ],
  },
  {
    number: "03",
    title: "Life Skill Balance",
    subtitle: isEn ? "Resilience & Independent Living" : "Ketangguhan & Kemandirian Hidup",
    desc: isEn
      ? "Development of essential life skills: perseverance (grit), leadership, critical problem-solving, and entrepreneurship."
      : "Pengembangan kecakapan hidup yang proporsional antara daya juang (grit), kepemimpinan, pemecahan masalah kritis, dan jiwa wirausaha.",
    icon: <Compass className="size-6 transition-colors duration-300" />,
    points: isEn
      ? [
          "Critical Thinking & Real-World Problem Solving",
          "Leadership & Adaptability in the Disruption Era",
          "Technopreneurship & Creative Product Incubation",
          "Holistic Physical, Mental, and Emotional Health",
        ]
      : [
          "Critical Thinking & Real-World Problem Solving",
          "Kepemimpinan & Adaptabilitas di Era Disrupsi",
          "Technopreneurship & Inkubasi Produk Kreatif",
          "Keseimbangan Kesehatan Fisik, Mental, dan Emosional",
        ],
  },
];

export default function Ts21FrameworkSection() {
  const { isEn, t } = useLanguage();
  const frameworkPillars = getFrameworkPillars(isEn);

  return (
    <section
      id="framework"
      className="relative w-full py-20 lg:py-28 bg-white border-t border-gray-200/60 overflow-hidden scroll-mt-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl lg:text-[40px] leading-tight tracking-tight text-[#101828]">
            {isEn ? (
              <>
                TS.21 Framework{" "}
                <span className="text-[#bc0c11]">SMK Telkom Sidoarjo</span>
              </>
            ) : (
              <>
                Framework TS.21{" "}
                <span className="text-[#bc0c11]">SMK Telkom Sidoarjo</span>
              </>
            )}
          </h2>
          <div className="h-[3px] w-12 rounded-full bg-[#bc0c11] mt-5 mb-2" />
          <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed mt-2">
            {isEn
              ? "Implementing TS.21 Independent Curriculum with balanced weighting between Attitude/Character and Knowledge/Skills for holistic student development."
              : "Mengimplementasikan Kurikulum Merdeka TS.21 dengan alokasi bobot proporsional antara Attitude / Character dan Knowledge / Skill untuk memastikan perkembangan holistik pada setiap siswa."}
          </p>
        </motion.div>

        {/* 3 Pillars: Mobile Horizontal Scroll & Desktop Grid */}
        <div dir="ltr" className="flex justify-start overflow-x-auto pb-5 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 snap-x snap-proximity scroll-pl-4 sm:scroll-pl-0 overscroll-x-contain scrollbar-none">
          {frameworkPillars.map((pillar) => (
            <div
              key={pillar.number}
              className="w-[84vw] max-w-[340px] shrink-0 snap-start sm:w-auto sm:max-w-none group relative rounded-[28px] bg-white p-6 sm:p-9 flex flex-col justify-between border-2 border-dashed border-[#d1d5dc] transition-all duration-300 hover:border-[#bc0c11] hover:shadow-md"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-jakarta font-extrabold text-3xl text-[#bc0c11]/40 group-hover:text-[#bc0c11] transition-colors">
                    {pillar.number}
                  </span>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#bc0c11]/10 text-[#bc0c11] group-hover:bg-[#bc0c11] group-hover:text-white transition-all duration-300 shadow-xs">
                    {pillar.icon}
                  </div>
                </div>

                {/* Subtitle & Title */}
                <span className="text-xs font-semibold text-[#bc0c11] font-jakarta block mb-1">
                  {pillar.subtitle}
                </span>
                <h3 className="font-jakarta font-bold text-xl text-[#101828] group-hover:text-[#bc0c11] transition-colors mb-3 leading-snug">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] leading-relaxed mb-6">
                  {pillar.desc}
                </p>

                {/* Checklist Points */}
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
                  {pillar.points.map((pt) => (
                    <div key={pt} className="flex items-start gap-2.5 text-xs sm:text-sm font-jakarta text-[#374151]">
                      <CheckCircle2 className="size-4 text-[#bc0c11] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Holistic Balance Callout Card */}
        <div className="rounded-[28px] bg-[#f9fafb] p-8 sm:p-10 border-2 border-dashed border-[#d1d5dc]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 flex flex-col gap-2">
              <h3 className="font-jakarta font-bold text-xl sm:text-2xl text-[#101828]">
                {isEn ? "Balance of Attitude, Knowledge, and Skills" : "Keseimbangan Attitude, Knowledge, dan Skill"}
              </h3>
              <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] leading-relaxed mt-1">
                {isEn
                  ? "A solid character foundation ensures that students' technical skills are utilized responsibly and ethically amidst rapid advances in AI and industry automation."
                  : "Pondasi karakter yang kokoh menjamin kemampuan teknis siswa dapat dimanfaatkan secara bertanggung jawab dan beretika di tengah pesatnya kemajuan teknologi kecerdasan buatan dan otomasi industri."}
              </p>
            </div>
            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
              <div className="p-3.5 rounded-xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-between">
                <span className="font-jakarta font-bold text-xs sm:text-sm text-[#101828]">
                  {isEn ? "Character & Attitude" : "Karakter & Sikap"}
                </span>
                <span className="font-jakarta font-bold text-xs sm:text-sm text-[#bc0c11]">
                  {isEn ? "Proportional" : "Proporsional"}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-between">
                <span className="font-jakarta font-bold text-xs sm:text-sm text-[#101828]">
                  {isEn ? "Vocational Competency" : "Kompetensi Kejuruan"}
                </span>
                <span className="font-jakarta font-bold text-xs sm:text-sm text-[#bc0c11]">
                  {isEn ? "Industry Standard" : "Standar Industri"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
