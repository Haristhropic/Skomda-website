"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Check } from "lucide-react";

export default function TefaAboutSection() {
  const { lang, language } = useLanguage();
  const isEn = lang === "EN" || language === "en";

  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-white border-y border-gray-200/70 overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading & Description */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col items-start"
          >

            {/* Section Heading */}
            <h2 className="font-jakarta font-bold text-3xl sm:text-4xl lg:text-[40px] leading-tight tracking-tight text-[#101828] mb-3">
              {isEn ? (
                <>
                  Building Competencies,{" "}
                  <span className="text-[#bc0c11]">Delivering Real Impact</span>
                </>
              ) : (
                <>
                  Membentuk Kompetensi,{" "}
                  <span className="text-[#bc0c11]">Menghasilkan Karya Nyata</span>
                </>
              )}
            </h2>

            {/* Signature Red Accent Bar */}
            <div className="h-1 w-12 rounded-full bg-[#bc0c11] mb-4" />

            {/* Body Description */}
            <p className="font-jakarta text-sm sm:text-base text-[#4a5565] leading-relaxed max-w-xl mb-6 font-normal">
              {isEn
                ? "Teaching Factory (TEFA) at SMK Telkom Sidoarjo bridges education and industry. Students do not just learn theory, but engage directly in real-world production workflows, enterprise projects, and commercial collaboration with certified industry partners."
                : "Teaching Factory (TEFA) di SMK Telkom Sidoarjo menjadi jembatan antara dunia pendidikan dan industri. Siswa tidak hanya belajar teori, tetapi juga terlibat langsung dalam alur produksi nyata, proyek industri, dan kolaborasi komersial bersama mitra profesional."}
            </p>

            {/* Highlights List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 w-full max-w-xl">
              <div className="flex items-center gap-2.5">
                <div className="size-5 rounded-full bg-[#bc0c11]/10 flex items-center justify-center shrink-0">
                  <Check className="size-3 text-[#bc0c11]" strokeWidth={2.5} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#101828] font-jakarta">
                  {isEn ? "Industry Standard Workflow" : "Alur Kerja Standar Industri"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="size-5 rounded-full bg-[#bc0c11]/10 flex items-center justify-center shrink-0">
                  <Check className="size-3 text-[#bc0c11]" strokeWidth={2.5} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#101828] font-jakarta">
                  {isEn ? "Real Commercial Projects" : "Proyek Riil & Komersial"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="size-5 rounded-full bg-[#bc0c11]/10 flex items-center justify-center shrink-0">
                  <Check className="size-3 text-[#bc0c11]" strokeWidth={2.5} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#101828] font-jakarta">
                  {isEn ? "Mentored by Practitioners" : "Bimbingan Praktisi Ahli"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="size-5 rounded-full bg-[#bc0c11]/10 flex items-center justify-center shrink-0">
                  <Check className="size-3 text-[#bc0c11]" strokeWidth={2.5} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#101828] font-jakarta">
                  {isEn ? "Ready-to-Use Solutions" : "Solusi Digital Siap Pakai"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Building Image & Overlapping Quote Card nodes 216:9, 216:12, 216:14, 216:15) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-6 relative mt-6 lg:mt-0 flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[554px]">
              {/* Main Building Photo w:554, h:318, rounded-[16px]) */}
              <div className="relative w-full aspect-[554/318] rounded-[16px] overflow-hidden shadow-md border border-gray-200/80 bg-gray-100">
                <Image
                  src="/images/tefa/tefa-building.png"
                  alt={
                    isEn
                      ? "Teaching Factory Building SMK Telkom Sidoarjo"
                      : "Gedung Teaching Factory SMK Telkom Sidoarjo"
                  }
                  fill
                  sizes="(max-width: 1024px) 100vw, 554px"
                  className="object-cover object-center"
                />
              </div>

              {/* Overlapping Floating Quote Card w:270, h:126, rounded-[16px]) */}
              <div className="absolute -top-6 -left-4 sm:-top-8 sm:-left-6 lg:-top-7 lg:-left-7 z-10 max-w-[260px] sm:max-w-[280px] bg-white rounded-[16px] px-5 py-4 sm:px-6 sm:py-5 shadow-[0px_10px_30px_rgba(0,0,0,0.1)] border border-gray-100">
                {/* Red Quote Mark text-[#e7000b]) */}
                <div className="text-[#e7000b] text-4xl sm:text-5xl font-serif font-bold leading-none -mb-1 select-none">
                  “
                </div>
                <blockquote className="font-jakarta text-xs sm:text-[13px] font-semibold text-[#787878] leading-[20px] sm:leading-[22px]">
                  {isEn
                    ? "“TEFA shapes students into productive, competent, and career-ready professionals”"
                    : "“TEFA membentuk siswa menjadi pribadi yang produktif, kompeten, dan siap kerja”"}
                </blockquote>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
