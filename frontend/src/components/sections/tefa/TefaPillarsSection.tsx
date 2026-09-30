"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Briefcase, Building2, Award, Rocket } from "lucide-react";

export default function TefaPillarsSection() {
  const { lang, language } = useLanguage();
  const isEn = lang === "EN" || language === "en";

  const pillars = [
    {
      number: "01",
      icon: Briefcase,
      titleId: "Project-Based Learning (PBL)",
      titleEn: "Project-Based Learning (PBL)",
      descId:
        "Siswa belajar langsung melalui pengerjaan proyek riil berbasis pesanan industri, mulai dari analisis kebutuhan, implementasi, hingga deployment produk.",
      descEn:
        "Students learn directly through actual client-commissioned projects, covering requirement gathering, development, testing, and production deployment.",
    },
    {
      number: "02",
      icon: Building2,
      titleId: "Standar Ekosistem Telkom",
      titleEn: "Telkom Ecosystem Standard",
      descId:
        "Menerapkan standardisasi rekayasa perangkat lunak, infrastruktur jaringan, dan disiplin operasional selaras dengan ekosistem digital Telkom Group.",
      descEn:
        "Adopting enterprise software engineering, network infrastructure, and rigorous operational standards aligned with Telkom Group digital ecosystem.",
    },
    {
      number: "03",
      icon: Award,
      titleId: "Portofolio Karya Nyata",
      titleEn: "Real Verified Portfolio",
      descId:
        "Setiap lulusan memiliki rekam jejak portofolio proyek terverifikasi yang digunakan oleh dunia usaha dan dunia industri (DUDI).",
      descEn:
        "Every student builds a tangible, verified portfolio of production-grade digital solutions actively utilized by corporate partners and industry clients.",
    },
    {
      number: "04",
      icon: Rocket,
      titleId: "Solusi Komersial Siap Pakai",
      titleEn: "Commercial-Ready Solutions",
      descId:
        "Unit produksi aktif yang menyediakan layanan pembuatan website, aplikasi manajemen, instalasi jaringan, dan pemeliharaan IT terpercaya.",
      descEn:
        "An active production unit delivering robust website development, management systems, network installations, and reliable IT maintenance.",
    },
  ];

  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#f9fafb] border-b border-gray-200/60 overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header with Consistent Site Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          {/* Section Heading */}
          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl lg:text-[40px] leading-tight tracking-tight text-[#101828]">
            {isEn ? (
              <>
                4 Key Pillars of{" "}
                <span className="text-[#bc0c11]">Teaching Factory</span>
              </>
            ) : (
              <>
                4 Pilar Utama{" "}
                <span className="text-[#bc0c11]">Teaching Factory</span>
              </>
            )}
          </h2>

          <div className="section-title-line" />

          {/* Subtitle Description */}
          <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed max-w-2xl font-normal">
            {isEn
              ? "A comprehensive vocational model connecting theoretical foundations, enterprise workflows, and collaborative commercial execution."
              : "Model pembelajaran vokasi terpadu yang memadukan dasar kompetensi teknis, budaya kerja profesional, dan ekosistem produksi riil."}
          </p>
        </motion.div>

        {/* 4 Pillars Grid with Dashed Border Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative rounded-[24px] neu-card-interactive p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Icon & Number */}
                  <div className="flex items-center justify-between mb-6">
                    <Icon className="size-7 text-[#bc0c11] group-hover:text-[#990a0e] transition-colors duration-300 shrink-0" />
                    <span className="font-jakarta font-extrabold text-2xl text-gray-200 group-hover:text-[#bc0c11]/30 transition-colors select-none">
                      {item.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-jakarta font-bold text-lg text-[#101828] group-hover:text-[#bc0c11] transition-colors mb-2.5 leading-snug">
                    {isEn ? item.titleEn : item.titleId}
                  </h3>

                  {/* Description */}
                  <p className="font-jakarta text-sm text-[#4a5565] leading-relaxed">
                    {isEn ? item.descEn : item.descId}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
