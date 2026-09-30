"use client";

import { motion } from "framer-motion";
import {
  MonitorSmartphone,
  FolderGit2,
  LayoutGrid,
  BriefcaseBusiness,
  Users,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const getMethods = (isEn: boolean) => [
  {
    icon: <MonitorSmartphone className="size-6 transition-colors duration-300" />,
    title: "Blended & Hybrid Learning",
    tagline: isEn ? "Flexible, Standardized, ICT-Driven" : "Fleksibel, Terstandardisasi, Berbasis ICT",
    desc: isEn
      ? "Combining interactive classroom learning with self-paced online modules on the school's integrated LMS platform."
      : "Menggabungkan interaksi tatap muka interaktif di sekolah dengan pembelajaran digital mandiri melalui platform LMS terintegrasi.",
  },
  {
    icon: <FolderGit2 className="size-6 transition-colors duration-300" />,
    title: "Project-Based Learning (PjBL)",
    tagline: isEn ? "Authentic Case Studies & Live Challenges" : "Studi Kasus & Tantangan Riil",
    desc: isEn
      ? "Students work in collaborative teams on industry projects, sharpening problem-solving, engineering execution, and project management."
      : "Siswa mengerjakan portofolio proyek industri secara berkelompok, mengasah pemecahan masalah, eksekusi teknis, dan manajemen waktu.",
  },
  {
    icon: <LayoutGrid className="size-6 transition-colors duration-300" />,
    title: "Studio Classroom Environment",
    tagline: isEn ? "Professional Work Atmosphere" : "Suasana Kerja Profesional",
    desc: isEn
      ? "Modern studio-style classroom layouts stimulating creative brainstorming, peer discussions, and active team collaboration."
      : "Desain ruang belajar bergaya studio kerja modern yang menstimulasi ide kreatif, kolaborasi tim, dan diskusi aktif antar siswa.",
  },
  {
    icon: <BriefcaseBusiness className="size-6 transition-colors duration-300" />,
    title: "Teaching Factory & Magang PKL",
    tagline: isEn ? "Direct Industry Immersion" : "Terjun Langsung ke Industri",
    desc: isEn
      ? "Intensive apprenticeship at corporate partners and school production centers, mentored directly by seasoned industry practitioners."
      : "Pengalaman magang intensif di perusahaan mitra dan sentra inovasi sekolah, didampingi langsung oleh praktisi industri profesional.",
  },
];

export default function Ts21MetodeSection() {
  const { isEn } = useLanguage();
  const methods = getMethods(isEn);

  return (
    <section
      id="metode"
      className="relative w-full py-20 lg:py-28 bg-[#f9fafb] border-t border-gray-200/60 overflow-hidden scroll-mt-24"
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
                Learning Methodologies:{" "}
                <span className="text-[#bc0c11]">KBM 21.40 Plis</span>
              </>
            ) : (
              <>
                Metode Pembelajaran <span className="text-[#bc0c11]">KBM 21.40 Plis</span>
              </>
            )}
          </h2>
          <div className="section-title-line" />
          <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed mt-2">
            {isEn
              ? "Standardized, student-centered, innovative, and engaging learning processes to cultivate resilient 21st-century graduates."
              : "Proses kegiatan belajar mengajar yang terstandardisasi, berpusat pada siswa (student-centered), interaktif, inovatif, dan menyenangkan untuk mencetak generasi tangguh abad ke-21."}
          </p>
        </motion.div>

        {/* 4 Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {methods.map((item) => (
            <div
              key={item.title}
              className="group relative rounded-[24px] neu-card-interactive p-7 flex flex-col justify-between"
            >
              <div>
                {/* Top Icon Badge */}
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#bc0c11]/10 text-[#bc0c11] group-hover:bg-[#bc0c11] group-hover:text-white transition-all duration-300 shadow-xs mb-5">
                  {item.icon}
                </div>

                {/* Subtitle / Tagline */}
                <span className="text-xs font-semibold text-[#bc0c11] font-jakarta block mb-1">
                  {item.tagline}
                </span>

                {/* Title */}
                <h3 className="font-jakarta font-bold text-lg text-[#101828] group-hover:text-[#bc0c11] transition-colors leading-snug mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="font-jakarta text-xs sm:text-sm text-[#4a5565] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
