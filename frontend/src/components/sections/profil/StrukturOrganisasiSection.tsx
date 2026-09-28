"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function StrukturOrganisasiSection() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, t } = useLanguage();

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
    <section id="struktur-organisasi" className="relative w-full py-20 lg:py-28 bg-[#f3f4f6] overflow-hidden scroll-mt-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Heading & Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col items-start"
          >
            <div className="mb-6">
              <h2 className="font-jakarta font-bold text-3xl sm:text-4xl text-[#101828] leading-tight">
                {t("profilSekolah.strukturTitle", "Struktur Organisasi")} <br />
                <span className="text-[#e7000b]">SMK Telkom Sidoarjo</span>
              </h2>
              <div className="mt-3.5 h-[3px] w-14 bg-[#bc0c11] rounded-full" />
            </div>

            <p className="font-jakarta text-base sm:text-lg text-[#364153] leading-relaxed">
              {t("profilSekolah.strukturDesc")}
            </p>
          </motion.div>

          {/* Right Column: Chart Image Card with Interactive Modal & Zoom Button */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-center justify-center"
          >
            <div
              onClick={() => setIsOpen(true)}
              className="group relative w-full max-w-[593px] bg-white rounded-2xl p-4 sm:p-5 border border-[#e5e7eb] shadow-[0px_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0px_20px_40px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Image Container with Hover Zoom Overlay */}
              <div className="relative w-full aspect-[593/511] rounded-xl overflow-hidden bg-gray-50/50 flex items-center justify-center">
                <Image
                  src="/images/tentang-kami/profil-sekolah/struktur-organisasi.png"
                  alt="Struktur Organisasi SMK Telkom Sidoarjo"
                  fill
                  className="object-contain group-hover:scale-102 transition-transform duration-300"
                  priority
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-xs text-[#101828] text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                    <span>{lang === "EN" ? "Click to view full chart" : "Klik untuk memperbesar"}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar below image */}
              <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs sm:text-sm font-jakarta px-1">
                <span className="text-[#6a7282]">
                  {lang === "EN" ? "Official ISO 21001:2018 Chart" : "Bagan Resmi ISO 21001:2018"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 text-[#bc0c11] hover:text-[#990a0e] font-semibold hover:underline cursor-pointer"
                >
                  <span>{lang === "EN" ? "Open Fullscreen" : "Buka Layar Penuh"}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                </button>
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
                    {lang === "EN" ? "Organizational Structure of SMK Telkom Sidoarjo" : "Struktur Organisasi SMK Telkom Sidoarjo"}
                  </h3>
                  <p className="font-jakarta text-xs text-[#6a7282]">
                    {lang === "EN" ? "Official Chart • ISO 21001:2018 Quality Standard" : "Bagan Resmi • Standar Penjaminan Mutu ISO 21001:2018"}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="size-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label={lang === "EN" ? "Close" : "Tutup"}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Modal Image Area with Scroll / Zoom */}
              <div className="relative flex-1 min-h-[400px] sm:min-h-[560px] w-full mt-4 overflow-auto rounded-xl bg-gray-50 flex items-center justify-center p-2">
                <div className="relative w-full h-full min-h-[460px]">
                  <Image
                    src="/images/tentang-kami/profil-sekolah/struktur-organisasi.png"
                    alt="Diagram Bagan Struktur Organisasi Lengkap"
                    fill
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
