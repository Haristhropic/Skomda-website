"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Ts21HeroSection() {
  const { isEn, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const scrollToFramework = () => {
    const el = document.getElementById("framework");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Close modal with ESC key & manage body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <section className="relative w-full overflow-hidden bg-[#f3f4f6] min-h-[100dvh] flex items-center pt-28 sm:pt-32 pb-16 sm:pb-20">
      <div className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 lg:px-8">
        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left: Text Content & Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            {/* Breadcrumbs - placed tightly right above the heading */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-jakarta text-[#4a5565] mb-3">
              <Link href="/" className="hover:text-[#bc0c11] transition-colors">
                {t("nav.home", "Beranda")}
              </Link>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[#9ca3af]">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <Link href="/program/profil-jurusan" className="hover:text-[#bc0c11] transition-colors">
                {t("nav.programs", "Program")}
              </Link>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[#9ca3af]">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-semibold text-[#101828]">{t("ts21.breadcrumb", "Program TS21")}</span>
            </nav>

            {/* Main Title */}
            <h1 className="font-jakarta font-bold text-3xl sm:text-4xl lg:text-[44px] leading-[1.18] tracking-tight text-[#101828] mb-4">
              {t("ts21.heroTitle1", "Kerangka Pembelajaran")}{" "}
              <span className="text-[#bc0c11]">{t("ts21.heroTitle2", "Abad ke-21 (TS.21)")}</span>
            </h1>

            {/* Red accent line */}
            <div className="h-[3px] w-14 rounded-full bg-[#bc0c11] mb-5 sm:mb-6" />

            {/* Description */}
            <p className="font-jakarta text-base sm:text-lg text-[#4a5565] leading-relaxed mb-8 max-w-2xl">
              {t(
                "ts21.heroDesc",
                "Metodologi pendidikan modern Telkom Schools yang menggabungkan penguasaan teknologi digital, pemecahan masalah kreatif, kolaborasi tim, dan pembentukan karakter akhlak mulia."
              )}
            </p>

            {/* Exact Website Standard Primary CTA Button */}
            <div>
              <button
                type="button"
                onClick={scrollToFramework}
                className="btn-primary group !px-7 !h-[50px] !min-h-[48px]"
              >
                <span className="font-jakarta font-medium text-[15px] leading-none whitespace-nowrap">
                  {t("ts21.heroCta")}
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Right: Signature Framed Diagram Image with Interactive Lightbox Zoom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-6 flex items-center justify-center relative"
          >
            <div className="relative w-full max-w-[580px]">
              {/* Main Image Container */}
              <div
                onClick={() => setIsOpen(true)}
                className="group relative w-full aspect-[16/10] rounded-[24px] neu-card-interactive p-2 sm:p-3 cursor-pointer overflow-hidden flex items-center justify-center"
              >
                <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-white flex items-center justify-center">
                  <Image
                    src="/images/program/ts21/ts21-framework.png"
                    alt="Framework Ekosistem Implementasi Kurikulum Merdeka TS 21.40 PLiS"
                    fill
                    unoptimized
                    className="object-contain group-hover:scale-[1.02] transition-transform duration-300"
                    priority
                  />
                </div>

                {/* Hover Overlay Hint */}
                <div className="absolute inset-0 bg-[#101828]/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white/95 text-[#101828] font-jakarta font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <ZoomIn className="size-4 text-[#bc0c11]" />
                    <span>{isEn ? "Click to enlarge" : "Klik untuk memperbesar"}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* High-Resolution Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative max-w-6xl w-full max-h-[92vh] bg-white rounded-2xl p-4 sm:p-6 overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-200">
                <div>
                  <h3 className="font-jakarta font-bold text-base sm:text-lg text-[#101828]">
                    {isEn
                      ? "TS 21.40 PLiS Independent Curriculum Implementation Ecosystem Framework"
                      : "Framework Ekosistem Implementasi Kurikulum Merdeka TS 21.40 PLiS"}
                  </h3>
                  <p className="font-jakarta text-xs text-[#6a7282]">
                    {isEn
                      ? "SMK Telkom Sidoarjo &bull; Steps Toward School 4.0"
                      : "SMK Telkom Sidoarjo &bull; Langkah Menuju Sekolah 4.0"}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="size-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label={isEn ? "Close" : "Tutup"}
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Image Area with Scroll */}
              <div className="relative flex-1 min-h-[360px] sm:min-h-[560px] w-full mt-4 overflow-auto rounded-xl bg-gray-50 flex items-center justify-center p-2">
                <div className="relative w-full h-full min-h-[460px]">
                  <Image
                    src="/images/program/ts21/ts21-framework.png"
                    alt="Diagram Framework Kurikulum TS21 Lengkap"
                    fill
                    unoptimized
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
