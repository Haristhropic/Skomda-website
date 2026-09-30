"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PpdbHeroSectionProps {
  onOpenBrochure?: () => void;
}

export default function PpdbHeroSection({ onOpenBrochure }: PpdbHeroSectionProps) {
  const { isEn } = useLanguage();

  return (
    <section className="relative w-full pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-36 lg:pb-24 bg-[#f3f4f6] overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Left Column: Text Content (Col 7) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start"
          >

            {/* Main Headline */}
            <h1 className="font-jakarta font-bold text-4xl sm:text-5xl lg:text-[52px] leading-[1.12] tracking-tight text-[#101828] mb-5">
              {isEn ? (
                <>
                  Saatnya Menjadi Versi{" "}
                  <span className="text-[#bc0c11]">Terbaikmu</span>
                </>
              ) : (
                <>
                  Saatnya Menjadi Versi{" "}
                  <span className="text-[#bc0c11]">Terbaikmu</span>
                </>
              )}
            </h1>

            {/* Description */}
            <p className="font-jakarta text-base sm:text-lg text-[#364153] leading-relaxed max-w-xl mb-8 sm:mb-9">
              {isEn
                ? "Join SMK Telkom Sidoarjo, where digital talents grow, create, and make a real impact on Indonesia's future."
                : "Bergabunglah dengan SMK Telkom Sidoarjo, tempat bagi talenta digital untuk tumbuh, berkarya, dan berdampak bagi masa depan Indonesia"}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
              <a
                href="https://ppdb.telkomschools.sch.id/signup?lemdik=4"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-[#bc0c11] px-7 sm:px-8 py-3.5 sm:py-4 min-h-[48px] font-jakarta font-semibold text-[15px] sm:text-base text-white transition-all duration-300 hover:bg-[#990a0e] active:scale-[0.98] cursor-pointer shadow-card-cta"
                style={{
                  boxShadow:
                    "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
                }}
              >
                <span>{isEn ? "Register Now" : "Daftar Sekarang"}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
              </a>

              <button
                type="button"
                onClick={onOpenBrochure}
                className="group inline-flex items-center gap-2.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 hover:border-[#bc0c11] hover:text-[#bc0c11] px-7 sm:px-8 py-3.5 sm:py-4 min-h-[48px] font-jakarta font-semibold text-[15px] sm:text-base text-[#364153] transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-xs"
              >
                <Eye className="w-4 h-4 text-current transition-transform duration-300 group-hover:scale-110 shrink-0" />
                <span>{isEn ? "View Brochure" : "Lihat Brosur"}</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual from (Col 5) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[560px] aspect-[620/413]">
              <Image
                src="/images/ppdb/hero-student.png"
                alt="Siswa SMK Telkom Sidoarjo SPMB 2026/2027"
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 560px"
                className="object-contain drop-shadow-xl"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
