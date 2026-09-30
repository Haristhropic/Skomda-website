"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface AlurStep {
  step: string;
  phase: string;
  title: string;
  description: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function AlurKerjasamaSection() {
  const { lang, t } = useLanguage();

  const alurSteps: AlurStep[] = [
    {
      step: "01",
      phase: lang === "EN" ? "Exploration Phase" : "Tahap Eksplorasi",
      title: t("hubIndustri.alur1Title", "Inisiasi & Konsultasi"),
      description: t("hubIndustri.alur1Desc"),
    },
    {
      step: "02",
      phase: lang === "EN" ? "Legality & Commitment" : "Legalitas & Komitmen",
      title: t("hubIndustri.alur2Title", "Perjanjian Kerjasama (MoU)"),
      description: t("hubIndustri.alur2Desc"),
    },
    {
      step: "03",
      phase: lang === "EN" ? "Program Execution" : "Eksekusi Kolaborasi",
      title: t("hubIndustri.alur3Title", "Implementasi Program"),
      description: t("hubIndustri.alur3Desc"),
    },
    {
      step: "04",
      phase: lang === "EN" ? "Quality Review" : "Monitoring Mutu",
      title: t("hubIndustri.alur4Title", "Evaluasi & Pengembangan"),
      description: t("hubIndustri.alur4Desc"),
    },
  ];

  return (
    <section id="alur-kerjasama" className="relative w-full py-20 lg:py-28 bg-white border-t border-gray-200/60 overflow-hidden scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl leading-tight tracking-tight text-[#101828]">
            {t("hubIndustri.alurTitle", "Alur Kerjasama Kemitraan")}
          </h2>
          <div className="section-title-line" />
          <p className="font-jakarta text-base text-[#4a5565] max-w-[560px] leading-relaxed">
            {t("hubIndustri.alurSubtitle", "Langkah terstruktur dalam membangun kolaborasi strategis bersama SMK Telkom Sidoarjo.")}
          </p>
        </motion.div>

        {/* 4-Step Process Flow Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {alurSteps.map((item) => (
            <motion.div
              key={item.step}
              variants={cardVariants}
              className="relative group rounded-[24px] neu-card-interactive p-6 sm:p-7 flex flex-col gap-3"
            >
              {/* Step Number Header */}
              <div className="mb-2">
                <span className="font-jakarta font-extrabold text-3xl text-[#bc0c11] select-none">
                  {item.step}
                </span>
              </div>

              {/* Phase Tag */}
              <span className="inline-block text-[11px] font-semibold tracking-wider text-[#6b7280] uppercase font-jakarta">
                {item.phase}
              </span>

              {/* Title */}
              <h3 className="font-jakarta font-bold text-lg sm:text-[19px] text-[#101828] leading-snug">
                {item.title}
              </h3>

              {/* Description */}
              <p className="font-jakarta text-sm text-[#4a5565] leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
